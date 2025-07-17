import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import SongList from "../Components/SongList";
import FilterButton from "../Components/SongFilterButton";

const SongPage = () => {
    const [songData, setSongData] = useState<{
        song_name: string;
        created_at: string;
        song_artists: string;
        album_cover: string;
    }[]>();
    
    const [isAlphabetical, setIsAlphabetical] = useState(false);

    async function showSpotifyData() {
        const { data, error } = await supabase
            .from('SpotifySongHistory')
            .select('song_name, created_at, song_artists, album_cover')

        if (data) {
            setSongData(data)
        }
    }

    useEffect(() => {
        showSpotifyData()
    }, [])

    const toggleSorting = () => {
        setIsAlphabetical(!isAlphabetical);
    }

    const sortedSongData = songData ? [...songData].sort((a, b) => {
        if (isAlphabetical) {
            return a.song_name.localeCompare(b.song_name);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }) : undefined;

    return (
        <div className="flex flex-col gap-12">
            <FilterButton isAlphabetical={isAlphabetical} toggleSorting={toggleSorting} />
            <SongList songData={sortedSongData} />
        </div>
    )
}

export default SongPage
