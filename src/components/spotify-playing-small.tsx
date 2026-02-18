import { useEffect, useRef, useState } from "react";
import type {
  CurrentlyPlaying,
  EpisodeObject,
  TrackObject,
} from "@/types/spotify";

function isEpisodeObject(
  item: CurrentlyPlaying["item"],
): item is EpisodeObject {
  return item != null && typeof item === "object" && "show" in item;
}

type ColourFromImageResponse = {
  hex: string;
  oppositeHex: string;
};

const formatName = (name: string) => {
  if (!name) return name;
  let newName = name;
  const thingsToRemove = [
    " \\(with",
    " \\(feat",
    " \\(from",
    " \\(ft",
    " \\[with",
    " \\[feat",
    " \\[from",
    " \\[ft",
  ];
  for (const thing of thingsToRemove) {
    const regex = new RegExp(thing, "i");
    newName = newName.split(regex)[0];
  }
  return newName;
};

export function SpotifyPlayingSmall() {
  const [track, setTrack] = useState<CurrentlyPlaying | null>(null);
  const [colours, setColours] = useState<ColourFromImageResponse | null>(null);
  const hasFetchedOnce = useRef(false);

  // get track data
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/spotify");
      const data = await res.json();
      setTrack(data);
      hasFetchedOnce.current = true;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const albumArtUrl =
    track?.item && !isEpisodeObject(track.item)
      ? track.item.album.images[0]?.url
      : undefined;

  useEffect(() => {
    if (!albumArtUrl) {
      setColours(null);
      return;
    }

    let cancelled = false;

    const fetchColours = async () => {
      const res = await fetch("/api/colourFromImage", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: albumArtUrl,
      });

      if (!res.ok) {
        return;
      }

      const data = (await res.json()) as ColourFromImageResponse;
      if (!cancelled) {
        setColours(data);
      }
    };

    fetchColours();

    return () => {
      cancelled = true;
    };
  }, [albumArtUrl]);

  if (!hasFetchedOnce.current) return null;

  if (
    hasFetchedOnce.current &&
    (!track || !track.item || isEpisodeObject(track.item))
  ) {
    return null;
  }
  const item = track?.item as TrackObject;
  if (item) {
    return (
      <a
        className="flex items-center gap-2 px-1 py-1 pr-2"
        style={{
          backgroundColor: colours?.hex,
          color: colours?.oppositeHex,
        }}
        href={item.external_urls.spotify}
      >
        <img
          src={item.album.images[0]?.url}
          alt="Album Art"
          className="w-12 h-12"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{formatName(item.name)}</span>
          <span className="text-xs" style={{ color: colours?.oppositeHex }}>
            {item.artists.map((artist) => artist.name).join(", ")}
          </span>
        </div>
      </a>
    );
  }

  return null;
}
