
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cosmic-midnight text-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 star-field"></div>
        <div className="absolute inset-0 bg-cosmic-radial opacity-30"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-9xl font-bold text-cosmic-gold mb-6 text-glow">404</h1>
          <p className="text-2xl text-gray-200 mb-8">
            The cosmic page you seek has moved to another dimension
          </p>
          <p className="text-lg text-gray-300 mb-12">
            Perhaps the stars weren't aligned for this journey. Let's redirect your cosmic path.
          </p>
          <Link to="/">
            <Button className="cosmic-button h-12 px-8 text-lg">
              Return to Home Planet
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
