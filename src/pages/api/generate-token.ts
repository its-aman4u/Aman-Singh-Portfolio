import type { APIRoute } from 'astro';
import { generateToken } from '../../utils/jwt';

export const GET: APIRoute = async () => {
  const JWT_SECRET = import.meta.env.JWT_SECRET;
  const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME;

  if (!JWT_SECRET) {
    return new Response(
      JSON.stringify({ error: 'JWT_SECRET is not set in environment variables' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!ADMIN_USERNAME) {
    return new Response(
      JSON.stringify({ error: 'ADMIN_USERNAME is not set in environment variables' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const token = generateToken(
    { 
      username: ADMIN_USERNAME,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }, 
    JWT_SECRET
  );

  return new Response(
    JSON.stringify({ token }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
