import type { APIRoute } from 'astro';
import { addComment } from '../../../lib/blog';

export const post: APIRoute = async ({ request }) => {
  try {
    const { postId, content, parentId } = await request.json();
    const comment = await addComment(postId, content, parentId);
    
    return new Response(JSON.stringify(comment), {
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
