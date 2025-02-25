import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export type ContactSubmission = {
  id?: number;
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

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
