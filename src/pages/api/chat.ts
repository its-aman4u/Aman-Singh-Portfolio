import type { APIRoute } from 'astro';
import type { Message, ChatSettings, AdminCommand } from '../../types/chat';
import { verifyToken } from '../../utils/auth';
import axios from 'axios';
import { OpenAI } from 'openai';
import type { ChatCompletion } from 'openai/resources/chat';
import type { AxiosResponse } from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Get environment variables
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const DEEPSEEK_API_KEY = import.meta.env.DEEPSEEK_API_KEY;

// Initialize OpenAI with proper type checking
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Token cost per 1K tokens for different models
const TOKEN_COSTS = {
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
  'deepseek': { input: 0, output: 0 } // Deepseek is currently free
} as const;

const countTokens = (text: string): number => {
  // This is a rough estimation, for precise count use tiktoken
  return Math.ceil(text.length / 4);
};

const calculateCost = (model: string, inputTokens: number, outputTokens: number): number => {
  const costs = TOKEN_COSTS[model as keyof typeof TOKEN_COSTS];
  if (!costs) return 0;
  return (inputTokens * costs.input + outputTokens * costs.output) / 1000;
};

const systemPrompt = `You are an AI assistant for Aman Singh's portfolio website. You are knowledgeable about:
1. Data Analytics and Visualization
2. HR Analytics and People Management
3. Python, R, and SQL for data analysis
4. Machine Learning and Statistical Analysis
5. Business Intelligence tools (Power BI, Tableau)
6. Project Management and Team Leadership

Please provide detailed, accurate responses about Aman's expertise and experience in these areas.`;

interface DeepseekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const parseAdminCommand = (message: string): AdminCommand | null => {
  const command = message.slice(1).trim().toLowerCase(); // Remove the leading '/'
  const timestamp = Date.now();
  
  if (command.startsWith('update about')) {
    return {
      type: 'update_content',
      timestamp,
      payload: {
        section: 'about',
        content: message.slice(13).trim(),
        timestamp
      }
    };
  }
  
  if (command.startsWith('add project')) {
    try {
      const projectData = JSON.parse(message.slice(12).trim());
      return {
        type: 'add_project',
        timestamp,
        payload: {
          ...projectData,
          timestamp
        }
      };
    } catch {
      return null;
    }
  }
  
  if (command.startsWith('update project')) {
    try {
      const projectData = JSON.parse(message.slice(14).trim());
      return {
        type: 'update_project',
        timestamp,
        payload: {
          ...projectData,
          timestamp
        }
      };
    } catch {
      return null;
    }
  }
  
  if (command.startsWith('delete project')) {
    const projectId = message.slice(14).trim();
    return {
      type: 'delete_project',
      timestamp,
      payload: {
        id: projectId
      }
    };
  }
  
  return null;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, context, settings } = await request.json();
    const { model, temperature, maxTokens } = settings as ChatSettings;

    // Check if this is an admin command
    const authHeader = request.headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer ') && message.startsWith('/')) {
      const token = authHeader.slice(7);
      const isValidToken = verifyToken(token, import.meta.env.JWT_SECRET || '');

      if (!isValidToken) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const adminCommand = parseAdminCommand(message);
      if (adminCommand) {
        return new Response(
          JSON.stringify({ adminCommand }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }

    // Check if API keys are available
    if (!OPENAI_API_KEY && model !== 'deepseek') {
      throw new Error('OpenAI API key not found');
    }
    if (!DEEPSEEK_API_KEY && model === 'deepseek') {
      throw new Error('Deepseek API key not found');
    }

    // Calculate input tokens
    const contextText = context.map((msg: Message) => msg.content).join(' ');
    const inputTokens = countTokens(contextText + message + systemPrompt);

    let response: ChatCompletion | AxiosResponse<DeepseekResponse>;
    let outputTokens: number;
    let cost: number;
    let responseContent: string;

    if (model === 'deepseek') {
      response = await axios.post<DeepseekResponse>(
        DEEPSEEK_API_URL,
        {
          messages: [
            { role: "system", content: systemPrompt },
            ...context.map((msg: Message) => ({
              role: msg.role,
              content: msg.content
            })),
            { role: "user", content: message }
          ],
          model: "deepseek-chat",
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      responseContent = (response as AxiosResponse<DeepseekResponse>).data.choices[0].message.content;
      outputTokens = countTokens(responseContent);
      cost = 0; // Deepseek is currently free
    } else {
      response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...context.map((msg: Message) => ({
            role: msg.role,
            content: msg.content
          })),
          { role: "user", content: message }
        ],
        model,
        temperature,
        max_tokens: maxTokens,
      });

      responseContent = response.choices[0].message?.content || 'No response generated';
      outputTokens = countTokens(responseContent);
      cost = calculateCost(model, inputTokens, outputTokens);
    }

    return new Response(
      JSON.stringify({
        message: responseContent,
        tokenCount: inputTokens + outputTokens,
        cost
      }),
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
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process request'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
