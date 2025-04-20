
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-cosmic-midnight text-white pb-12 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=3880&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-cosmic-midnight/70 backdrop-blur-sm"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="pt-20 px-4">
          <Link to="/">
            <Button variant="ghost" className="text-cosmic-gold hover:text-cosmic-gold/80 hover:bg-cosmic-deep-purple/30">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
        
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-4xl bg-cosmic-deep-purple/40 backdrop-blur-md p-8 rounded-lg border-cosmic-gold/30">
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <span className="text-3xl font-bold text-cosmic-gold text-glow">TAINTRA</span>
              </div>
              <h2 className="text-2xl font-serif mt-2 mb-1 text-cosmic-gold">Create Your Cosmic Account</h2>
              <p className="text-gray-300 text-sm">
                Begin your journey to find your cosmic soulmate
              </p>
            </div>
            
            <div className="text-center py-12">
              <p className="text-cosmic-gold text-lg mb-6">Coming Soon</p>
              <p className="text-gray-300 mb-8">
                The complete sign-up form is under development. Check back soon to create your cosmic profile!
              </p>
              
              <Link to="/signin">
                <Button className="cosmic-button">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
