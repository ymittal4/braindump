import { useContext } from 'react';

import AnimatedText from "../Components/AnimatedText";
import CurrentMedia from "../Components/CurrentMedia";
import { TravelGrid } from "../Components/TravelGrid";
import Weather from "../Components/Weather";
import WeatherContext from "../context/WeatherContext";

const HomePage = () => {
    const { isHovered } = useContext(WeatherContext);

    return (
        <div className="space-y-6"> 
            <div className="flex justify-end w-4/5">
                <Weather className={isHovered ? "opacity-100" : "opacity-0"} />
            </div>
            
            <div> 
                <AnimatedText />
            </div>
            
            <div className="pt-10 pb-2 font-mono text-xs">/ CURRENTLY</div>
            <hr className="w-full border-gray-300" />
            
            <div>
                <CurrentMedia />
            </div>
            
            <div className="my-10">
                <TravelGrid />
            </div>
        </div>
    );
}

export default HomePage;