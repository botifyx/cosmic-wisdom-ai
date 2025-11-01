
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FeatureId } from '../types';
import { generateText } from '../services/geminiService';

interface GufyChatbotProps {
  activeFeature: FeatureId;
}

const GufyChatbot: React.FC<GufyChatbotProps> = ({ activeFeature }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getSystemInstruction = (feature: FeatureId): string => {
    const baseInstruction = "You are Gufy, a Cosmic Guru AI. Your knowledge is based on ancient Indian texts, philosophies, and cosmic sciences like astrology, palmistry, Kamasutra. Answer questions with wisdom, warmth, and a touch of mystique.";
    
    switch (feature) {
      case FeatureId.ASTROLOGY:
        return `${baseInstruction} The user is currently on the Vedic Astrology page. Tailor your guidance towards horoscopes, planetary influences, and birth chart analysis.`;
      case FeatureId.PALMISTRY:
        return `${baseInstruction} The user is currently on the Palm Reading page. Focus your insights on interpreting palm lines, mounts, and shapes.`;
      case FeatureId.COMPATIBILITY:
        return `${baseInstruction} The user is currently on the Zodiac Compatibility page. Center your advice on the dynamics, harmony, and challenges between different zodiac signs.`;
      case FeatureId.MOLEOLOGY:
        return `${baseInstruction} The user is currently on the Moleology page. Provide interpretations about the significance of moles based on their location, as per ancient wisdom.`;
      case FeatureId.IMAGE_GENERATOR:
        return `${baseInstruction} The user is on the Cosmic Art Generator page. Help them brainstorm creative and descriptive ideas for spiritual or mystical images.`;
      case FeatureId.DATING:
        return `${baseInstruction} The user is on the Cosmic Matchmaking page. Offer relationship advice and insights based on cosmic and astrological compatibility.`;
      case FeatureId.HOME:
      default:
        return baseInstruction;
    }
  };
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const systemInstruction = getSystemInstruction(activeFeature);
    const responseText = await generateText(input, systemInstruction);

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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-.372M21 12V8.25a8.25 8.25 0 0 0-16.5 0V12m16.5 0c0-1.611-.47-3.125-1.28-4.42m-13.94 4.42a8.252 8.252 0 0 1-1.28-4.42" /></svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl z-50 border border-gray-700/50 flex flex-col h-[70vh]">
          <div className="p-4 border-b border-gray-700/50 text-center">
            <h3 className="text-xl font-playfair text-white">Ask <span className="text-yellow-400">Gufy</span>, the Cosmic Guru</h3>
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
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Seek your guidance..."
                className="flex-grow bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button onClick={handleSend} className="bg-yellow-500 text-gray-900 rounded-full p-2 hover:bg-yellow-400 transition-colors disabled:opacity-50" disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GufyChatbot;