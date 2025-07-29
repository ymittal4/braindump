'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { supabase } from "../config/supabase";
import Link from "next/link";
import useHover from "../hooks/hoverHook";
import BlockAnimation from "../Animations/BlockAnimation";

interface SpotifyTrack {
    name: string;
    artists: Array<{ name: string }>;
    album: {
        images: Array<{
            url: string;
            height: number;
            width: number;
        }>;
    };
}

interface SpotifyItem {
    track: SpotifyTrack;
    played_at: string;
}

interface SpotifyData {
    items: SpotifyItem[];
}

const SpotifyData = () => {
    const [isHovered, hoverProps] = useHover();
    const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const imageBlocks = useRef<HTMLDivElement>(null);
    const [blockIsHovered, setHoverIndex] = useState<number | null>(null);
    const [activeBlocks, setActiveBlocks] = useState<number[]>([]);

    const fetchSpotifyData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching Spotify data...');
            const response = await fetch('/api/now-playing');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Spotify data received:', data);
            setSpotifyData(data);
        } catch (fetchError) {
            console.error('Error fetching Spotify data:', fetchError);
            setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSpotifyData();
    }, [fetchSpotifyData]);



    const formatPlayedAtTime = useMemo(() => {
        if (!spotifyData?.items?.[0]?.played_at) {
            return null;
        }

        const playedAt = new Date(spotifyData.items[0].played_at);
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'America/Los_Angeles',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        
        return playedAt.toLocaleDateString('en-US', options) + ' PST';
    }, [spotifyData?.items?.[0]?.played_at]);

    const insertSongData = useCallback(async (currentTrack: SpotifyItem) => {
        try {
            const songName = currentTrack.track.name;
            
            const { data: existingSongs, error: checkError } = await supabase
                .from('SpotifySongHistory')
                .select('song_name')
                .eq('song_name', songName);

            if (checkError) {
                console.error('Error checking existing song:', checkError);
                return;
            }

            if (!existingSongs || existingSongs.length === 0) {
                const { error: insertError } = await supabase
                    .from('SpotifySongHistory')
                    .insert({
                        song_name: songName,
                        created_at: currentTrack.played_at,
                        song_artists: currentTrack.track.artists[0]?.name,
                        album_cover: currentTrack.track.album.images[0]?.url
                    });

                if (insertError) {
                    console.error('Error inserting song data:', insertError);
                } else {
                    console.log('Song inserted successfully:', songName);
                }
            }
        } catch (error) {
            console.error('Error in insertSongData:', error);
        }
    }, []);


    useEffect(() => {
        if (spotifyData?.items?.[0]) {
            insertSongData(spotifyData.items[0]);
        }
    }, [spotifyData?.items?.[0]?.track?.name, insertSongData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg">Loading current song...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">Error loading song data: {error}</div>
            </div>
        );
    }

    if (!spotifyData?.items?.length) {
        console.log('No items found in spotifyData:', spotifyData);
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">No recent songs found</div>
            </div>
        );
    }


    const currentTrack = spotifyData.items[0];

    return (
        <div
            {...hoverProps}
            className={`${isHovered ? 'bg-red-500 bg-opacity-20 transition-all duration-150' : ''}`}
        >
            <div className="flex gap-4 border-t border-r border-l p-2">
                <div className="relative">
                    <img 
                        src={currentTrack.track.album.images[0]?.url} 
                        alt={`${currentTrack.track.name} album cover`}
                        width="150" 
                        height="150"
                        className="rounded"
                    />
                    <div className="absolute inset-0"> 
                        <div className="h-full w-full grid grid-cols-4"> 
                            {Array.from({ length: 16 }, (_, index) => (
                                <div 
                                    ref={imageBlocks} 
                                    key={index} 
                                    onMouseEnter={() => {
                                        setHoverIndex(index);
                                        BlockAnimation(
                                            Array.from({ length: 16 }, (_, i) => i), 
                                            blockIsHovered, 
                                            setActiveBlocks
                                        );
                                    }}
                                    onMouseLeave={() => setHoverIndex(null)}
                                    className={`
                                        block bg-[#fd5530] mix-blend-hard-light
                                        transition-opacity duration-500 ease-in-out
                                        ${activeBlocks.includes(index) ? 'opacity-50' : 'opacity-0'}
                                    `}
                                />                           
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <h3 className="font-semibold text-lg">{currentTrack.track.name}</h3>
                    <p className="text-gray-600">{currentTrack.track.artists[0]?.name}</p>
                </div>
            </div>
            <div className="border-l border-r border-b p-2">
                <div className="text-sm text-gray-500">
                    Last played on {formatPlayedAtTime}
                </div>
                <Link 
                    href="/SongPage" 
                    className="text-sm opacity-30 hover:opacity-80 transition-opacity duration-500"
                >
                    View song history
                </Link>
            </div>
        </div>
    )
}

export default SpotifyData
