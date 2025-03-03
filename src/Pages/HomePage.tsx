import AnimatedText from "../Components/AnimatedText";
import CurrentMedia from "../Components/CurrentMedia";
import { TravelGrid } from "../Components/TravelGrid";
import Weather from "../Components/Weather";
import WeatherContext from "../context/WeatherContext";
import { useContext } from 'react';


const HomePage = () => {

    const { isHovered, setHovered } = useContext(WeatherContext)

    return (
        <div> 
            <div className="flex justify-end w-4/5">
                {isHovered ? <Weather className = "opacity-100"/>  : <Weather className = "opacity-0"/>}
            </div>
            <div> 
                <AnimatedText />
            </div>
            <div className="pt-10 pb-2 font-mono text-xs">/ CURRENTLY</div>
            <hr className="w-full border-[#E3E3E3]" />
            <br></br>
            <div>
                <CurrentMedia />
            </div>
            <br></br>
            <div className="my-10">
                <TravelGrid />
            </div>
        </div>
       
    )
}

export default HomePage;