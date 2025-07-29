"use client";

import { createContext } from "react";

interface ThemeContextType {
    isDark: boolean;
    setIsDark: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    setIsDark: () => {}
});

export default ThemeContext;
export type { ThemeContextType };