import type { Request, Response } from 'web/request';

export const config = {
    runtime: 'edge'
};

const clientId = "4b0a4da689864d42b090c255fd3f1caf";
const clientSecret = "7cc9cb5da80d493aa8b95cddcb27e4eb";
const redirect_uri = 'http://localhost:3000/api/callback';

export default async function handler(request: Request) {
    try {
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', redirect_uri);
        const scope = 'user-read-recently-played user-read-playback-state user-read-playback-position';
        authUrl.searchParams.append('scope', scope);
        
        console.log('Redirecting to:', authUrl.toString());
        
        return Response.redirect(authUrl.toString(), 302);
    } catch (error) {
        console.error('Error in spotify.ts:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create auth URL' }),
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}