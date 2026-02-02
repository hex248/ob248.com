import { createCliRenderer } from "@opentui/core";
import {
	createRoot,
	useKeyboard,
	useRenderer,
	useTerminalDimensions,
} from "@opentui/react";
import { useEffect } from "react";

function App() {
	const { width, height } = useTerminalDimensions();
	const renderer = useRenderer();

	useEffect(() => {
		const handleExit = () => {
			renderer.cleanup();
			process.exit(0);
		};

		process.on("SIGINT", handleExit);
		process.on("SIGTERM", handleExit);

		return () => {
			process.off("SIGINT", handleExit);
			process.off("SIGTERM", handleExit);
		};
	}, [renderer]);

	useKeyboard((key) => {
		if (
			key.name === "q" ||
			key.name === "escape" ||
			(key.ctrl && key.name === "c")
		) {
			renderer.cleanup();
			process.exit(0);
		}
	});

	const text = "ob248.com";
	const x = Math.floor((width - text.length) / 2);
	const y = Math.floor(height / 2);

	return (
		<box width={width} height={height}>
			<text x={x} y={y}>
				{text}
			</text>
		</box>
	);
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
