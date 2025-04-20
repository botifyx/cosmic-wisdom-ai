
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
                TAINTRA
              </span>
              <span className="ml-2 text-xs text-cosmic-bright-purple hidden sm:inline-block">
                The Future of Ancient Wisdom
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink to="/" isActive={location.pathname === "/"}>Home</NavLink>
              <NavLink to="/astrology" isActive={location.pathname === "/astrology"}>Astrology AI</NavLink>
              <NavLink to="/palmistry" isActive={location.pathname === "/palmistry"}>Palmistry</NavLink>
              <NavLink to="/zodiac" isActive={location.pathname === "/zodiac"}>Zodiac</NavLink>
              <NavLink to="/moleology" isActive={location.pathname === "/moleology"}>Moleology</NavLink>
              <NavLink to="/ancient-wisdom" isActive={location.pathname === "/ancient-wisdom"}>Ancient Wisdom</NavLink>
              <NavLink to="/chat" isActive={location.pathname === "/chat"}>Guru Chat</NavLink>
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
            <MobileNavLink to="/" onClick={toggleMenu} isActive={location.pathname === "/"}>Home</MobileNavLink>
            <MobileNavLink to="/astrology" onClick={toggleMenu} isActive={location.pathname === "/astrology"}>Astrology AI</MobileNavLink>
            <MobileNavLink to="/palmistry" onClick={toggleMenu} isActive={location.pathname === "/palmistry"}>Palmistry</MobileNavLink>
            <MobileNavLink to="/zodiac" onClick={toggleMenu} isActive={location.pathname === "/zodiac"}>Zodiac</MobileNavLink>
            <MobileNavLink to="/moleology" onClick={toggleMenu} isActive={location.pathname === "/moleology"}>Moleology</MobileNavLink>
            <MobileNavLink to="/ancient-wisdom" onClick={toggleMenu} isActive={location.pathname === "/ancient-wisdom"}>Ancient Wisdom</MobileNavLink>
            <MobileNavLink to="/chat" onClick={toggleMenu} isActive={location.pathname === "/chat"}>Guru Chat</MobileNavLink>
            <div className="pt-2">
              <Button className="w-full cosmic-button">Sign In</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, isActive }: { to: string; children: React.ReactNode; isActive: boolean }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'text-cosmic-gold bg-cosmic-deep-purple/30' 
        : 'text-gray-300 hover:text-cosmic-gold'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ 
  to, 
  children, 
  onClick,
  isActive 
}: { 
  to: string; 
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      isActive 
        ? 'text-cosmic-gold bg-cosmic-deep-purple/30' 
        : 'text-gray-300 hover:text-cosmic-gold'
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
