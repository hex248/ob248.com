import lodash from "lodash";

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

  return currentlyPlaying;
};

export default async function handler(_req: any, res: any) {
  const currentlyPlaying = await getCurrentlyPlaying();
  res.status(200).json(currentlyPlaying);
}
