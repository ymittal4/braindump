import { useEffect, useState } from "react";
import { data } from "react-router-dom";

type songProps = {
    items: Array<{
        track: {
            name: string;
            artists: Array<{ name: string }>;
            duration_ms: number;
            album: {images: Array<{ 
                url: string, 
                height: number, 
                width: number}>}
        };
        played_at: string;  // When the track was played
    }>;
}

const SpotifyData = () => {

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
        <div> 
            <div>{songdata?.items[0].track.name}</div>
            <div>{songdata?.items[0].track.artists[0].name}</div>
            <div>{songdata?.items[0].played_at}</div>
            <img src = {songdata?.items[0].track.album.images[0].url}></img>
            {/* <div>{songdata?.item.artist}</div> */}
            {/* <div>{songdata?.time}</div> */}
        </div>
    )
}

export default SpotifyData