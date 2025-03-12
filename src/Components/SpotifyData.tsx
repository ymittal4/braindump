import { useEffect, useState, useRef } from "react";
import { data } from "react-router-dom";
import { supabase } from "../config/supabase";
import Button from "./Button";
import { Link } from "react-router-dom";


import useHover from "../hooks/hoverHook";
import BlockAnimation from "../Animations/BlockAnimation";

type songProps = {
    items: Array<{
        track: {
            name: string;                    
            artists: Array<{ name: string }>;
            album: {images: Array<{          
                url: string,                 
                height: number,              
                width: number                
            }>}
        };
        played_at: string;  
    }>;
}

const SpotifyData = () => {
    const [isHovered, hoverProps] = useHover();                           
    const [songdata, setSongdata] = useState<songProps | null>(null);      
    const [loading, setLoading] = useState(true);                        
    const [noSong, setNosong] = useState(true);                          
    const [error, setError] = useState<string | null>(null);             
    const imageBlocks = useRef<HTMLDivElement>(null);                    
    const [blockIsHovered, setHoverIndex] = useState<number | null>(null) 
    const [activeBlocks, setActiveBlocks] = useState<number[]>([])       

    useEffect(() => {
        async function fetchSongData() {
            try {
                const response = await fetch('http://localhost:3001/api/now-playing');
                const data = await response.json();
                // console.log("new data is", data)
                if (data) {setNosong(false);}
                setSongdata(data);
            } catch(error) {
                console.error('error fetching api data', error);
            } finally {
                setLoading(false)
            }
        }
        fetchSongData()        
    },[])


    useEffect(() => {}, [activeBlocks]);

    function changeTimeToPST() {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        if (songdata) {
            const currentDate = songdata?.items[0].played_at;
            const dateObject = new Date(currentDate)
            const songMonth = monthNames[dateObject.getMonth()]
            const songDay = dateObject.getDate()
            const songTime = dateObject.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour12: true, hour: 'numeric', minute: 'numeric' })
            const newDate = (songMonth + " " + songDay + "," + " " + songTime)
            return  (newDate + " PST")
        }
        else {
            return null
        }
    }

    async function insertSongData() {
        const { data, error } = await supabase
            .from('SpotifySongHistory')
            // .select('*')
            // .delete()
            // .gt('id', 0)
            .select('song_name')
            .eq("song_name", songdata?.items[0].track.name)

        const songNameSearching = songdata?.items[0].track.name

        console.log("i am looking for song", songNameSearching)
        const { data: allSongs, error: allSongsError } = await supabase
            .from('SpotifySongHistory')
            .select('*')

        if (data && data?.length > 0) {
            console.log("song data exists in db")
        } else {
            console.log("this is a new song", songdata?.items[0].track.name)
            const { data, error } = await supabase
                .from('SpotifySongHistory')
                .insert([
                    {
                        song_name:songdata?.items[0].track.name, 
                        created_at: songdata?.items[0].played_at, 
                        song_artists: songdata?.items[0].track.artists[0].name,
                        album_cover: songdata?.items[0].track.album.images[0].url
                    }
                ])

                if (error) {
                    console.log ("error pushing data to supabase", error)
                }
                else {
                    console.log ("data inserted successfully", songdata?.items[0].track.name)
                }
            }
    }

    async function deleteSongData() {
        const {data, error} = await supabase 
            .from('SpotifySongHistory')
            .delete()
            .gt('id', 0)
    }

    useEffect(() => {
        if (songdata && songdata.items && songdata.items.length > 0) {
            insertSongData();
        }
        else {
            console.log("song still loading")
        }
    }, [songdata?.items[0].track.name]);

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
        className={`${isHovered ? 'bg-red-500 bg-opacity-20 transition-bg-opacity duration-150' : ''}`}>
            <div className="flex gap-4 border-t border-r border-l p-2">
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
            <div className="border-l border-r border-b p-2">
                <div> Last played on {changeTimeToPST()} </div>
                <Link to="/SongPage" className="text-sm opacity-30 hover:opacity-80 transition-opacity duration-500">View song history</Link>
            </div>
        </div>
    )
}

export default SpotifyData