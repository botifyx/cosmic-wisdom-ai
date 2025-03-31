
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cosmic-midnight z-0">
        <div className="star-field absolute inset-0"></div>
        <div className="absolute inset-0 bg-cosmic-radial opacity-30"></div>
      </div>
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-cosmic-deep-purple/20 blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-cosmic-bright-purple/10 blur-3xl animate-float delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <span className="block text-glow">Unlock Ancient Wisdom</span>
          <span className="block text-cosmic-gold">With Modern AI</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          Discover the secrets of cosmic knowledge through our AI-powered insights into astrology, palmistry, and ancient Indian wisdom.
        </p>
        
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Input
                placeholder="Ask AI your cosmic question..."
                className="cosmic-input h-12 pl-12 pr-4 w-full text-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <Button className="cosmic-button h-12 px-8 text-lg">
              Seek Wisdom
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          <Link to="/chat">
            <Button variant="outline" className="border-cosmic-gold text-cosmic-gold hover:bg-cosmic-gold/10 h-12 px-6">
              Chat with AI Guru
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" className="border-cosmic-bright-purple text-cosmic-bright-purple hover:bg-cosmic-bright-purple/10 h-12 px-6">
              Explore Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
