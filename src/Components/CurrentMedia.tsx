
import SpotifyData from "./SpotifyData"

const CurrentMedia = () => {
    
    return (
        <div>
            <div>
                Currently:
            </div>
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
        </div>
    )
}

export default CurrentMedia