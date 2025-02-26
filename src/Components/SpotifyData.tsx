// React core imports
import { useEffect, useState, useRef } from "react";
import { data } from "react-router-dom";

// Custom hooks and components
import useHover from "../hooks/hoverHook";
import BlockAnimation from "../Animations/BlockAnimation";

// Type definition for Spotify track data structure
type songProps = {
    items: Array<{
        track: {
            name: string;                    // Name of the track
            artists: Array<{ name: string }>; // List of artists
            album: {images: Array<{          // Album artwork images
                url: string,                 // Image URL
                height: number,              // Image height
                width: number                // Image width
            }>}
        };
        played_at: string;  // Timestamp when the track was played
    }>;
}

const SpotifyData = () => {
    // State management
    const [isHovered, hoverProps] = useHover();                           // Track hover state
    const [songdata, setSongdata] = useState<songProps | null>(null);      // Store Spotify track data
    const [loading, setLoading] = useState(true);                         // Loading state
    const [noSong, setNosong] = useState(true);                          // Track if no song is playing
    const [error, setError] = useState<string | null>(null);             // Error handling
    const imageBlocks = useRef<HTMLDivElement>(null);                    // Reference to album art grid blocks
    const [blockIsHovered, setHoverIndex] = useState<number | null>(null) // Track hovered block in grid
    const [activeBlocks, setActiveBlocks] = useState<number[]>([])       // Track animated blocks

    // Fetch current playing track data from Spotify API when component mounts
    useEffect(() => {
        async function fetchSongData() {
            try {
                const response = await fetch('http://localhost:3001/api/now-playing');
                const data = await response.json();
                // console.log('track data is', data.items[0].track);
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

    useEffect(() => {
        console.log("activeBlocks changed to:", activeBlocks);
    }, [activeBlocks]);

    // Convert UTC timestamp to PST and format it nicely
    function changeTimeToPST() {
        // Month names for date formatting
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

    // Loading and error state handling
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
        {...hoverProps}
        className={`${isHovered ? 'bg-red-500' : ''}`}>
            <div className="flex gap-4 border p-2">
                <div className="relative">
                    <img src = {songdata?.items[0].track.album.images[0].url} width="150" height="150"></img>
                    <div className="absolute inset-0 "> 
                        <div className="h-full w-full grid grid-cols-4 "> 
                            {Array(16).fill(null).map((_,index) => (
                                <div 
                                ref={imageBlocks} 
                                key= {index} 
                                onMouseEnter={() => {
                                    console.log("Mouse entered block:", index);
                                    setHoverIndex(index);
                                    BlockAnimation(Array(16).fill(null).map((_,index) => index), blockIsHovered, setActiveBlocks)
                                }}
                                className={`block bg-[#fd5530] ${activeBlocks.includes(index) ? 'opacity-50' :'opacity-0'} duration-500 ease-in-out mix-blend-hard-light`}
                                onMouseLeave={()=> setHoverIndex(null)}
                                />                           
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