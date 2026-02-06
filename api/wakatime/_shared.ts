import { createHash, randomUUID } from "node:crypto";

const WAKATIME_TOKEN_URL = "https://wakatime.com/oauth/token";

type JsonRecord = Record<string, unknown>;

const minuteMs = 60_000;
const hourMs = 60 * minuteMs;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function json(
	res: { status: (code: number) => { json: (payload: unknown) => void } },
	statusCode: number,
	payload: unknown,
) {
	res.status(statusCode).json(payload);
}

export function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing environment variable: ${name}`);
	return value;
}

export function getOptionalIntEnv(name: string, fallback: number): number {
	const value = process.env[name];
	if (!value) return fallback;
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed)) return fallback;
	return parsed;
}

export function getBooleanEnv(name: string, fallback: boolean): boolean {
	const value = process.env[name];
	if (!value) return fallback;
	return value === "1" || value.toLowerCase() === "true";
}

export function isSetupEnabled(): boolean {
	return getBooleanEnv("WAKATIME_SETUP_ENABLED", false);
}

export function assertSetupSecret(provided: string | undefined): boolean {
	const expected = process.env.WAKATIME_SETUP_SECRET;
	if (!expected || !provided) return false;
	return provided === expected;
}

export function buildRedirectUri(req: {
	headers: Record<string, string | string[] | undefined>;
}): string {
	const configured = process.env.WAKATIME_OAUTH_REDIRECT_URI;
	if (configured) return configured;

	const hostHeader = req.headers["x-forwarded-host"] ?? req.headers.host;
	const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
	if (!host) throw new Error("Cannot determine host for OAuth redirect URI");

	const protocolHeader = req.headers["x-forwarded-proto"];
	const protocol = Array.isArray(protocolHeader)
		? protocolHeader[0]
		: (protocolHeader ?? "https");

	return `${protocol}://${host}/api/wakatime/oauth/callback`;
}

export function makeState(secret: string): string {
	const payload = {
		ts: Date.now(),
		nonce: randomUUID(),
	};
	const encodedPayload = toBase64Url(JSON.stringify(payload));
	const signature = sha256(`${encodedPayload}.${secret}`);
	return `${encodedPayload}.${signature}`;
}

export function verifyState(
	state: string,
	secret: string,
	maxAgeMs = 15 * minuteMs,
): boolean {
	const parts = state.split(".");
	if (parts.length !== 2) return false;

	const [encodedPayload, signature] = parts;
	const expectedSignature = sha256(`${encodedPayload}.${secret}`);
	if (expectedSignature !== signature) return false;

	let payload: { ts?: unknown };
	try {
		payload = JSON.parse(fromBase64Url(encodedPayload)) as { ts?: unknown };
	} catch {
		return false;
	}

	if (typeof payload.ts !== "number") return false;
	const age = Date.now() - payload.ts;
	if (age < 0 || age > maxAgeMs) return false;

	return true;
}

export async function exchangeCodeForTokens(input: {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}): Promise<{
	accessToken?: string;
	refreshToken?: string;
	raw: JsonRecord | string;
}> {
	const body = new URLSearchParams({
		grant_type: "authorization_code",
		client_id: input.clientId,
		client_secret: input.clientSecret,
		code: input.code,
		redirect_uri: input.redirectUri,
	});

	const response = await fetch(WAKATIME_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json, application/x-www-form-urlencoded",
		},
		body,
	});

	const parsed = await parseFlexibleResponse(response);
	if (!response.ok) {
		throw new Error(`Token exchange failed (${response.status})`);
	}

	const accessToken = extractString(parsed, ["access_token", "token"]);
	const refreshToken = extractString(parsed, ["refresh_token"]);

	return {
		accessToken,
		refreshToken,
		raw: parsed,
	};
}

export async function refreshAccessToken(input: {
	refreshToken: string;
	clientId: string;
	clientSecret: string;
}): Promise<string> {
	const body = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: input.refreshToken,
		client_id: input.clientId,
		client_secret: input.clientSecret,
	});

	const response = await fetch(WAKATIME_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json, application/x-www-form-urlencoded",
		},
		body,
	});

	const parsed = await parseFlexibleResponse(response);
	if (!response.ok) {
		throw new Error(`Token refresh failed (${response.status})`);
	}

	const accessToken = extractString(parsed, ["access_token", "token"]);
	if (!accessToken)
		throw new Error("Missing access_token in token refresh response");

	return accessToken;
}

export async function wakatimeGet<T>(
	path: string,
	accessToken: string,
): Promise<T> {
	const response = await fetch(`https://api.wakatime.com/api/v1${path}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`WakaTime request failed (${response.status}) on ${path}`);
	}

	return (await response.json()) as T;
}

export function inferCodingStatus(
	lastHeartbeatAt: string | undefined,
	idleMinutes: number,
): boolean {
	if (!lastHeartbeatAt) return false;
	const heartbeatMs = Date.parse(lastHeartbeatAt);
	if (Number.isNaN(heartbeatMs)) return false;
	return Date.now() - heartbeatMs <= idleMinutes * minuteMs;
}

export function getClientIp(req: {
	headers: Record<string, string | string[] | undefined>;
}): string {
	const forwardedFor = req.headers["x-forwarded-for"];
	const value = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
	if (!value) return "unknown";
	return value.split(",")[0]?.trim() ?? "unknown";
}

export function isRateLimited(
	key: string,
	limit: number,
	windowMs = hourMs,
): boolean {
	const now = Date.now();
	const item = rateLimitStore.get(key);
	if (!item || now > item.resetAt) {
		rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
		return false;
	}

	item.count += 1;
	if (item.count > limit) return true;
	return false;
}

export function setStatsCacheHeaders(res: {
	setHeader: (name: string, value: string) => void;
}) {
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=60, stale-while-revalidate=300",
	);
}

function sha256(value: string): string {
	return createHash("sha256").update(value).digest("hex");
}

function toBase64Url(value: string): string {
	return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
	return Buffer.from(value, "base64url").toString("utf8");
}

function extractString(
	source: JsonRecord | string,
	keys: string[],
): string | undefined {
	if (typeof source === "string") {
		const params = new URLSearchParams(source);
		for (const key of keys) {
			const value = params.get(key);
			if (value) return value;
		}
		return undefined;
	}

	for (const key of keys) {
		const value = source[key];
		if (typeof value === "string") return value;
	}

	return undefined;
}

async function parseFlexibleResponse(
	response: Response,
): Promise<JsonRecord | string> {
	const contentType = response.headers.get("content-type") ?? "";
	if (contentType.includes("application/json")) {
		return (await response.json()) as JsonRecord;
	}

	const text = await response.text();
	if (!text.trim()) return "";

	try {
		return JSON.parse(text) as JsonRecord;
	} catch {
		return text;
	}
}
