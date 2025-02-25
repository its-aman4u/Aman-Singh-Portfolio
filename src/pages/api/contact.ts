import type { APIRoute } from 'astro';
import { supabase, type ContactSubmission } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contact: ContactSubmission = await request.json();

    // Validate input
    if (!contact.name || !contact.email || !contact.message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: contact.name,
          email: contact.email,
          message: contact.message,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit contact form' }),
      { status: 500 }
    );
  }
};
