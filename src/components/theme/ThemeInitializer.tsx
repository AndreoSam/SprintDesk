import { useEffect, type ReactNode } from "react";

import { useThemeStore } from "../../stores/themeStore";

interface ThemeInitializerProps {
  children: ReactNode;
}

function ThemeInitializer({ children }: ThemeInitializerProps) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return children;
}

export default ThemeInitializer;
