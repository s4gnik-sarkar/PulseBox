"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type ThemeContextValue = { setTheme: (theme: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const setTheme = useCallback((theme: Theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, []);

  useLayoutEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    setTheme(savedTheme === "dark" ? "dark" : "light");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }
  return theme;
}
