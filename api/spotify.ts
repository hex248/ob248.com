import lodash from "lodash";
import { Vibrant } from "node-vibrant/node";

type ColourFromImageResponse = {
  hex: string;
  oppositeHex: string;
};

const { pick } = lodash;

const getAccessToken = async (): Promise<string> => {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN as string;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (response.status !== 200) {
    return "";
  }

  const json = await response.json();
  return json.access_token as string;
};

const getCurrentlyPlaying = async () => {
  const accessToken = await getAccessToken();
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode,track",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status === 204) {
    return {
      id: "none (no content)",
      message: "No content",
      item: undefined,
    };
  }

  if (response.status !== 200) {
    return {
      id: "none (fail)",
      message: "failed",
      item: undefined,
    };
  }

  const json = await response.json();
  let colours: ColourFromImageResponse | null = null;

  if (json.currently_playing_type === "track") {
    const albumArtUrl = json.item?.album?.images?.[0]?.url;
    if (albumArtUrl) {
      colours = await getColoursFromImagePath(albumArtUrl);
    }
  }

  let isPlaylist = false;
  let playlistName = "";
  let playlistImage = "";
  let playlistAuthor = "";
  let playlistDescription = "";

  if (json.context?.uri === "spotify:playlist:37i9dQZF1EYkqdzj48dyYq") {
    isPlaylist = false;
  } else if (json.context?.type === "playlist") {
    const playlistRes = await fetch(json.context.href, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const playlistJson = await playlistRes.json();
    isPlaylist = true;
    playlistName = playlistJson.name;
    if (playlistJson.images && playlistJson.images.length > 0) {
      playlistImage = playlistJson.images[0].url;
    } else {
      playlistImage = "/placeholder.png";
    }
    playlistAuthor = playlistJson.owner?.display_name;
    playlistDescription = playlistJson.description;
  }

  const currentPlayingKeys: string[] = [
    "id",
    "device",
    "repeat_state",
    "shuffle_state",
    "timestamp",
    "progress_ms",
    "is_playing",
    "currently_playing_type",
    "item",
    "isPlaylist",
    "playlistName",
    "playlistImage",
    "playlistAuthor",
    "playlistDescription",
  ];

  const currentlyPlaying = pick(json, currentPlayingKeys) as Record<
    string,
    any
  >;
  currentlyPlaying.message = "ok";
  currentlyPlaying.id = json.item?.id || "no id";
  currentlyPlaying.isPlaylist = isPlaylist;
  currentlyPlaying.playlistName = playlistName;
  currentlyPlaying.playlistImage = playlistImage;
  currentlyPlaying.playlistAuthor = playlistAuthor;
  currentlyPlaying.playlistDescription = playlistDescription;
  currentlyPlaying.colours = colours;

  return currentlyPlaying;
};

const getColoursFromImagePath = async (
  path: string,
): Promise<ColourFromImageResponse | null> => {
  try {
    const palette = await Vibrant.from(path).getPalette();
    const vibrantSwatch = palette.Vibrant;
    const mutedSwatch = palette.Muted;
    const vibrantPopulation = vibrantSwatch?.population ?? 0;
    const mutedPopulation = mutedSwatch?.population ?? 0;
    const vibrantHsl = vibrantSwatch?.hsl;
    const mutedHsl = mutedSwatch?.hsl;

    let bg: [number, number, number] = [0, 0, 0];
    if (vibrantPopulation > mutedPopulation + 600 && vibrantHsl) {
      bg = vibrantHsl;
    } else if (mutedPopulation > 0 && mutedHsl) {
      bg = mutedHsl;
    }

    const fg = contrast(bg[0], bg[1], bg[2] * 100);

    const hex = convertToHexFromHSL(bg[0] * 360, bg[1] * 100, bg[2] * 100);
    const oppositeHex = convertToHexFromHSL(
      fg[0] * 360,
      fg[1] * 100,
      fg[2] * 100,
    );

    return {
      hex,
      oppositeHex,
    };
  } catch {
    return null;
  }
};

const convertToHexFromHSL = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const contrast = (h: number, s: number, l: number) => {
  const oppositeLightness = l < 50 ? l + 50 : l - 50;
  return [h, s, oppositeLightness / 100] as const;
};

export default async function handler(_req: any, res: any) {
  const currentlyPlaying = await getCurrentlyPlaying();
  res.status(200).json(currentlyPlaying);
}
