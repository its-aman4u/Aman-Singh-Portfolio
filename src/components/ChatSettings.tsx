import React from 'react';
import { Switch } from '@headlessui/react';
import type { ChatSettings as ChatSettingsType } from '../types/chat';

interface Props {
  settings: ChatSettingsType;
  onSettingsChange: (settings: ChatSettingsType) => void;
}

export const ChatSettings: React.FC<Props> = ({ settings, onSettingsChange }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Chat Settings</h3>
      
      <div className="space-y-4">
        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            AI Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => onSettingsChange({ ...settings, model: e.target.value as any })}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white"
          >
            <option value="deepseek">Deepseek Chat (Free)</option>
            <option value="gpt-4">GPT-4 (Premium)</option>
            <option value="gpt-3.5-turbo">GPT-3.5 (Standard)</option>
          </select>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Temperature: {settings.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => onSettingsChange({ ...settings, temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Response Length
          </label>
          <select
            value={settings.maxTokens}
            onChange={(e) => onSettingsChange({ ...settings, maxTokens: parseInt(e.target.value) })}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3"
          >
            <option value="250">Short (~250 tokens)</option>
            <option value="500">Medium (~500 tokens)</option>
            <option value="1000">Long (~1000 tokens)</option>
            <option value="2000">Very Long (~2000 tokens)</option>
          </select>
        </div>

        {/* Streaming Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Stream Response
          </span>
          <Switch
            checked={settings.streaming}
            onChange={(checked) => onSettingsChange({ ...settings, streaming: checked })}
            className={`${
              settings.streaming ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                settings.streaming ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* Context Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Context Memory
          </label>
          <select
            value={settings.contextLength}
            onChange={(e) => onSettingsChange({ ...settings, contextLength: parseInt(e.target.value) })}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3"
          >
            <option value="3">Short (3 messages)</option>
            <option value="5">Medium (5 messages)</option>
            <option value="10">Long (10 messages)</option>
            <option value="0">Full History</option>
          </select>
        </div>
      </div>
    </div>
  );
};
