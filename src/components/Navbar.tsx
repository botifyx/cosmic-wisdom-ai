
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-cosmic-midnight/95 backdrop-blur-sm fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-cosmic-gold text-glow">
                Cosmic<span className="text-cosmic-bright-purple">Wisdom</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/astrology">Astrology AI</NavLink>
              <NavLink to="/palmistry">Palmistry</NavLink>
              <NavLink to="/zodiac">Zodiac</NavLink>
              <NavLink to="/ancient-wisdom">Ancient Wisdom</NavLink>
              <Button className="cosmic-button ml-4">Sign In</Button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-cosmic-midnight/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
            <MobileNavLink to="/astrology" onClick={toggleMenu}>Astrology AI</MobileNavLink>
            <MobileNavLink to="/palmistry" onClick={toggleMenu}>Palmistry</MobileNavLink>
            <MobileNavLink to="/zodiac" onClick={toggleMenu}>Zodiac</MobileNavLink>
            <MobileNavLink to="/ancient-wisdom" onClick={toggleMenu}>Ancient Wisdom</MobileNavLink>
            <div className="pt-2">
              <Button className="w-full cosmic-button">Sign In</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-cosmic-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ 
  to, 
  children, 
  onClick 
}: { 
  to: string; 
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-cosmic-gold block px-3 py-2 rounded-md text-base font-medium"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
