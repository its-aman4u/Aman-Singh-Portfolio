import React, { useState } from 'react';

export const TokenGenerator: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate token');
      }

      setToken(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      alert('Token copied to clipboard!');
    } catch (err) {
      alert('Failed to copy token');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Token Generator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Token'}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {token && (
        <div className="mt-4">
          <div className="bg-gray-100 p-4 rounded relative">
            <p className="font-mono break-all text-sm">{token}</p>
            <button
              onClick={copyToken}
              className="absolute right-2 top-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Copy
            </button>
          </div>

          <div className="mt-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <p className="font-bold">Quick Actions:</p>
            <div className="mt-2 space-y-2">
              <a
                href="/admin/dashboard"
                className="block w-full px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600"
              >
                Go to Admin Dashboard
              </a>
              <a
                href="/test-chat"
                className="block w-full px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600"
              >
                Go to Test Chat
              </a>
            </div>
          </div>

          <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="font-bold">Available Admin Commands:</p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li><code className="bg-yellow-50 px-1">/update about [content]</code> - Update about section</li>
              <li><code className="bg-yellow-50 px-1">/add project [json]</code> - Add new project</li>
              <li><code className="bg-yellow-50 px-1">/update project [json]</code> - Update project</li>
              <li><code className="bg-yellow-50 px-1">/delete project [id]</code> - Delete project</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
