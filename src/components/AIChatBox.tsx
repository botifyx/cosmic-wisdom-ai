
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Send, Sparkles } from "lucide-react";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const AIChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! I am your AI Guru. How may I assist you on your spiritual journey today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(input),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      toast({
        title: "New insight received",
        description: "The cosmic AI has shared wisdom with you.",
        duration: 3000,
      });
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "The ancient texts speak of finding balance in all aspects of life. This applies to your current situation as well.",
      "According to Vedic wisdom, the path you seek is illuminated by self-reflection and mindful practice.",
      "Your cosmic alignment suggests a period of transformation ahead. Embrace the change with an open heart.",
      "The planetary positions indicate a favorable time for new beginnings. Trust in the universal flow.",
      "Ancient Indian scriptures remind us that patience is a virtue that bears the sweetest fruits.",
      "The stars reveal that your journey has purpose. Continue with faith and determination."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="cosmic-card flex flex-col h-[500px] max-w-2xl mx-auto bg-cosmic-midnight/80">
      <div className="p-4 border-b border-border bg-gradient-to-r from-cosmic-deep-purple/20 to-cosmic-bright-purple/20">
        <div className="flex items-center">
          <Sparkles className="text-cosmic-gold mr-2 h-5 w-5" />
          <h3 className="text-lg font-medium">Cosmic Guru AI</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-cosmic-bright-purple text-white rounded-tr-none'
                  : 'bg-cosmic-deep-purple/40 text-white rounded-tl-none'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-cosmic-deep-purple/40 text-white p-3 rounded-lg rounded-tl-none max-w-[80%]">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the cosmic wisdom..."
            className="cosmic-input flex-grow"
          />
          <Button 
            type="submit" 
            disabled={isTyping}
            className="cosmic-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AIChatBox;
