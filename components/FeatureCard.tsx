import React from 'react';
import { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onClick }) => {
  const { Icon, title, description } = feature;
  return (
    <div 
      className="mystic-card flex flex-col items-start p-6 cursor-pointer group"
      onClick={onClick}
    >
      <div className="mb-4">
        <Icon className="w-8 h-8 text-yellow-400 transition-colors duration-300 group-hover:text-yellow-300" />
      </div>
      <h3 className="text-lg font-bold font-playfair text-white mb-2 text-left">{title}</h3>
      <p className="text-sm text-gray-400 text-left">{description}</p>
    </div>
  );
};

export default FeatureCard;