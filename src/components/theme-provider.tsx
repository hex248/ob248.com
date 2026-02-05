import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
	theme: Theme;
	resolvedTheme: "light" | "dark";
	setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const storageKey = "theme";

const getStoredTheme = (): Theme => {
	if (typeof window === "undefined") return "system";
	const stored = window.localStorage.getItem(storageKey);
	if (stored === "light" || stored === "dark" || stored === "system") {
		return stored;
	}
	return "system";
};

const getSystemTheme = (): "light" | "dark" => {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(getStoredTheme);
	const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(storageKey, theme);

		const root = document.documentElement;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const applyTheme = (next: "light" | "dark") => {
			root.classList.toggle("dark", next === "dark");
		};

		applyTheme(theme === "system" ? getSystemTheme() : theme);

		const handleChange = () => {
			if (theme === "system") {
				applyTheme(getSystemTheme());
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	const value = useMemo(
		() => ({ theme, resolvedTheme, setTheme }),
		[theme, resolvedTheme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
};

export { ThemeProvider, useTheme, type Theme };
