import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminPanel } from './AdminPanel';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'activity'>('about');
  const [aboutContent, setAboutContent] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activityLogs, setActivityLogs] = useState<string[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    technologies: [],
    image: ''
  });

  // Load initial data
  useEffect(() => {
    loadProjects();
    loadAboutContent();
    loadActivityLogs();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to load projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  const loadAboutContent = async () => {
    try {
      const response = await fetch('/api/about');
      if (!response.ok) throw new Error('Failed to load about content');
      const data = await response.json();
      setAboutContent(data.content);
    } catch (err) {
      setError('Failed to load about content');
    }
  };

  const loadActivityLogs = async () => {
    try {
      const response = await fetch('/api/admin/activity', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to load activity logs');
      const data = await response.json();
      setActivityLogs(data.logs);
    } catch (err) {
      setError('Failed to load activity logs');
    }
  };

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
            maxTokens: 500
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update about section');
      
      setSuccess('About section updated successfully!');
      loadActivityLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update about section');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
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
          message: `/add project ${JSON.stringify(newProject)}`,
          context: [],
          settings: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 500
          }
        })
      });

      if (!response.ok) throw new Error('Failed to add project');
      
      setSuccess('Project added successfully!');
      setNewProject({ title: '', description: '', technologies: [], image: '' });
      loadProjects();
      loadActivityLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

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
          message: `/delete project ${id}`,
          context: [],
          settings: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 500
          }
        })
      });

      if (!response.ok) throw new Error('Failed to delete project');
      
      setSuccess('Project deleted successfully!');
      loadProjects();
      loadActivityLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
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
          className={`px-4 py-2 ${activeTab === 'activity' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity Log
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
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title:</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description:</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-24 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Technologies (comma-separated):</label>
                <input
                  type="text"
                  value={newProject.technologies.join(', ')}
                  onChange={(e) => setNewProject(prev => ({ 
                    ...prev, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL:</label>
                <input
                  type="text"
                  value={newProject.image}
                  onChange={(e) => setNewProject(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handleAddProject}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Project'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Existing Projects</h3>
            {projects.map(project => (
              <div key={project.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold">{project.title}</h4>
                    <p className="text-gray-600">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Activity Log</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {activityLogs.map((log, index) => (
              <div
                key={index}
                className="py-2 border-b last:border-b-0"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
