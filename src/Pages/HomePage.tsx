import AnimatedText from "../Components/AnimatedText";
import BookData from "../Components/BookData";
import CurrentMedia from "../Components/CurrentMedia";
import { TravelGrid } from "../Components/TravelGrid";
import { Weather } from "../Components/Weather";


const HomePage = () => {
    return (
        <div> 
            <div>
                <Weather />
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