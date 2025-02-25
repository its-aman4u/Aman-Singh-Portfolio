import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import type { ContentUpdate, AdminCommand } from '../../../types/admin';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'your-secret-key';
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

// Verify JWT token
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// Update content file
async function updateContent(section: string, content: string) {
  const filePath = path.join(CONTENT_DIR, `${section}.md`);
  await fs.writeFile(filePath, content, 'utf-8');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || (decoded as any).role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const command: AdminCommand = await request.json();

    switch (command.type) {
      case 'update_content': {
        const update = command.payload as ContentUpdate;
        await updateContent(update.section, update.content);
        break;
      }
      case 'add_project':
      case 'update_project':
      case 'delete_project': {
        // Handle project management
        const projectsFile = path.join(CONTENT_DIR, 'projects.json');
        let projects = [];
        try {
          const content = await fs.readFile(projectsFile, 'utf-8');
          projects = JSON.parse(content);
        } catch {
          // File doesn't exist or is invalid
        }

        if (command.type === 'add_project') {
          projects.push({ ...command.payload, id: Date.now() });
        } else if (command.type === 'update_project') {
          const index = projects.findIndex((p: any) => p.id === command.payload.id);
          if (index !== -1) {
            projects[index] = { ...projects[index], ...command.payload };
          }
        } else if (command.type === 'delete_project') {
          projects = projects.filter((p: any) => p.id !== command.payload.id);
        }

        await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2), 'utf-8');
        break;
      }
      default:
        throw new Error('Invalid command type');
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
