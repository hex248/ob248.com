import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TimeSinceProps = {
	date: Date;
	className?: string;
	yearsDp?: number;
};

const yearMs = 1000 * 60 * 60 * 24 * 365.25;

function roundToDp(value: number, dp: number) {
	const factor = 10 ** dp;
	return Math.floor(value * factor) / factor;
}

export function TimeSince({ date, className, yearsDp = 2 }: TimeSinceProps) {
	const dateMs = useMemo(() => date.getTime(), [date]);
	const [milliseconds, setMilliseconds] = useState(() =>
		Math.max(0, Date.now() - dateMs),
	);

	useEffect(() => {
		let rafId: number | null = null;

		const tick = () => {
			setMilliseconds(Math.max(0, Date.now() - dateMs));
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => {
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	}, [dateMs]);

	const years = roundToDp(milliseconds / yearMs, yearsDp);

	return (
		<span className={cn("tabular-nums text-fg", className)}>
			{years}y or {milliseconds}ms
		</span>
	);
}
