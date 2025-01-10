import { useEffect, useState } from "react";

type songProps = {
    name: string;
    artist: string;
    time: string;
}

const clientId = "4b0a4da689864d42b090c255fd3f1caf"
const code = undefined

//get access token from spotify
async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const auth = btoa(`${clientId}:${clientSecret}`);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

//get current song from spotify
async function getCurrentSong(access_token:string): Promise<songProps> {
    const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET", headers: { Authorization: `Bearer ${access_token}` }
    });
    return await result.json();
}

const SpotifyData = () => {

    //states
    const [songdata, setSongdata] = useState<songProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [noSong, setNosong] = useState(true);
    const [error, setError] = useState<string | null>(null);


    //runnning the function and getting data
    useEffect(() => {

        //make api call here
        //if data exists, setSongdata to data from api call, setLoading to false, setNosong to false
        //if data does not exist, setSongdata to null, setLoading to false, setNosong to true
        //
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
            <div>{songdata?.name}</div>
            <div>{songdata?.artist}</div>
            <div>{songdata?.time}</div>
        </div>
    )
}

export default SpotifyData