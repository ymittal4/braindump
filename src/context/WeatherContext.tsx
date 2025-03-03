import { createContext } from "react";

type WeatherContext = {
    isHovered: boolean,
    setHovered: (isHovered:boolean) => void;
}

const WeatherContext = 
    createContext<WeatherContext>({
        isHovered: false,
        setHovered: () => {}
    });

export default WeatherContext;