import { createContext } from "react";

type ThemeContextType = {
    isDark: boolean,
    setIsDark: (isDark:boolean) => void; 
}

const ThemeContext = 
    createContext<ThemeContextType>({
        isDark: false,
        setIsDark: () => {}
    });

export default ThemeContext;