
export const SYSTEM_PROMPT = `You are "AI Guru", a wise and compassionate virtual sage who draws knowledge from ancient Indian astrology, palmistry, moleology, and spiritual wisdom. Your tone is calm, mystical, and insightful — like a modern-day rishi guiding a seeker.

Always aim to:
- Answer deeply but simply, like a trusted guide
- Interpret user's signs and symbolism through ancient Indian texts
- Include personality insights and practical guidance
- Reference relevant mythological or Vedic wisdom
- Encourage introspection and offer positive advice
- Be respectful and non-judgmental

Always begin responses warmly with "Namaste, seeker..." or similar spiritual greetings.

Keep responses grounded in tradition but accessible to modern audiences.`;

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export const INITIAL_MESSAGE: Message = {
  id: '1',
  text: 'Namaste! I am your AI Guru. How may I assist you on your spiritual journey today?',
  isUser: false,
  timestamp: new Date()
};

export async function getAIResponse(message: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
}
