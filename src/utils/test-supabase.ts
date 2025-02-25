import { supabase } from '../lib/supabase';

async function testSupabaseConnection() {
  try {
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('Connection test failed:', testError.message);
      return;
    }

    console.log('Connection successful! Retrieved test data:', testData);

    // Test insertion
    const testSubmission = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test submission',
      status: 'pending'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('contact_submissions')
      .insert([testSubmission])
      .select()
      .single();

    if (insertError) {
      console.error('Insertion test failed:', insertError.message);
      return;
    }

    console.log('Insertion successful:', insertData);

    // Clean up test data
    const { error: deleteError } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('email', 'test@example.com');

    if (deleteError) {
      console.error('Cleanup failed:', deleteError.message);
      return;
    }

    console.log('Test data cleaned up successfully');

  } catch (error) {
    console.error('Test failed:', error instanceof Error ? error.message : String(error));
  }
}

// Run the test
testSupabaseConnection();
