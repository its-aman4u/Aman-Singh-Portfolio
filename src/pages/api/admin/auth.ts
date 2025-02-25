import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import type { AdminCredentials } from '../../../types/admin';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || 'your-secure-password';

export const POST: APIRoute = async ({ request }) => {
  try {
    const credentials: AdminCredentials = await request.json();

    if (
      credentials.username === ADMIN_USERNAME &&
      credentials.password === ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { username: credentials.username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return new Response(
        JSON.stringify({ token }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid credentials' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
