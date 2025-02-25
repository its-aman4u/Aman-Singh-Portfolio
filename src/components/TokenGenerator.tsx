import React, { useState } from 'react';

export const TokenGenerator: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateToken = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/generate-token');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setToken(data.token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token)
      .then(() => alert('Token copied to clipboard!'))
      .catch(() => alert('Failed to copy token'));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Token Generator</h1>
      
      <div className="space-y-4">
        <button
          onClick={generateToken}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Token'}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {token && (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded relative">
              <p className="font-mono break-all pr-20">{token}</p>
              <button
                onClick={copyToken}
                className="absolute right-2 top-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
            
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              <p className="font-bold">Instructions:</p>
              <ol className="list-decimal ml-4 mt-2">
                <li>Copy the token above (or use the Copy button)</li>
                <li>Go to <a href="/test-chat" className="text-blue-600 hover:underline">/test-chat</a></li>
                <li>Paste the token in the "Admin Token" field</li>
                <li>Try the admin commands listed at the bottom of the test chat page</li>
              </ol>
            </div>

            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="font-bold">Note:</p>
              <p>This token will be valid for 24 hours.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
