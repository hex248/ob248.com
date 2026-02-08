import { Moon, Sun } from "@nsmr/pixelart-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="dummy"
      size="icon-sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="hover:fill-accent hover:text-accent"
    >
      {isDark ? <Sun className="size-6" /> : <Moon className="size-6" />}
    </Button>
  );
}
