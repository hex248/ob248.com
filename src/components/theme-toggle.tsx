import { Moon, Sun } from "@nsmr/pixelart-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() => setTheme(isDark ? "light" : "dark")}
		>
			{isDark ? <Sun /> : <Moon />}
		</Button>
	);
}

export { ThemeToggle };
