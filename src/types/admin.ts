export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  token: string;
}

export interface ContentUpdate {
  section: 'about' | 'projects' | 'experience' | 'skills';
  content: string;
  timestamp: number;
}

export interface AdminCommand {
  type: 'update_content' | 'add_project' | 'update_project' | 'delete_project';
  payload: any;
}
