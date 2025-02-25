import type { APIRoute } from 'astro';
import { toggleLike, getPostStats } from '../../../lib/blog';

export const post: APIRoute = async ({ request }) => {
  try {
    const { postId } = await request.json();
    const liked = await toggleLike(postId);
    const stats = await getPostStats(postId);
    
    return new Response(JSON.stringify({
      liked,
      count: stats.likes_count
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
