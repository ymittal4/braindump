// Get environment variables from Vercel
const refreshToken = process.env.refreshToken || ''
const clientId = process.env.clientId || ''
const clientSecret = process.env.clientSecret || ''

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

    if (!result.ok) {
        throw new Error(`Failed to get access token: ${result.status}`);
    }

    const data = await result.json();
    return data.access_token;
}

export async function GET() {
    try {
        const accessToken = await getAccessToken(clientId, clientSecret);
        
        const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status}`);
        }

        const data: SpotifyResponse = await response.json();
        
        if (data.items && data.items.length > 0) {
            const track = data.items[0].track;
            return Response.json({
                name: track.name,
                artists: track.artists.map(artist => artist.name).join(', '),
                played_at: data.items[0].played_at
            });
        } else {
            return Response.json({ message: 'No recently played tracks found' });
        }
    } catch (error) {
        console.error('Error fetching now playing:', error);
        return Response.json(
            { error: 'Failed to fetch now playing data' },
            { status: 500 }
        );
    }
}
