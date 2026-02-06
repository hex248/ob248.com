import type { IncomingMessage, ServerResponse } from "node:http";
import {
	buildRedirectUri,
	exchangeCodeForTokens,
	getClientIp,
	getRequiredEnv,
	isRateLimited,
	isSetupEnabled,
	json,
	verifyState,
} from "../_shared.ts";

export default async function handler(
	req: IncomingMessage,
	res: ServerResponse & {
		status: (code: number) => { json: (payload: unknown) => void };
	},
) {
	if (req.method !== "GET") {
		json(res, 405, { error: "Method not allowed" });
		return;
	}

	if (!isSetupEnabled()) {
		json(res, 403, { error: "Setup route disabled" });
		return;
	}

	const ip = getClientIp(req);
	if (isRateLimited(`oauth-callback:${ip}`, 50)) {
		json(res, 429, { error: "Too many requests" });
		return;
	}

	const requestUrl = new URL(req.url ?? "", "https://localhost");
	const error = requestUrl.searchParams.get("error");
	if (error) {
		json(res, 400, {
			error: "OAuth authorization failed",
			oauth_error: error,
			oauth_error_description: requestUrl.searchParams.get("error_description"),
		});
		return;
	}

	const code = requestUrl.searchParams.get("code") ?? undefined;
	const state = requestUrl.searchParams.get("state") ?? undefined;
	if (!code || !state) {
		json(res, 400, { error: "Missing OAuth code or state" });
		return;
	}

	try {
		const clientId = getRequiredEnv("WAKATIME_CLIENT_ID");
		const clientSecret = getRequiredEnv("WAKATIME_CLIENT_SECRET");
		const setupSecret = getRequiredEnv("WAKATIME_SETUP_SECRET");
		const redirectUri = buildRedirectUri(req);

		if (!verifyState(state, setupSecret)) {
			json(res, 401, { error: "Invalid or expired OAuth state" });
			return;
		}

		const tokenResult = await exchangeCodeForTokens({
			code,
			clientId,
			clientSecret,
			redirectUri,
		});

		if (!tokenResult.refreshToken) {
			json(res, 502, {
				error: "Token exchange succeeded but no refresh token was returned",
			});
			return;
		}

		json(res, 200, {
			ok: true,
			message: "OAuth setup complete",
			refresh_token: tokenResult.refreshToken,
			next_steps: [
				"Store WAKATIME_REFRESH_TOKEN in your Vercel project env.",
				"Set WAKATIME_SETUP_ENABLED=0 after setup.",
			],
			vercel_env_command: `vercel env add WAKATIME_REFRESH_TOKEN`,
		});
	} catch (exchangeError) {
		json(res, 500, {
			error: "OAuth callback failed",
			detail:
				exchangeError instanceof Error
					? exchangeError.message
					: "unknown_error",
		});
	}
}
