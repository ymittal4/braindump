"use client";

import { createContext } from "react";

interface WeatherContextType {
    isHovered: boolean;
    setHovered: (isHovered: boolean) => void;
}

const WeatherContext = createContext<WeatherContextType>({
    isHovered: false,
    setHovered: () => {}
});

export default WeatherContext;
export type { WeatherContextType };