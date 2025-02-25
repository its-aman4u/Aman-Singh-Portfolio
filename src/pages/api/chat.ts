import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { OpenAI } from 'openai';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Get environment variables
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const DEEPSEEK_API_KEY = import.meta.env.DEEPSEEK_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || '', // Provide empty string as fallback
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatSettings {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface RateLimitEntry {
  ip: string;
  count: number;
  timestamp: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, context = [], settings = {} } = await request.json();
    const { model = 'deepseek', temperature = 0.7, maxTokens = 1000 } = settings as ChatSettings;

    // Validate input
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { data: rateLimit } = await supabase
      .from('rate_limits')
      .select('count')
      .eq('ip', clientIP)
      .gte('timestamp', new Date(Date.now() - 60000).toISOString())
      .single();

    const currentCount = rateLimit?.count ?? 0;
    if (currentCount >= 5) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429 }
      );
    }

    // Update rate limit
    await supabase.from('rate_limits').upsert({
      ip: clientIP,
      count: currentCount + 1,
      timestamp: Date.now()
    } as RateLimitEntry);

    // Check if API keys are available
    if (!OPENAI_API_KEY && model !== 'deepseek') {
      throw new Error('OpenAI API key not found');
    }
    if (!DEEPSEEK_API_KEY && model === 'deepseek') {
      throw new Error('Deepseek API key not found');
    }

    // Prepare messages for AI
    const allMessages: ChatMessage[] = [
      ...context.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    let responseContent: string = '';
    let cost = 0;
    let inputTokens = 0;
    let outputTokens = 0;

    if (model === 'deepseek') {
      // Call Deepseek API with retries
      let deepseekResponse;
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          deepseekResponse = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: allMessages,
              temperature,
              max_tokens: maxTokens
            })
          });

          if (deepseekResponse.ok) {
            const data = await deepseekResponse.json();
            if (data.choices?.[0]?.message?.content) {
              responseContent = data.choices[0].message.content;
              break;
            }
          }
          
          retries++;
          if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          }
        } catch (error) {
          console.error(`Attempt ${retries + 1} failed:`, error);
          retries++;
          if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          }
        }
      }

      if (!responseContent) {
        throw new Error('Failed to get response from Deepseek API');
      }

    } else {
      // Use OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: allMessages,
        temperature,
        max_tokens: maxTokens
      });

      responseContent = response.choices[0]?.message?.content ?? 'No response generated';
    }

    return new Response(
      JSON.stringify({
        message: responseContent,
        cost,
        inputTokens,
        outputTokens
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500 }
    );
  }
};
