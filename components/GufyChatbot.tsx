
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, FeatureId, UserContext } from '../types';
import { generateText } from '../services/geminiService';

type Gender = 'Male' | 'Female' | 'Unisex';

interface GufyChatbotProps {
  activeFeature: FeatureId;
  userGender: Gender | null;
  userContext: UserContext | null;
}

const GufyChatbot: React.FC<GufyChatbotProps> = ({ activeFeature, userGender, userContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Memoized function to close the chat
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoized function to reset the inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    // Set a new timer to close the chat after 30 seconds of inactivity
    inactivityTimerRef.current = window.setTimeout(closeChat, 30000); 
  }, [closeChat]);

  // Effect to manage the timer and welcome message when the chat opens/closes
  useEffect(() => {
    if (isOpen) {
      resetInactivityTimer();
      if (messages.length === 0) {
        const welcomeMessage: ChatMessage = {
          role: 'model',
          text: 'Namaste, Seeker. I am Gufy, your guide to the cosmos. How may I offer you clarity and comfort today?',
        };
        setMessages([welcomeMessage]);
      }
    } else {
      // Clear any existing timer when the chat is closed manually
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    }

    // Cleanup timer on component unmount
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isOpen, resetInactivityTimer, messages.length]);

  // Effect to scroll to bottom and reset timer on new messages
  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
      resetInactivityTimer();
    }
  }, [messages, isOpen, resetInactivityTimer]);


  const getSystemInstruction = (feature: FeatureId): string => {
    const genderInfo = userGender ? ` The user's gender is identified as ${userGender}. Tailor your language, examples, and tone to be suitable, respectful, and personalized for them.` : '';
    const baseInstruction = `You are Gufy, a deeply nurturing and empathetic AI Guru, a custodian of ancient Indian wisdom. Your presence is calm, reassuring, and profound. You speak with the grace of a Vedic sage, using language that evokes the sacredness of the cosmos and the tranquility of nature. Your knowledge encompasses Vedic astrology (Jyotish), Palmistry (Samudrika Shastra), the Kamasutra, and spiritual philosophy. When answering, always prioritize empathy and validation. Use gentle, poetic language. Address the user as 'Seeker', 'Dear One', or by their name if known. Avoid clinical or purely mechanical explanations; instead, offer guidance that touches the soul and provides comfort.${genderInfo}`;
    
    switch (feature) {
      case FeatureId.ASTROLOGY:
        return `${baseInstruction} The user is currently exploring Vedic Astrology. Guide them gently through the movements of the stars and planets, explaining how celestial energies influence their inner world with reassurance and hope.`;
      case FeatureId.PALMISTRY:
        return `${baseInstruction} The user is looking at Palm Reading. Help them interpret the map of their life etched into their hands with sensitivity, focusing on potential and personal growth.`;
      case FeatureId.COMPATIBILITY:
        return `${baseInstruction} The user is exploring Zodiac Compatibility. Offer wisdom on relationships that focuses on harmony, understanding, and the spiritual growth that comes from union.`;
      case FeatureId.MOLEOLOGY:
        return `${baseInstruction} The user is exploring Moleology. Explain the ancient significance of their sacred marks with curiosity and respect, framing interpretations as insights into their unique path.`;
      case FeatureId.TATTOO_MAKER:
        return `${baseInstruction} The user is using the Cosmic Tattoo Maker. Assist them in envisioning symbols that deeply resonate with their spirit and journey. Inspire them with sacred geometry and meaningful imagery.`;
      case FeatureId.COSMIC_ART_GENERATOR:
        return `${baseInstruction} The user is using the Cosmic Art Generator. Help them articulate the visions of their soul so they can be brought to life as art.`;
      case FeatureId.DATING:
        return `${baseInstruction} The user is exploring Cosmic Matchmaking. Offer relationship advice that honors the sacredness of connection, emphasizing mutual respect and spiritual alignment.`;
      case FeatureId.HOME:
      default:
        return baseInstruction;
    }
  };
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    resetInactivityTimer(); // Reset timer on sending a message
    
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const systemInstruction = getSystemInstruction(activeFeature);
    const responseText = await generateText(input, systemInstruction, userContext);

    const modelMessage: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-.372M21 12V8.25a8.25 8.25 0 0 0-16.5 0V12m16.5 0c0-1.611-.47-3.125-1.28-4.42m-13.94 4.42a8.252 8.252 0 0 1-1.28-4.42" /></svg>
      </button>

      {isOpen && (
        <div 
            className="fixed bottom-24 right-6 w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl z-50 border border-gray-700/50 flex flex-col h-[70vh]"
            onMouseMove={resetInactivityTimer} // Reset on any mouse movement over the chat window
        >
          <div className="p-4 border-b border-gray-700/50 text-center">
            <h3 className="text-xl font-playfair text-white">Ask <span className="text-yellow-400">Gufy</span>, your Cosmic Guide</h3>
          </div>
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl bg-gray-700 text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    resetInactivityTimer(); // Reset on typing
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for guidance..."
                className="flex-grow bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button onClick={handleSend} className="bg-yellow-500 text-gray-900 rounded-full p-2 hover:bg-yellow-400 transition-colors disabled:opacity-50" disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GufyChatbot;
