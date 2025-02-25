import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contact = await request.json();

    // Validate required fields
    if (!contact.name?.trim() || !contact.email?.trim() || !contact.message?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate message length
    if (contact.message.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Message must be under 1000 characters' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Insert into Supabase with better error handling
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: contact.name.trim(),
          email: contact.email.trim(),
          message: contact.message.trim(),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '42P01') { // Table doesn't exist
        return new Response(
          JSON.stringify({ error: 'Contact form is temporarily unavailable. Please try again later.' }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit contact form. Please try again later.' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
