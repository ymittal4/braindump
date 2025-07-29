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
            album: {
                images: Array<{
                    url: string;
                    height: number;
                    width: number;
                }>;
            };
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
            // Return the data in the format expected by SpotifyData component
            return Response.json({
                items: data.items
            });
        } else {
            return Response.json({ 
                items: [],
                message: 'No recently played tracks found' 
            });
        }
    } catch (error) {
        console.error('Error fetching now playing:', error);
        return Response.json(
            { error: 'Failed to fetch now playing data' },
            { status: 500 }
        );
    }
}
