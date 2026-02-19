import { neon } from "@neondatabase/serverless";

const REFRESH_WINDOW_SECONDS = 10 * 60;
const TOKEN_PROVIDER = "wakatime";

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

type DatabaseTokenRow = {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | string | null;
};

const getSql = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  return neon(connectionString);
};

const ensureTokenTable = async (sql: ReturnType<typeof neon>) => {
  await sql`
    CREATE TABLE IF NOT EXISTS wakatime_tokens (
      provider TEXT PRIMARY KEY,
      access_token TEXT,
      refresh_token TEXT,
      expires_at BIGINT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
};

const readTokenFromDatabase = async (
  sql: ReturnType<typeof neon>,
): Promise<TokenState> => {
  const rows = (await sql`
    SELECT access_token, refresh_token, expires_at
    FROM wakatime_tokens
    WHERE provider = ${TOKEN_PROVIDER}
    LIMIT 1
  `) as DatabaseTokenRow[];

  const row = rows[0];
  return {
    accessToken: row?.access_token ?? null,
    refreshToken: row?.refresh_token ?? null,
    expiresAt: toEpochSeconds(row?.expires_at ?? null),
  };
};

const writeTokenToDatabase = async (
  sql: ReturnType<typeof neon>,
  token: TokenState,
) => {
  await sql`
    INSERT INTO wakatime_tokens (
      provider,
      access_token,
      refresh_token,
      expires_at,
      updated_at
    )
    VALUES (
      ${TOKEN_PROVIDER},
      ${token.accessToken},
      ${token.refreshToken},
      ${token.expiresAt},
      NOW()
    )
    ON CONFLICT (provider) DO UPDATE SET
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token,
      expires_at = EXCLUDED.expires_at,
      updated_at = NOW()
  `;
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
    const sql = getSql();

    const diagnostics: Record<string, unknown> = {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasEnvAccessToken: Boolean(envAccessToken),
      hasEnvRefreshToken: Boolean(envRefreshToken),
      envExpiresAt,
      now,
    };

    let dbTokenState: TokenState = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    };

    if (sql) {
      await ensureTokenTable(sql);
      dbTokenState = await readTokenFromDatabase(sql);
    }
    diagnostics.dbHasAccessToken = Boolean(dbTokenState.accessToken);
    diagnostics.dbHasRefreshToken = Boolean(dbTokenState.refreshToken);
    diagnostics.dbExpiresAt = dbTokenState.expiresAt;

    const tokenState: TokenState = {
      accessToken: dbTokenState.accessToken ?? envAccessToken,
      refreshToken: dbTokenState.refreshToken ?? envRefreshToken,
      expiresAt: dbTokenState.expiresAt ?? envExpiresAt,
    };

    if (
      sql &&
      !dbTokenState.refreshToken &&
      tokenState.refreshToken &&
      tokenState.expiresAt !== null
    ) {
      await writeTokenToDatabase(sql, tokenState);
      diagnostics.seededDatabaseFromEnv = true;
    } else {
      diagnostics.seededDatabaseFromEnv = false;
    }

    diagnostics.resolvedHasAccessToken = Boolean(tokenState.accessToken);
    diagnostics.resolvedHasRefreshToken = Boolean(tokenState.refreshToken);
    diagnostics.resolvedExpiresAt = tokenState.expiresAt;

    if (!tokenState.accessToken && !tokenState.refreshToken) {
      res.status(500).json({
        message: "No token available",
        diagnostics,
      });
      return;
    }

    const shouldRefreshByExpiry =
      tokenState.expiresAt !== null &&
      tokenState.expiresAt - now <= REFRESH_WINDOW_SECONDS;
    const shouldRefreshMissingAccess =
      !tokenState.accessToken && Boolean(tokenState.refreshToken);
    const shouldRefresh =
      Boolean(tokenState.refreshToken) &&
      (shouldRefreshByExpiry || shouldRefreshMissingAccess);

    diagnostics.shouldRefreshByExpiry = shouldRefreshByExpiry;
    diagnostics.shouldRefreshMissingAccess = shouldRefreshMissingAccess;
    diagnostics.shouldRefresh = shouldRefresh;

    let result = tokenState;
    if (shouldRefresh && tokenState.refreshToken) {
      try {
        result = await refresh(tokenState.refreshToken);
        if (sql) {
          await writeTokenToDatabase(sql, result);
          diagnostics.persistedRefreshToDatabase = true;
        } else {
          diagnostics.persistedRefreshToDatabase = false;
        }
        diagnostics.didRefresh = true;
      } catch (refreshError) {
        res.status(500).json({
          message: "Failed to refresh access token",
          error:
            refreshError instanceof Error
              ? refreshError.message
              : String(refreshError),
          diagnostics,
        });
        return;
      }
    } else {
      diagnostics.didRefresh = false;
      diagnostics.persistedRefreshToDatabase = false;
    }

    if (!result.accessToken) {
      res.status(500).json({
        message: "Missing access token",
        diagnostics,
      });
      return;
    }

    const dateQuery = _req?.query?.date;
    const date =
      typeof dateQuery === "string" && dateQuery.trim().length > 0
        ? dateQuery
        : new Date().toISOString().slice(0, 10);

    const heartbeatUrl = new URL(
      "https://api.wakatime.com/api/v1/users/current/heartbeats",
    );
    heartbeatUrl.searchParams.set("date", date);

    const statsUrl = new URL(
      "https://api.wakatime.com/api/v1/users/current/stats/last_7_days",
    );

    const headers = {
      Authorization: `Bearer ${result.accessToken}`,
    };

    const [heartbeatResponse, statsResponse] = await Promise.all([
      fetch(heartbeatUrl, { headers }),
      fetch(statsUrl, { headers }),
    ]);

    const heartbeatText = await heartbeatResponse.text();
    const statsText = await statsResponse.text();
    if (!heartbeatResponse.ok) {
      res.status(500).json({
        message: "Failed to get heartbeats",
        status: heartbeatResponse.status,
        body: heartbeatText,
        diagnostics,
      });
      return;
    }
    if (!statsResponse.ok) {
      res.status(500).json({
        message: "Failed to get stats",
        status: statsResponse.status,
        body: statsText,
        diagnostics,
      });
      return;
    }

    const heartbeatJson = JSON.parse(heartbeatText) as { data?: unknown };
    const statsJson = JSON.parse(statsText) as { data?: unknown };

    res.status(200).json({
      heartbeat: heartbeatJson.data ?? heartbeatJson,
      stats: statsJson.data ?? statsJson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get data",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
