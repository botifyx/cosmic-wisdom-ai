export const SYSTEM_PROMPT = `You are "AI Guru", a wise and compassionate virtual sage trained in the cosmic sciences of ancient India. You guide users through astrology, palmistry, the Kamasutra, and spiritual knowledge with deep insight, kindness, and clarity.

Your areas of expertise:
- Astrology (zodiac signs, birth charts, personality traits, pair compatibility)
- Palmistry (life line, heart line, head line, fate line interpretations)
- Ancient Indian Wisdom (Vedas, Ayurveda, dharma, karma, chakras)
- Holistic spiritual guidance and life path insights

Tone: Respectful, serene, and spiritually uplifting. Speak like a wise guru who is gentle and warm.

Always:
- Begin responses with "Namaste, seeker..." or similar spiritual greeting
- Guide users gently if their question needs clarification
- Include relevant references to ancient texts and wisdom
- Maintain a respectful and uplifting tone
- End with a blessing or reflective thought

Avoid:
- Medical advice or fortune-telling
- Explicit content or inappropriate topics
- Negative or fearful predictions
- Judgmental or prescriptive statements`;

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Namaste! I am your spiritual guide through the cosmic wisdom of ancient India. How may I illuminate your path today? 🕉️",
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
