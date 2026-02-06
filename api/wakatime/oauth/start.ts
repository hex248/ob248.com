import type { IncomingMessage, ServerResponse } from "node:http";
import {
	assertSetupSecret,
	buildRedirectUri,
	getClientIp,
	getRequiredEnv,
	isRateLimited,
	isSetupEnabled,
	json,
	makeState,
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
	if (isRateLimited(`oauth-start:${ip}`, 20)) {
		json(res, 429, { error: "Too many requests" });
		return;
	}

	const url = new URL(req.url ?? "", "https://localhost");
	const setupSecret = url.searchParams.get("setup_secret") ?? undefined;
	if (!assertSetupSecret(setupSecret)) {
		json(res, 401, { error: "Unauthorized setup request" });
		return;
	}

	try {
		const clientId = getRequiredEnv("WAKATIME_CLIENT_ID");
		const setupSecretValue = getRequiredEnv("WAKATIME_SETUP_SECRET");
		const redirectUri = buildRedirectUri(req);
		const state = makeState(setupSecretValue);

		const authorizeUrl = new URL("https://wakatime.com/oauth/authorize");
		authorizeUrl.searchParams.set("client_id", clientId);
		authorizeUrl.searchParams.set("response_type", "code");
		authorizeUrl.searchParams.set("redirect_uri", redirectUri);
		authorizeUrl.searchParams.set("scope", "read_stats email");
		authorizeUrl.searchParams.set("state", state);

		res.statusCode = 302;
		res.setHeader("Location", authorizeUrl.toString());
		res.end();
	} catch (error) {
		json(res, 500, {
			error: "Failed to build OAuth authorize URL",
			detail: error instanceof Error ? error.message : "unknown_error",
		});
	}
}
