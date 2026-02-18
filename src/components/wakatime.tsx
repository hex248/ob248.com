import { useEffect, useState } from "react";

type WakaHeartbeat = {
  time?: number;
};

type WakaStats = {
  total_seconds?: number;
  total_seconds_including_other_language?: number;
};

type WakaResponse = {
  heartbeat?: WakaHeartbeat[];
  stats?: WakaStats;
};

const THIRTY_MINUTES_SECONDS = 30 * 60;

function getLatestHeartbeatTime(
  heartbeats: WakaHeartbeat[] | undefined,
): number | null {
  if (!Array.isArray(heartbeats) || heartbeats.length === 0) {
    return null;
  }

  let latest = -Infinity;
  for (const heartbeat of heartbeats) {
    if (typeof heartbeat.time === "number" && heartbeat.time > latest) {
      latest = heartbeat.time;
    }
  }

  return Number.isFinite(latest) ? latest : null;
}

function getWeeklyHours(stats: WakaStats | undefined): string {
  const totalSeconds =
    stats?.total_seconds_including_other_language ?? stats?.total_seconds ?? 0;
  return (totalSeconds / 3600).toFixed(1);
}

export function Wakatime() {
  const [data, setData] = useState<WakaResponse | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchWakatime = async () => {
      try {
        const response = await fetch("/api/wakatime");
        if (!response.ok) {
          return;
        }

        const json = (await response.json()) as WakaResponse;
        if (!cancelled) {
          setData(json);
          setHasFetched(true);
        }
      } catch {
        if (!cancelled) {
          setHasFetched(true);
        }
      }
    };

    fetchWakatime();
    const interval = setInterval(fetchWakatime, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const latestHeartbeat = getLatestHeartbeatTime(data?.heartbeat);
  const now = Date.now() / 1000;
  const isCodingNow =
    latestHeartbeat !== null && now - latestHeartbeat <= THIRTY_MINUTES_SECONDS;
  const weeklyHours = getWeeklyHours(data?.stats);

  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="size-2 rounded-full"
        style={{
          backgroundColor: isCodingNow ? "#22c55e" : "#6b7280",
        }}
      />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold">
          {hasFetched
            ? isCodingNow
              ? "currently coding"
              : "not coding"
            : "loading..."}
        </span>
        <span className="text-xs">last 7 days: {weeklyHours}h</span>
      </div>
    </div>
  );
}
