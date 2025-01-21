import 'dotenv/config';  // Add this at the top
import type { Request, Response } from 'web/request';

export const config = {
    runtime: 'edge'
};

const clientId = "4b0a4da689864d42b090c255fd3f1caf";
const clientSecret = "7cc9cb5da80d493aa8b95cddcb27e4eb";
const redirect_uri = 'http://localhost:3000/api/callback';

export default async function handler(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    console.log('Received code:', code);
    
    if (!code) {
        return new Response(
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
        
        return new Response(
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
        return new Response(
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