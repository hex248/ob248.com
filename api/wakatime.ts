import { existsSync, readFileSync, writeFileSync } from "node:fs";

const CONFIG_PATH = `${process.cwd()}/wakatime.json`;
const REFRESH_WINDOW_SECONDS = 10 * 60;

type WakaConfig = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
};

type TokenState = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
};

const parseRefreshPayload = (
  text: string,
): WakaConfig & { expires_in?: number | string } => {
  try {
    return JSON.parse(text) as WakaConfig & { expires_in?: number | string };
  } catch {
    const params = new URLSearchParams(text);
    return {
      access_token: params.get("access_token") ?? undefined,
      refresh_token: params.get("refresh_token") ?? undefined,
      expires_in: params.get("expires_in") ?? undefined,
    };
  }
};

const toEpochSeconds = (
  value: number | string | null | undefined,
): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed > 1_000_000_000_000
    ? Math.floor(parsed / 1000)
    : Math.floor(parsed);
};

const refresh = async (refreshToken: string): Promise<TokenState> => {
  const body = new URLSearchParams({
    client_id: process.env.WAKATIME_CLIENT_ID ?? "",
    client_secret: process.env.WAKATIME_CLIENT_SECRET ?? "",
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  if (process.env.WAKATIME_REDIRECT_URI) {
    body.set("redirect_uri", process.env.WAKATIME_REDIRECT_URI);
  }

  const response = await fetch("https://wakatime.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Failed to refresh token (status ${response.status}): ${text}`,
    );
  }

  const parsed = parseRefreshPayload(text);
  const accessToken = parsed.access_token ?? null;
  const nextRefreshToken = parsed.refresh_token ?? null;
  const expiresIn = Number(parsed.expires_in ?? 0);

  if (
    !accessToken ||
    !nextRefreshToken ||
    !Number.isFinite(expiresIn) ||
    expiresIn <= 0
  ) {
    throw new Error(`Invalid token response: ${text}`);
  }

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    expiresAt: Math.floor(Date.now() / 1000) + expiresIn,
  };
};

export default async function handler(_req: any, res: any) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const envAccessToken = process.env.WAKATIME_ACCESS_TOKEN ?? null;
    const envRefreshToken = process.env.WAKATIME_REFRESH_TOKEN ?? null;
    const envExpiresAt = toEpochSeconds(process.env.WAKATIME_EXPIRES_AT);

    let fileConfig: WakaConfig = {};
    if (existsSync(CONFIG_PATH)) {
      fileConfig = JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as WakaConfig;
    }

    if (existsSync(CONFIG_PATH) && (envRefreshToken || envExpiresAt !== null)) {
      const nextConfig: WakaConfig = {
        ...fileConfig,
        ...(envRefreshToken ? { refresh_token: envRefreshToken } : {}),
        ...(envExpiresAt !== null ? { expires_at: envExpiresAt } : {}),
      };

      if (JSON.stringify(nextConfig) !== JSON.stringify(fileConfig)) {
        writeFileSync(CONFIG_PATH, JSON.stringify(nextConfig, null, 2));
        fileConfig = nextConfig;
      }
    }

    const tokenState: TokenState = {
      accessToken: fileConfig.access_token ?? envAccessToken,
      refreshToken: fileConfig.refresh_token ?? envRefreshToken,
      expiresAt: toEpochSeconds(fileConfig.expires_at) ?? envExpiresAt,
    };

    if (!tokenState.accessToken && !tokenState.refreshToken) {
      res.status(500).json({
        message:
          "No token available (wakatime.json missing and env tokens not set)",
      });
      return;
    }

    const shouldRefresh =
      tokenState.expiresAt !== null &&
      tokenState.expiresAt - now <= REFRESH_WINDOW_SECONDS;

    const result =
      shouldRefresh && tokenState.refreshToken
        ? await refresh(tokenState.refreshToken)
        : tokenState;

    res.status(200).json({
      message: "ok",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get access token" });
  }
}
