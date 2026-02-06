import type { IncomingMessage, ServerResponse } from "node:http";
import {
	getClientIp,
	getOptionalIntEnv,
	getRequiredEnv,
	inferCodingStatus,
	isRateLimited,
	json,
	refreshAccessToken,
	setStatsCacheHeaders,
	wakatimeGet,
} from "./_shared.ts";

type WakaTimeUsersResponse = {
	data?: {
		last_heartbeat_at?: string;
	};
};

type WakaTimeStatsResponse = {
	data?: {
		total_seconds?: number;
		human_readable_total?: string;
		text?: string;
		languages?: Array<{
			name?: string;
			percent?: number;
			total_seconds?: number;
			text?: string;
		}>;
	};
};

type StatsPayload = {
	isCoding: boolean;
	last7Text: string;
	last7Seconds: number;
	languages: Array<{
		name: string;
		percent: number;
		seconds: number;
		text: string;
	}>;
	updatedAt: string;
};

export default async function handler(
	req: IncomingMessage,
	res: ServerResponse & {
		status: (code: number) => { json: (payload: unknown) => void };
		setHeader: (name: string, value: string) => void;
	},
) {
	if (req.method !== "GET") {
		json(res, 405, { error: "Method not allowed" });
		return;
	}

	const ip = getClientIp(req);
	if (isRateLimited(`stats:${ip}`, 240)) {
		json(res, 429, { error: "Too many requests" });
		return;
	}

	setStatsCacheHeaders(res);

	try {
		const clientId = getRequiredEnv("WAKATIME_CLIENT_ID");
		const clientSecret = getRequiredEnv("WAKATIME_CLIENT_SECRET");
		const refreshToken = getRequiredEnv("WAKATIME_REFRESH_TOKEN");
		const idleMinutes = getOptionalIntEnv("WAKATIME_IDLE_MINUTES", 10);

		const accessToken = await refreshAccessToken({
			clientId,
			clientSecret,
			refreshToken,
		});

		const [userResponse, statsResponse] = await Promise.all([
			wakatimeGet<WakaTimeUsersResponse>("/users/current", accessToken),
			wakatimeGet<WakaTimeStatsResponse>(
				"/users/current/stats/last_7_days",
				accessToken,
			),
		]);

		const lastHeartbeatAt = userResponse.data?.last_heartbeat_at;
		const totalSeconds = clampNumber(statsResponse.data?.total_seconds);
		const totalText = (
			statsResponse.data?.human_readable_total ??
			statsResponse.data?.text ??
			"0 secs"
		).trim();

		const languages = (statsResponse.data?.languages ?? [])
			.filter((language) => typeof language?.name === "string")
			.map((language) => ({
				name: language.name ?? "Unknown",
				percent: clampNumber(language.percent),
				seconds: clampNumber(language.total_seconds),
				text: (
					language.text ?? `${Math.round(clampNumber(language.total_seconds))}s`
				).trim(),
			}))
			.sort((a, b) => b.seconds - a.seconds);

		const payload: StatsPayload = {
			isCoding: inferCodingStatus(lastHeartbeatAt, idleMinutes),
			last7Text: totalText,
			last7Seconds: totalSeconds,
			languages,
			updatedAt: new Date().toISOString(),
		};

		json(res, 200, payload);
	} catch (error) {
		json(res, 500, {
			error: "Failed to load WakaTime stats",
			detail: error instanceof Error ? error.message : "unknown_error",
		});
	}
}

function clampNumber(value: unknown): number {
	if (
		typeof value !== "number" ||
		Number.isNaN(value) ||
		!Number.isFinite(value)
	) {
		return 0;
	}
	return Math.max(0, value);
}
