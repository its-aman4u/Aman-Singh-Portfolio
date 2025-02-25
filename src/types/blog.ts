export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: string;
  published_at: string;
  updated_at: string;
  tags: string[];
  cover_image?: string;
  status: 'draft' | 'published';
  views_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_id?: string;
  is_edited: boolean;
  user?: {
    name: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

export interface PostStats {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  likes_count: number;
  comments_count: number;
}
