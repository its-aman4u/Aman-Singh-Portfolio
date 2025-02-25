import React, { useState, useRef, useEffect } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter/dist/cjs';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { Message, ChatSettings, ChatStats } from '../types/chat';
import type { AdminSession, AdminCredentials } from '../types/admin';
import { ChatSettings as ChatSettingsPanel } from './ChatSettings';
import { ChatStatistics } from './ChatStats';

interface Props {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const ChatBot: React.FC<Props> = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminSession>({
    isAuthenticated: false,
    token: ''
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({
    username: '',
    password: ''
  });
  const [stats, setStats] = useState<ChatStats>({
    totalMessages: 0,
    totalTokens: 0,
    totalCost: 0,
    averageResponseTime: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseStartTime = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminCredentials)
      });

      const data = await response.json();

      if (response.ok) {
        setAdminSession({
          isAuthenticated: true,
          token: data.token
        });
        setShowAdminLogin(false);
        
        // Add system message about admin mode
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Admin mode activated. You can now use commands to update the portfolio content.',
          timestamp: Date.now()
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Failed to authenticate. Please try again.',
        timestamp: Date.now()
      }]);
    }

    setIsLoading(false);
  };

  const handleContentUpdate = async (command: string) => {
    try {
      // Parse command using GPT to extract intent and content
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`
        },
        body: JSON.stringify({
          message: command,
          context: messages,
          settings: {
            ...settings,
            systemPrompt: `You are an AI assistant with admin capabilities. 
            Commands:
            1. "update about" - Update about section
            2. "add project" - Add new project
            3. "update project" - Update existing project
            4. "delete project" - Delete project
            Parse user input and respond with structured data.`
          }
        })
      });

      const data = await response.json();
      
      if (data.adminCommand) {
        // Execute admin command
        const contentResponse = await fetch('/api/admin/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminSession.token}`
          },
          body: JSON.stringify(data.adminCommand)
        });

        if (!contentResponse.ok) {
          throw new Error('Failed to update content');
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Content updated successfully!',
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error('Content update error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Failed to update content. Please try again.',
        timestamp: Date.now()
      }]);
    }
  };

  const updateStats = (newMessage: Message, responseTime?: number) => {
    setStats(prev => {
      const newStats = { ...prev };
      newStats.totalMessages++;
      newStats.totalTokens += newMessage.tokenCount || 0;
      newStats.totalCost += newMessage.cost || 0;
      
      if (responseTime) {
        const totalTime = prev.averageResponseTime * (prev.totalMessages - 1) + responseTime;
        newStats.averageResponseTime = totalTime / prev.totalMessages;
      }
      
      return newStats;
    });
  };

  const getRelevantContext = () => {
    if (!settings?.contextLength) return messages;
    return messages.slice(-settings.contextLength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    responseStartTime.current = Date.now();

    try {
      // If admin is authenticated and input starts with "/"
      if (adminSession.isAuthenticated && input.startsWith('/')) {
        await handleContentUpdate(input);
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            context: getRelevantContext(),
            settings
          }),
        });

        const data = await response.json();
        const responseTime = (Date.now() - responseStartTime.current) / 1000;
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          model: settings.model,
          timestamp: Date.now(),
          tokenCount: data.tokenCount,
          cost: data.cost
        };

        setMessages(prev => [...prev, assistantMessage]);
        updateStats(assistantMessage, responseTime);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
      updateStats(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 shadow-xl">
            <Tab.Group>
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                  AI Assistant {adminSession.isAuthenticated && '(Admin Mode)'}
                </Dialog.Title>
                <div className="flex items-center space-x-2">
                  {!adminSession.isAuthenticated && (
                    <button
                      onClick={() => setShowAdminLogin(true)}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Admin Login
                    </button>
                  )}
                  <Tab.List className="flex space-x-2">
                    <Tab className={({ selected }) =>
                      `px-3 py-1 rounded-md text-sm font-medium ${
                        selected
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`
                    }>
                      Chat
                    </Tab>
                    <Tab className={({ selected }) =>
                      `px-3 py-1 rounded-md text-sm font-medium ${
                        selected
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`
                    }>
                      Settings
                    </Tab>
                    <Tab className={({ selected }) =>
                      `px-3 py-1 rounded-md text-sm font-medium ${
                        selected
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`
                    }>
                      Stats
                    </Tab>
                  </Tab.List>
                </div>
              </div>

              <Tab.Panels>
                <Tab.Panel>
                  <div className="h-96 overflow-y-auto p-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${
                          message.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          {message.model && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {message.model} • {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                          <ReactMarkdown
                            components={{
                              code: ({ node, inline, className, children, ...props }: CodeProps) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const code = String(children).replace(/\n$/, '');
                                
                                if (!inline && match) {
                                  return (
                                    <SyntaxHighlighter
                                      style={atomDark}
                                      language={match[1]}
                                      PreTag="div"
                                      customStyle={{
                                        margin: '1em 0',
                                        padding: '1em',
                                        borderRadius: '0.5em'
                                      }}
                                    >
                                      {code}
                                    </SyntaxHighlighter>
                                  );
                                }
                                
                                return (
                                  <code className={className} {...props}>
                                    {code}
                                  </code>
                                );
                              }
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                          {message.tokenCount && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {message.tokenCount} tokens • ${message.cost?.toFixed(4) || '0.0000'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={adminSession.isAuthenticated ? "Use / for admin commands" : "Ask me anything..."}
                        className="flex-1 rounded-lg border dark:border-gray-700 p-2 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="p-4">
                    <ChatSettingsPanel
                      settings={settings}
                      onSettingsChange={onSettingsChange}
                    />
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="p-4">
                    <ChatStatistics stats={stats} />
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </Dialog>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAdminLogin(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Admin Login</h3>
              <form onSubmit={handleAdminLogin}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <input
                      type="text"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="mt-1 block w-full rounded-md border dark:border-gray-600 shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <input
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="mt-1 block w-full rounded-md border dark:border-gray-600 shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminLogin(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
