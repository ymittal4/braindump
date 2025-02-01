import AnimatedText from "../Components/AnimatedText";
import BookData from "../Components/BookData";
import CurrentMedia from "../Components/CurrentMedia";

const HomePage = () => {
    return (
        <div> 
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
            <div>
                <BookData />
            </div>
        </div>
       
    )
}

export default HomePage;