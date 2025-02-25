export type MessageRole = 'system' | 'user' | 'assistant';
export type ModelType = 'gpt-3.5-turbo' | 'gpt-4' | 'deepseek';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: number;
  tokenCount?: number;
  cost?: number;
  model?: ModelType;
}

export interface ChatSettings {
  model: ModelType;
  temperature: number;
  maxTokens: number;
  streaming: boolean;
  contextLength: number;
}

export interface ChatStats {
  totalMessages: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
}

export interface AdminCommandBase {
  timestamp: number;
}

export interface UpdateContentCommand extends AdminCommandBase {
  type: 'update_content';
  payload: {
    section: string;
    content: string;
    timestamp: number;
  };
}

export interface AddProjectCommand extends AdminCommandBase {
  type: 'add_project';
  payload: {
    title: string;
    description: string;
    technologies: string[];
    timestamp: number;
  };
}

export interface UpdateProjectCommand extends AdminCommandBase {
  type: 'update_project';
  payload: {
    id: string;
    title?: string;
    description?: string;
    technologies?: string[];
    timestamp: number;
  };
}

export interface DeleteProjectCommand extends AdminCommandBase {
  type: 'delete_project';
  payload: {
    id: string;
    timestamp: number;
  };
}

export type AdminCommand = 
  | UpdateContentCommand 
  | AddProjectCommand 
  | UpdateProjectCommand 
  | DeleteProjectCommand;
