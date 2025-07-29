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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isAlphabetical, setIsAlphabetical] = useState(false);

    async function showSpotifyData() {
        try {
            setLoading(true);
            setError(null);
            
            const { data, error } = await supabase
                .from('SpotifySongHistory')
                .select('song_name, created_at, song_artists, album_cover')

            if (error) {
                console.error('Database error:', error);
                setError(`Failed to load songs: ${error.message}`);
                return;
            }

            if (data) {
                setSongData(data);
            }
        } catch (err) {
            console.error('Unexpected error fetching song data:', err);
            setError('An unexpected error occurred while loading songs');
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div>Loading songs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 min-h-64">
                <div className="text-red-500">{error}</div>
                <button 
                    onClick={showSpotifyData}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12">
            <FilterButton isAlphabetical={isAlphabetical} toggleSorting={toggleSorting} />
            <SongList songData={sortedSongData} />
        </div>
    )
}

export default SongPage
