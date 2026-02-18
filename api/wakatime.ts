import { existsSync, readFileSync, writeFileSync } from "node:fs";

const refresh = async (refreshToken: string) => {
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

  if (response.status !== 200) {
    throw new Error(
      `Failed to refresh token (status ${response.status}): ${text}`,
    );
  }

  let parsed: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number | string;
  } | null = null;

  try {
    parsed = JSON.parse(text);
  } catch {
    const params = new URLSearchParams(text);
    parsed = {
      access_token: params.get("access_token") ?? undefined,
      refresh_token: params.get("refresh_token") ?? undefined,
      expires_in: params.get("expires_in") ?? undefined,
    };
  }

  const accessToken = parsed?.access_token ?? null;
  const nextRefreshToken = parsed?.refresh_token ?? null;
  const expiresIn = Number(parsed?.expires_in ?? 0);

  if (
    !accessToken ||
    !nextRefreshToken ||
    !Number.isFinite(expiresIn) ||
    expiresIn <= 0
  ) {
    throw new Error(`Invalid token response: ${text}`);
  }

  const expiresAt = Math.floor(Date.now() / 1000) + Number(expiresIn);

  console.log(accessToken);
  console.log(nextRefreshToken);
  console.log(expiresAt);

  return { accessToken, refreshToken: nextRefreshToken, expiresAt };
};

export default async function handler(_req: any, res: any) {
  try {
    const configPath = `${process.cwd()}/wakatime.json`;
    const envRefreshToken = process.env.WAKATIME_REFRESH_TOKEN ?? null;
    const envExpiresAtRaw = process.env.WAKATIME_EXPIRES_AT;

    let envExpiresAt: number | null = null;
    if (envExpiresAtRaw) {
      const parsedExpiresAt = Number(envExpiresAtRaw);
      if (Number.isFinite(parsedExpiresAt)) {
        envExpiresAt =
          parsedExpiresAt > 1_000_000_000_000
            ? Math.floor(parsedExpiresAt / 1000)
            : parsedExpiresAt;
      }
    }

    if (envRefreshToken || envExpiresAt !== null) {
      let currentConfig: {
        access_token?: string;
        refresh_token?: string;
        expires_at?: number;
      } = {};

      if (existsSync(configPath)) {
        currentConfig = JSON.parse(readFileSync(configPath, "utf8"));
      }

      const nextConfig = {
        ...currentConfig,
        ...(envRefreshToken ? { refresh_token: envRefreshToken } : {}),
        ...(envExpiresAt !== null ? { expires_at: envExpiresAt } : {}),
      };

      writeFileSync(
        `${process.cwd()}/wakatime.json`,
        JSON.stringify(nextConfig, null, 2),
      );
    }

    const hasConfigFile = existsSync(configPath);

    let accessTokenFromFile: string | null = null;
    let refreshTokenToUse: string | null = null;
    let expiresAtFromFile: number | null = null;

    if (hasConfigFile) {
      const config = JSON.parse(readFileSync(configPath, "utf8")) as {
        access_token?: string;
        refresh_token: string;
        expires_at: number;
      };

      accessTokenFromFile = config.access_token ?? null;
      refreshTokenToUse = config.refresh_token;
      expiresAtFromFile = config.expires_at;
    } else {
      accessTokenFromFile = process.env.WAKATIME_ACCESS_TOKEN ?? null;
      refreshTokenToUse = envRefreshToken;
      expiresAtFromFile = envExpiresAt;
    }

    if (!refreshTokenToUse && !accessTokenFromFile) {
      res.status(500).json({
        message:
          "No token available (wakatime.json missing and env tokens not set)",
      });
      return;
    }

    const shouldRefresh =
      expiresAtFromFile !== null &&
      expiresAtFromFile - Math.floor(Date.now() / 1000) <= 10 * 60;

    const { accessToken, refreshToken, expiresAt } =
      shouldRefresh && refreshTokenToUse
        ? await refresh(refreshTokenToUse)
        : {
            accessToken: accessTokenFromFile,
            refreshToken: refreshTokenToUse,
            expiresAt: expiresAtFromFile,
          };

    res
      .status(200)
      .json({ message: "ok", accessToken, refreshToken, expiresAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get access token" });
  }
}
