import animatedText from "../Components/introAnimation";
import BookData from "../Components/TaoQuotes";

const HomePage = () => {
    return (
        <div> 
            <div> {animatedText()} </div>
            <br></br>
            <div>
                {BookData()}
            </div>
        </div>
       
    )
}

export default HomePage;