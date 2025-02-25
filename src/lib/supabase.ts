import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export type ContactSubmission = {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
  status: 'pending' | 'reviewed' | 'contacted';
};

export type DbResult<T> = {
  data: T | null;
  error: Error | null;
};

// Create Supabase client with proper types
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  },
  db: {
    schema: 'public'
  }
});
