import React from 'react';
import type { ChatStats } from '../types/chat';

interface Props {
  stats: ChatStats;
}

export const ChatStatistics: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMessages}</div>
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Tokens Used</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTokens}</div>
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Cost</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ${stats.totalCost.toFixed(4)}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Response</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.averageResponseTime.toFixed(1)}s
        </div>
      </div>
    </div>
  );
};
