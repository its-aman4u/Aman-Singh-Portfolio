import React, { useState, useEffect } from 'react';
import type { Message, ChatSettings, ModelType } from '../types/chat';

const defaultSettings: ChatSettings = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 500,
  streaming: false,
  contextLength: 10
};

export const TestChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to authenticate as admin on component mount
    authenticateAdmin();
  }, []);

  const authenticateAdmin = async () => {
    try {
      const username = import.meta.env.ADMIN_USERNAME;
      const password = import.meta.env.ADMIN_PASSWORD;

      if (!username || !password) {
        console.log('No admin credentials in environment');
        return;
      }

      const response = await fetch('/api/admin/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        setAdminToken(token);
        setIsAdmin(true);
        localStorage.setItem('adminToken', token);
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      console.error('Admin authentication failed:', err);
      setError('Authentication failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const userMessage: Message = {
        role: 'user',
        content: input.trim(),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAdmin && { 'Authorization': `Bearer ${adminToken}` })
        },
        body: JSON.stringify({
          message: userMessage,
          settings
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        tokenCount: data.tokenCount,
        cost: data.cost,
        model: settings.model
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (model: ModelType) => {
    setSettings(prev => ({
      ...prev,
      model
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 p-4 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
            }`}
          >
            <div className="font-medium mb-2">{msg.role === 'user' ? 'You' : 'Assistant'}</div>
            <div>{msg.content}</div>
            {msg.tokenCount && (
              <div className="text-sm text-gray-500">
                Tokens: {msg.tokenCount}, Cost: {msg.cost}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Model:</label>
        <select
          value={settings.model}
          onChange={(e) => handleModelChange(e.target.value as ModelType)}
          className="w-full p-2 border rounded"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="deepseek">Deepseek</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};
