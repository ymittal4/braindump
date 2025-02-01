
import SpotifyData from "./SpotifyData"

const CurrentMedia = () => {
    
    return (
            <div className="flex gap-8 pt-10">
                <div>
                    <SpotifyData />
                </div>
                <div>
                    Reading here
                </div>
                <div>
                    watching here
                </div>
            </div>
    )
}

export default CurrentMedia