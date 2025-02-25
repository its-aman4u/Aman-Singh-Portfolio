import type { APIRoute } from 'astro';
import { generateToken } from '../../../utils/jwt';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();
    
    // Validate environment variables
    const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD;
    const JWT_SECRET = import.meta.env.JWT_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error. Please check environment variables.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate token
    const token = generateToken(
      {
        username: ADMIN_USERNAME,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      JWT_SECRET
    );

    // Log admin activity
    console.log(`[${new Date().toISOString()}] Admin token generated for user: ${username}`);

    return new Response(
      JSON.stringify({ token }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Token generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
