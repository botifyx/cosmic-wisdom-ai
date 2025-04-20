
import React from 'react';
import { Link } from 'react-router-dom';
import AskGuruSection from '@/components/AskGuruSection';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Chat = () => {
  return (
    <div className="min-h-screen bg-cosmic-midnight text-white pb-12">
      <div className="container mx-auto">
        <div className="pt-20 px-4">
          <Link to="/">
            <Button variant="ghost" className="text-cosmic-gold hover:text-cosmic-gold/80 hover:bg-cosmic-deep-purple/30">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
        
        <AskGuruSection />
      </div>
    </div>
  );
};

export default Chat;
