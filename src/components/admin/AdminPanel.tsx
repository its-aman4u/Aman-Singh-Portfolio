import React, { useState } from 'react';

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'token'>('about');
  const [aboutContent, setAboutContent] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateAbout = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: `/update about ${aboutContent}`,
          context: [],
          settings: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 500,
            streaming: false,
            contextLength: 10
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update about section');
      }

      setSuccess('About section updated successfully!');
      setAboutContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update about section');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (project: Omit<Project, 'id'>) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: `/add project ${JSON.stringify(project)}`,
          context: [],
          settings: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 500,
            streaming: false,
            contextLength: 10
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add project');
      }

      setSuccess('Project added successfully!');
      setProjects(prev => [...prev, data.project]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex space-x-4 border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'about' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About Section
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'projects' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'token' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('token')}
        >
          Your Token
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Update About Section</h2>
          <textarea
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
            className="w-full h-40 p-2 border rounded"
            placeholder="Enter new about section content..."
          />
          <button
            onClick={handleUpdateAbout}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update About Section'}
          </button>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Projects</h2>
          {/* Project list and add project form would go here */}
        </div>
      )}

      {activeTab === 'token' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Admin Token</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-mono break-all">{token}</p>
          </div>
          <p className="text-sm text-gray-600">
            This token is valid for 24 hours. You can use it in the chat interface for admin commands.
          </p>
        </div>
      )}
    </div>
  );
};
