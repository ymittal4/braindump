import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { config } from 'dotenv-safe';

// Load environment variables with validation
config({
  allowEmptyValues: false,
  example: '.env.example',
});

// Constants
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com';
const SPOTIFY_API_URL = 'https://api.spotify.com';

// Types
interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  duration_ms: number;
}

interface SpotifyItem {
  track: SpotifyTrack;
  played_at: string;
}

interface SpotifyResponse {
  items: SpotifyItem[];
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

// Initialize Express
const app = express();

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
};

// Utility functions
const getAuthHeader = (clientId: string, clientSecret: string): string => {
  return Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
};

const validateEnvVars = (): { clientId: string; clientSecret: string; refreshToken: string } => {
  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
  
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Missing required environment variables');
  }
  
  return {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN
  };
};

// Spotify API functions
const getAccessToken = async (clientId: string, clientSecret: string, refreshToken: string): Promise<string> => {
  try {
    const response = await fetch(`${SPOTIFY_AUTH_URL}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${getAuthHeader(clientId, clientSecret)}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Spotify API error: ${error.error_description || 'Unknown error'}`);
    }

    const data: TokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get access token');
  }
};

const getRecentlyPlayed = async (accessToken: string): Promise<SpotifyResponse> => {
  try {
    const response = await fetch(`${SPOTIFY_API_URL}/v1/me/player/recently-played`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recently played:', error);
    throw new Error('Failed to fetch recently played tracks');
  }
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'running',
    message: 'Welcome to the Spotify Recently Played API',
    endpoints: {
      auth: '/api/spotify',
      callback: '/api/callback',
      nowPlaying: '/api/now-playing'
    }
  });
});

app.get('/api/spotify', (req: Request, res: Response) => {
  const { clientId } = validateEnvVars();
  const redirectUri = `${req.protocol}://${req.get('host')}/api/callback`;
  const scopes = [
    'user-read-recently-played',
    'user-read-playback-state',
    'user-read-playback-position'
  ].join(' ');

  const authUrl = new URL(`${SPOTIFY_AUTH_URL}/authorize`);
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes);

  res.redirect(authUrl.toString());
});

app.get('/api/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  const { clientId, clientSecret } = validateEnvVars();
  const redirectUri = `${req.protocol}://${req.get('host')}/api/callback`;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const response = await fetch(`${SPOTIFY_AUTH_URL}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${getAuthHeader(clientId, clientSecret)}`
      },
      body: new URLSearchParams({
        code: code.toString(),
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Spotify API error: ${error.error_description || 'Unknown error'}`);
    }

    const data: TokenResponse = await response.json();
    
    if (!data.refresh_token) {
      throw new Error('No refresh token received');
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Spotify Authorization</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem;
          }
          code { 
            background: #f4f4f4; 
            padding: 0.2rem 0.4rem; 
            border-radius: 3px; 
            font-family: monospace;
            word-break: break-all;
            display: inline-block;
            max-width: 100%;
            overflow-x: auto;
          }
          .success { color: #28a745; }
          .token {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            border-left: 4px solid #28a745;
            margin: 1rem 0;
          }
        </style>
      </head>
      <body>
        <h1 class="success">🎵 Authorization Successful!</h1>
        <p>Your Spotify refresh token has been generated. Please add it to your <code>.env</code> file:</p>
        
        <div class="token">
          <strong>Refresh Token:</strong><br>
          <code>${data.refresh_token}</code>
        </div>
        
        <p>Add this to your <code>.env</code> file:</p>
        <pre>REFRESH_TOKEN=${data.refresh_token}</pre>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error in callback:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body>
        <h1>Error</h1>
        <p>${error instanceof Error ? error.message : 'An unknown error occurred'}</p>
      </body>
      </html>
    `);
  }
});

app.get('/api/now-playing', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientId, clientSecret, refreshToken } = validateEnvVars();
    
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    const recentlyPlayed = await getRecentlyPlayed(accessToken);
    
    res.json({
      status: 'success',
      data: recentlyPlayed.items.map(item => ({
        track: item.track.name,
        artists: item.track.artists.map(artist => artist.name),
        playedAt: item.played_at,
        durationMs: item.track.duration_ms
      }))
    });
  } catch (error) {
    next(error);
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

export default app;
