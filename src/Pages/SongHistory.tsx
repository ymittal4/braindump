import { useEffect, useState } from "react"
import { supabase } from "../config/supabase"
import { random } from "gsap";

const SongHistory = () => {
    const[songData, setSongData] = useState<{ 
        song_name:string, 
        created_at:string, 
        song_artists:string,
        album_cover:string
    }[]>();

    async function showSpotifyData() {
        const { data, error } = await supabase
            .from('SpotifySongHistory')
            .select('song_name, created_at, song_artists, album_cover')

            if (data) {
                setSongData(data)             
            }
    }

    function getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min) + min);
      }

    useEffect(() => {
        showSpotifyData()
    },[])


    //2025-03-10 03:31:03.712+00

    function convertDateToPST(timeStamp:string) {
        const date = new Date(timeStamp)

        const formattedTime = date.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
          });

        return formattedTime
    }

    return (
        <div className="overflow-hidden gap-16">
            <div className="flex flex-wrap gap-8 max-w-3xl">{songData && songData.map((currentSongs) => {
                return (
                    // <div className= {`w-${getRandomInt(1, 6)}`}>
                    <div className= 'w-20'>
                        <img src={currentSongs.album_cover} className="w-full h-auto"></img>
                        <div className="text-xs opacity-35 tracking-tighter">{currentSongs.song_name}</div>
                        <div className="text-xs"> {convertDateToPST(currentSongs.created_at)}</div>
                        <div className="text-xs">{currentSongs.song_artists}</div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default SongHistory