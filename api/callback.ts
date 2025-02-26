// Edge functions don't support dotenv
export interface Request extends globalThis.Request {}
export interface Response extends globalThis.Response {}

export const config = {
    runtime: 'edge'
};

// Get environment variables from Vercel
const clientId = process.env.clientId || '';
const clientSecret = process.env.clientSecret || '';
// For production, use the actual deployed URL
const redirect_uri = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/callback` 
  : 'http://localhost:3000/api/callback';

export default async function handler(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    console.log('Received code:', code);
    
    if (!code) {
        return new globalThis.Response(
            JSON.stringify({ error: 'No code provided' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    try {
        const tokenUrl = 'https://accounts.spotify.com/api/token';
        const body = new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }).toString();

        const auth = btoa(`${clientId}:${clientSecret}`);
        console.log('Requesting token with:', {
            url: tokenUrl,
            code,
            redirect_uri,
            auth
        });

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + auth
            },
            body
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(`Spotify API error: ${data.error}`);
        }

        console.log('Your refresh token:', data.refresh_token);
        
        return new globalThis.Response(
            JSON.stringify({ message: 'Check your terminal for the refresh token!' }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error:', error);
        return new globalThis.Response(
            JSON.stringify({ error: String(error) }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}