import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000' // This is where Create React App runs
}));

// Types
type SpotifyResponse = {
    items: Array<{
        track: {
            name: string;
            artists: Array<{ name: string }>;
            duration_ms: number;
        };
        played_at: string;
    }>;
}

// Get environment variables
const refreshToken = process.env.refreshToken;
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

// Get access token from Spotify
async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
    console.log('Getting access token...');
    if (!refreshToken) {
        throw new Error('Refresh token is not defined in environment variables');
    }
    
    const auth = btoa(`${clientId}:${clientSecret}`);
    console.log('Created auth header');

    const params = new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    }).toString();

    console.log('Fetching access token from Spotify...');
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body: params
    });

    const data = await result.json();
    console.log('Got response from Spotify:', data);
    
    if (!data.access_token) {
        throw new Error('Failed to get access token: ' + JSON.stringify(data));
    }

    return data.access_token;
}

// Get recently played songs from Spotify
async function getCurrentSong(access_token: string): Promise<SpotifyResponse> {
    const result = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
        method: "GET", 
        headers: { Authorization: `Bearer ${access_token}` }
    });

    return await result.json();
}

// Add a test route for root path
app.get('/', (req, res) => {
    res.json({ message: 'Server is running! Try /api/now-playing to get your Spotify data' });
});

// Add Spotify authorization endpoint
app.get('/api/spotify', (req, res) => {
    console.log('Spotify auth endpoint hit');
    const clientId = process.env.clientId;
    const redirect_uri = 'http://localhost:3001/api/callback';  
    const scope = 'user-read-recently-played user-read-playback-state user-read-playback-position';

    console.log('Creating auth URL with clientId:', clientId);
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId!);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirect_uri);
    authUrl.searchParams.append('scope', scope);

    console.log('Redirecting to:', authUrl.toString());
    res.redirect(authUrl.toString());
});

// Add callback endpoint
app.get('/api/callback', async (req, res) => {
    console.log('Callback received:', req.query);
    const { code } = req.query;
    const clientId = process.env.clientId;
    const clientSecret = process.env.clientSecret;
    const redirect_uri = 'http://localhost:3001/api/callback';  

    if (!code || !clientId || !clientSecret) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
            body: new URLSearchParams({
                code: code.toString(),
                redirect_uri,
                grant_type: 'authorization_code'
            }).toString()
        });

        const data = await result.json();
        // Return an HTML page with the refresh token
        res.send(`
            <html>
                <body>
                    <h1>Authorization Successful!</h1>
                    <p>Here is your refresh token:</p>
                    <code>${data.refresh_token}</code>
                    <p>Copy this token and update your .env file with it.</p>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
});

// API endpoint
app.get('/api/now-playing', async (req, res) => {
    console.log('=== Handler Started ===');
    console.log('Environment variables:', {
        hasRefreshToken: !!refreshToken,
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
    });

    if (!clientId || !clientSecret || !refreshToken) {
        console.log('Missing env vars');
        return res.status(500).json({ error: 'Missing environment variables' });
    }

    try {
        const access_token = await getAccessToken(clientId, clientSecret);
        const songData = await getCurrentSong(access_token);
        res.json(songData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: String(error) });
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
