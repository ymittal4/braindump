import AnimatedText from "../Components/AnimatedText";
import BookData from "../Components/BookData";
import CurrentMedia from "../Components/CurrentMedia";

const HomePage = () => {
    return (
        <div> 
            <div> 
                <AnimatedText />
            </div>
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