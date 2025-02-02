import { useEffect, useState } from "react";
import { data } from "react-router-dom";
import useHover from "../hooks/hoverHook";

type songProps = {
    items: Array<{
        track: {
            name: string;
            artists: Array<{ name: string }>;
            album: {images: Array<{ 
                url: string, 
                height: number, 
                width: number}>}
        };
        played_at: string;  // When the track was played
    }>;
}

const SpotifyData = () => {

    const [isHovered, hoverProps] = useHover();

    console.log("spotufy data component")

    //states
    const [songdata, setSongdata] = useState<songProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [noSong, setNosong] = useState(true);
    const [error, setError] = useState<string | null>(null);


    //runnning functions > getting data from API > setting states according to data
    useEffect(() => {
        async function fetchSongData() {
            try {
                const response = await fetch('http://localhost:3001/api/now-playing');
                const data = await response.json();
                console.log('track data is', data.items[0].track);
                // console.log ('received data', data)
                if (data) {setNosong(false);} //if valid data is returned
                setSongdata(data);
            } catch(error) {
                console.error('error fetching api data', error);
            } finally {
                setLoading(false)
            }
        }
    
        fetchSongData()
        
    },[])

    function changeTimeToPST() {

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        if (songdata) {
            const currentDate = songdata?.items[0].played_at;
            const dateObject = new Date(currentDate)
            const songMonth = monthNames[dateObject.getMonth()]
            const songDay = dateObject.getDate()
            const songTime = dateObject.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour12: true, hour: 'numeric', minute: 'numeric' })
            const newDate = (songMonth + " " + songDay + "," + " " + songTime)
            return  newDate
        }
        else {
            return null
        }
    }

    function imageOverlay() {
        const image  = songdata?.items[0].track.album.images[0].url
        
    }


    //conditional renders
    if (loading) {
        return (
            <div>loading song</div>
        )
    }
    if (noSong) {
        return (<div>
            there is no song
        </div>)
    }

    return (
        <div
        // {...hoverProps}
        className={`${isHovered ? 'bg-red-500' : ''}`}>
            <div className="flex gap-4 border p-2">
                <div className="relative">
                    <img src = {songdata?.items[0].track.album.images[0].url} width="150" height="150"></img>
                    <div className="absolute inset-0 "> 
                        <div className="h-full w-full grid grid-cols-4 "> 
                            {Array(16).fill(null).map((_,index) => (
                                <div key= {index} className="block bg-[#fd5530] opacity-0 hover:opacity-50" />
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div>{songdata?.items[0].track.name}</div>
                    <div>{songdata?.items[0].track.artists[0].name}</div>
                </div>
            </div>
            <div className="border p-2">
                <div> Last played on {changeTimeToPST()} </div>

                
            </div>
        </div>
    )
}

export default SpotifyData