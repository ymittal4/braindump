import { useEffect, useState } from "react"
import { supabase } from "../config/supabase"

const SongHistory = () => {

    const[isSong, setSong] = useState<{ 
        song_name:string, 
        created_at:number, 
        song_artists:string,
        album_cover:string
    }[]>();

    async function showSpotifyData() {
        const { data, error } = await supabase
            .from('SpotifySongHistory')
            .select('song_name, created_at, song_artists, album_cover')

            if (data) {
                setSong(data)             
            }
    }

    useEffect(() => {
        showSpotifyData()
    },[])


    return (
       
        <div>
            <p>{isSong && isSong.map((currentSongs) => {
                return (
                    <div>
                        <div>{currentSongs.song_name}</div>
                        <div>{currentSongs.created_at}</div>
                        <div>{currentSongs.song_artists}</div>
                        <img src={currentSongs.album_cover} width="150" height="150"></img>
                    </div>
                )
            })}
            </p>
        </div>
    )
}

export default SongHistory