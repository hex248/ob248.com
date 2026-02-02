import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard, useTerminalDimensions } from "@opentui/react";

function App() {
	const { width, height } = useTerminalDimensions();

	useKeyboard((key) => {
		if (
			key.name === "q" ||
			key.name === "escape" ||
			(key.ctrl && key.name === "c")
		) {
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
