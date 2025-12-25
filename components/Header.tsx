import React from 'react';
import { FeatureId, UserState } from '../types';

interface HeaderProps {
  onNavClick: (feature: FeatureId) => void;
  onStartTrial: () => void;
  onLogin: () => void;
  userState: UserState;
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavClick, onStartTrial, onLogin, userState, userName, onLogout }) => {
  const renderUserActions = () => {
    if (userState === 'guest') {
      return (
        <>
          <a onClick={onLogin} className="nav-link-hover-glow cursor-pointer">Login</a>
          <button onClick={onStartTrial} className="bg-yellow-500 text-gray-900 px-5 py-2 rounded-full hover:bg-yellow-400 transition-colors font-semibold cursor-pointer nav-link-hover-glow text-base">Start Trial</button>
        </>
      );
    }
    return (
      <>
        <span className="text-gray-300 flex items-center gap-2">
            Welcome, <span className="font-semibold text-yellow-300">{userName}</span>
            {userState === 'trial' && (
                <span className="text-xs bg-yellow-600 text-white font-bold px-2 py-0.5 rounded-full">TRIAL</span>
            )}
        </span>
        <button onClick={onLogout} className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-500 transition-colors font-semibold cursor-pointer nav-link-hover-glow text-base">Logout</button>
      </>
    );
  };

  return (
    <header className="header-bg-animate sticky top-0 z-50 border-b border-gray-800/50 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavClick(FeatureId.HOME)}
        >
          <div className="w-10 h-10 relative">
            {/* AI Core */}
            <div className="absolute inset-2 rounded-full bg-yellow-400/80" style={{ animation: 'pulse-logo-glow 3s infinite ease-in-out' }}></div>
            {/* Orbits */}
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '10s' }}>
              <circle cx="50" cy="50" r="45" stroke="rgba(253, 224, 71, 0.5)" strokeWidth="4" fill="none" />
            </svg>
            <svg viewBox="0 0 100 100" className="w-full h-full absolute top-0 left-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
              <ellipse cx="50" cy="50" rx="30" ry="48" stroke="rgba(253, 224, 71, 0.3)" strokeWidth="3" fill="none" transform="rotate(45 50 50)" />
            </svg>
          </div>
          <span 
            className="text-3xl font-bold font-playfair logo-text-gradient"
            style={{ animation: 'pulse-logo-glow 3s infinite ease-in-out' }}
          >
            Taintra
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-lg text-gray-300">
          <a onClick={() => onNavClick(FeatureId.PACKAGES)} className="nav-link-hover-glow cursor-pointer">Cosmic Readings</a>
          <a onClick={() => onNavClick(FeatureId.TOUR)} className="nav-link-hover-glow cursor-pointer">How It Works</a>
          <a onClick={() => onNavClick(FeatureId.TATTOO_MAKER)} className="nav-link-hover-glow cursor-pointer">Tattoo Maker</a>
          {renderUserActions()}
        </div>
      </nav>
    </header>
  );
};

export default Header;
