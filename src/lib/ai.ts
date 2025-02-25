import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function generateAIResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: import.meta.env.DEFAULT_MODEL || 'deepseek-chat',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('AI response generation error:', error);
    throw new Error('Failed to generate AI response. Please try again later.');
  }
}
