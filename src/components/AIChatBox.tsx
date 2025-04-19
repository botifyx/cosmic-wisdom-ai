
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send } from "lucide-react";
import { Message, INITIAL_MESSAGE, getAIResponse } from '@/utils/aiGuru';

const AIChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await getAIResponse(input);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      toast({
        title: "New insight received",
        description: "The cosmic AI has shared wisdom with you.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "The cosmic energies are disturbed. Please try again later.",
        duration: 3000,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cosmic-card flex flex-col h-[500px] max-w-2xl mx-auto bg-cosmic-midnight/80">
      <div className="p-4 border-b border-border bg-gradient-to-r from-cosmic-deep-purple/20 to-cosmic-bright-purple/20">
        <div className="flex items-center">
          <MessageCircle className="text-cosmic-gold mr-2 h-5 w-5" />
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
              <p className="whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
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
            placeholder="Ask for cosmic wisdom..."
            className="cosmic-input flex-grow"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
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
