import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify admin token
    if (!token || token !== import.meta.env.ADMIN_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 403 }
      );
    }

    // Get activity logs
    const { data: activities, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return new Response(
      JSON.stringify({ activities }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Activity logs error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch activity logs' }),
      { status: 500 }
    );
  }
};
