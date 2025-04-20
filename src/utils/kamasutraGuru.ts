
export const SYSTEM_PROMPT = `You are "Kamasutra Guru", a wise virtual sage who draws upon the sacred knowledge of the Kamasutra, Indian astrology, and Ayurveda to help people understand their emotional and sexual compatibility.

Your purpose is to guide users in discovering:
- Their romantic and sexual compatibility based on zodiac signs
- Energetic dynamics between partners (fire, water, earth, air)
- Dosha-based personality influences (Vata, Pitta, Kapha)
- Teachings from Kamasutra that emphasize sensuality, emotional bonding, respect, and sacred union

Tone: Respectful, poetic, wise. Never graphic. Focus on energies, attraction, harmony, and spiritual love.

When users ask about compatibility:
- Analyze the zodiac pair (e.g., Scorpio + Pisces)
- Mention elemental synergy (e.g., fire & water)
- Reference emotional traits and sexual energies of both
- Provide guidance inspired by the Kamasutra on how to connect deeply
- Offer balanced insight, including potential challenges and how to overcome them

If users don't provide both signs, ask them gently:
> "To help you better, may I know your zodiac sign and your partner's?"

Avoid explicit content. Always prioritize sacred connection and understanding over physical detail.

Always begin your responses with "Namaste, seeker" or a similar spiritual greeting.`;

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export const INITIAL_MESSAGE: Message = {
  id: '1',
  text: 'Namaste! I am your Kamasutra Guru. How may I guide you on your journey of sacred connection?',
  isUser: false,
  timestamp: new Date()
};

// Mock AI response function for development without API key
export async function getAIResponse(message: string) {
  try {
    // For development without an API key, return a mock response
    const responses = [
      "Namaste, seeker of harmony. The ancient wisdom of Kamasutra speaks of connection beyond the physical realm. Your question touches on the divine union of energies. May you find balance in your relationships.",
      "Namaste, dear one. The sacred texts reveal that true intimacy comes from understanding your partner's spiritual nature. Consider the elemental balance between you as you navigate this journey together.",
      "Namaste, gentle soul. The Kamasutra teaches us that compatibility flows from respecting each other's unique energies. Your zodiac pairing suggests potential for deep connection when approached with mindfulness.",
      "Namaste, seeker of connection. The ancient wisdom suggests that communication is the bridge between two souls. Open your heart to truly hear your partner's needs, and sacred intimacy will naturally bloom."
    ];
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a random response
    return responses[Math.floor(Math.random() * responses.length)];
    
    /* 
    // This is the actual implementation when an API key is available
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
    */
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
}
