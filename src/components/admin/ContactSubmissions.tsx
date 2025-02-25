import React, { useEffect, useState } from 'react';
import { supabase, type ContactSubmission } from '../../lib/supabase';

export const ContactSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: ContactSubmission['status']) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchSubmissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Contact Submissions</h2>
      
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{submission.name}</h3>
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {submission.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={submission.status}
                    onChange={(e) => 
                      submission.id && updateStatus(submission.id, e.target.value as ContactSubmission['status'])
                    }
                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="contacted">Contacted</option>
                  </select>
                </div>
              </div>
              
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {submission.message}
              </p>
              
              <div className="mt-2 text-sm text-gray-500">
                {new Date(submission.created_at!).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
