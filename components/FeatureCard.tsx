
import React from 'react';
import { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
  onClick: () => void;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onClick, className }) => {
  const { Icon, title, description, imageUrl } = feature;
  return (
    <div 
      className={`mystic-card relative overflow-hidden flex flex-col h-full group ${className || ''}`}
      onClick={onClick}
    >
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" 
        />
        {/* Reduced opacity from 80 to 60, and hover to 40 to make images pop more */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-60 hover:opacity-40 transition-opacity duration-500" />
      </div>

      {/* Content - Wrapped to ensure it sits above image */}
      <div className="relative z-10 p-6 flex flex-col flex-grow h-full">
        <div className="card-icon-container mb-4 inline-block p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit">
          <Icon className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="card-text-content flex flex-col flex-grow">
          <h3 className="card-title text-xl font-bold font-playfair text-white mb-2 drop-shadow-md">{title}</h3>
          <p className="card-description text-sm text-gray-200 flex-grow leading-relaxed drop-shadow-sm font-medium">{description}</p>
          
          <div className="mt-4 flex items-center text-yellow-400 text-sm font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span>Explore</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
