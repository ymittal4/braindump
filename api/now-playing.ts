// Get environment variables from Vercel
const refreshToken = process.env.refreshToken || ''
const clientId = process.env.clientId || ''
const clientSecret = process.env.clientSecret || ''
const code = undefined

type SpotifyResponse = {
    items: Array<{
        track: {
            name: string;
            artists: Array<{ name: string }>;
            duration_ms: number;
        };
        played_at: string;  // When the track was played
    }>;
}


//get access token from spotify
async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {

    if (!refreshToken) {
        throw new Error('Refresh token is not defined in environment variables');
    }
    
    const auth = btoa(`${clientId}:${clientSecret}`);

    const params = new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    }).toString();

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`,
        },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

//get current song from spotify
async function getCurrentSong(access_token:string): Promise<SpotifyResponse> {
    //calls Spotify API
    const result = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
        method: "GET", 
        headers: { Authorization: `Bearer ${access_token}` }
    });

    return await result.json();
}

export const config = {
    runtime: 'edge'
};

export interface Request extends globalThis.Request {}

export default async function handler(request: Request){
    console.log("=== Handler Started ===");

    //check to see if all variables exist to run handler function
    if (!clientId || !clientSecret || !refreshToken) {
        console.log("missing env vars:")
        return new globalThis.Response(
            JSON.stringify({ error: 'missing environment variables'}),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json'}
            }
        )
    }

    // running the function
    try {
        const access_token = await getAccessToken(clientId, clientSecret);
        const songData = await getCurrentSong(access_token);

        return new globalThis.Response(JSON.stringify(songData), {
            status:200,
            headers: { 'Content-Type': 'application/json'}
        });
    } catch (error) {
        return new globalThis.Response(JSON.stringify(error), {
            status:500, 
            headers: { 'Content-Type': 'application/json'}
        })
    }
}