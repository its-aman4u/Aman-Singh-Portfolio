import { createClient } from '@supabase/supabase-js';
import type { BlogPost, Comment, PostStats } from '../types/blog';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.PUBLIC_SUPABASE_ANON_KEY!
);

export async function getBlogPosts(page = 1, limit = 10, tag?: string) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from('blog_posts')
    .select('*, author:auth.users(name, avatar_url)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(start, end);

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, author:auth.users(name, avatar_url)')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  await supabase.rpc('increment_views', { post_slug: slug });
  return data;
}

export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, user:auth.users(name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Organize comments into threads
  const comments = data.reduce((acc: { [key: string]: Comment }, comment) => {
    acc[comment.id] = { ...comment, replies: [] };
    return acc;
  }, {});

  Object.values(comments).forEach(comment => {
    if (comment.parent_id && comments[comment.parent_id]) {
      comments[comment.parent_id].replies?.push(comment);
    }
  });

  return Object.values(comments).filter(comment => !comment.parent_id);
}

export async function addComment(postId: string, content: string, parentId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to comment');

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
      parent_id: parentId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function toggleLike(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to like posts');

  const { data: existingLike } = await supabase
    .from('likes')
    .select()
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existingLike) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: user.id });
    if (error) throw error;
    return true;
  }
}

export async function getPostStats(postId: string): Promise<PostStats> {
  const { data, error } = await supabase
    .from('post_stats')
    .select()
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data;
}
