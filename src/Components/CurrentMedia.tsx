
import SpotifyData from "./SpotifyData"

const CurrentMedia = () => {
    
    return (
        <div>
            <div>
                Currently experiencing:
            </div>
            <div className="">
                <div>
                    Music
                </div>
                <div>
                    Spotify API here
                    <SpotifyData />
                </div>
            </div>
        </div>
    )
}

export default CurrentMedia