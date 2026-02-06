import { useEffect, useMemo, useState } from "react";

type WakaTimeLanguage = {
	name: string;
	percent: number;
	seconds: number;
	text: string;
};

type WakaTimeStatsPayload = {
	isCoding: boolean;
	last7Text: string;
	last7Seconds: number;
	languages: WakaTimeLanguage[];
	updatedAt: string;
};

const defaultRefreshMs = 60_000;

export function WakaTimeStats() {
	const [stats, setStats] = useState<WakaTimeStatsPayload | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refreshMs = useMemo(() => {
		const raw = import.meta.env.VITE_WAKATIME_REFRESH_MS;
		if (!raw) return defaultRefreshMs;
		const parsed = Number.parseInt(raw, 10);
		if (Number.isNaN(parsed) || parsed < 10_000) return defaultRefreshMs;
		return parsed;
	}, []);

	useEffect(() => {
		let isActive = true;

		const load = async () => {
			try {
				const response = await fetch("/api/wakatime/stats", {
					headers: {
						Accept: "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`request failed (${response.status})`);
				}

				const data = (await response.json()) as WakaTimeStatsPayload;
				if (!isActive) return;

				setStats(data);
				setError(null);
			} catch (fetchError) {
				if (!isActive) return;
				setError(
					fetchError instanceof Error
						? fetchError.message
						: "Unable to fetch WakaTime stats",
				);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void load();
		const timer = window.setInterval(() => {
			void load();
		}, refreshMs);

		return () => {
			isActive = false;
			window.clearInterval(timer);
		};
	}, [refreshMs]);

	return (
		<section
			className="w-full max-w-5xl border-2 p-4 md:p-5"
			aria-live="polite"
		>
			<div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
				<h2 className="text-2xl text-accent text-balance">WakaTime</h2>
				<p className="text-xs text-fg/70 tabular-nums">
					{stats?.updatedAt
						? `Updated ${new Date(stats.updatedAt).toLocaleTimeString()}`
						: "Waiting for update"}
				</p>
			</div>

			{isLoading ? (
				<p className="mt-3 text-sm text-fg/75">Loading coding stats...</p>
			) : null}

			{error ? (
				<p className="mt-3 text-sm text-destructive">
					WakaTime unavailable: {error}
				</p>
			) : null}

			{stats ? (
				<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="border p-3">
						<p className="text-xs text-fg/70">Currently coding</p>
						<p className="mt-1 text-lg tabular-nums">
							{stats.isCoding ? "Yes" : "No"}
						</p>
					</div>

					<div className="border p-3">
						<p className="text-xs text-fg/70">Last 7 days</p>
						<p className="mt-1 text-lg tabular-nums">{stats.last7Text}</p>
					</div>

					<div className="border p-3">
						<p className="text-xs text-fg/70">Tracked languages</p>
						<p className="mt-1 text-lg tabular-nums">
							{stats.languages.length}
						</p>
					</div>
				</div>
			) : null}

			{stats?.languages.length ? (
				<ul className="mt-4 flex flex-col gap-2">
					{stats.languages.slice(0, 7).map((language) => (
						<li
							key={language.name}
							className="grid grid-cols-[1fr_auto] gap-3 items-center"
						>
							<div>
								<div className="mb-1 flex items-center justify-between gap-2 text-sm">
									<span className="text-fg">{language.name}</span>
									<span className="tabular-nums text-fg/80">
										{language.percent.toFixed(1)}%
									</span>
								</div>
								<div className="h-2 w-full border">
									<div
										className="h-full bg-accent"
										style={{
											width: `${Math.max(2, Math.min(100, language.percent))}%`,
										}}
									/>
								</div>
							</div>
							<span className="text-xs text-fg/70 tabular-nums">
								{language.text}
							</span>
						</li>
					))}
				</ul>
			) : null}
		</section>
	);
}
