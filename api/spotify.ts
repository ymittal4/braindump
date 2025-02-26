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
    try {
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', redirect_uri);
        const scope = 'user-read-recently-played user-read-playback-state user-read-playback-position';
        authUrl.searchParams.append('scope', scope);
        
        console.log('Redirecting to:', authUrl.toString());
        
        return globalThis.Response.redirect(authUrl.toString(), 302);
    } catch (error) {
        console.error('Error in spotify.ts:', error);
        return new globalThis.Response(
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