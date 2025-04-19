
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ZodiacCompatibilityResultProps {
  result: CompatibilityResult;
}

const ZodiacCompatibilityResult: React.FC<ZodiacCompatibilityResultProps> = ({ result }) => {
  const { signA, signB, compatibility } = result;
  
  return (
    <div className="bg-cosmic-deep-purple/20 backdrop-blur-sm rounded-lg p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-cosmic-gold mb-6 text-center">
        Cosmic Compatibility Analysis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg p-6 border border-cosmic-bright-purple/20">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">{signA.emoji}</span>
            <h3 className="text-xl font-semibold text-cosmic-bright-purple">{signA.name} Personality</h3>
          </div>
          <p className="text-gray-300">{signA.personality}</p>
        </div>
        
        <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg p-6 border border-cosmic-bright-purple/20">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">{signB.emoji}</span>
            <h3 className="text-xl font-semibold text-cosmic-bright-purple">{signB.name} Personality</h3>
          </div>
          <p className="text-gray-300">{signB.personality}</p>
        </div>
      </div>
      
      <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg p-6 border border-cosmic-bright-purple/20 mb-8">
        <h3 className="text-xl font-semibold text-cosmic-bright-purple mb-4">Compatibility Overview</h3>
        <p className="text-gray-300 mb-6">{compatibility.overview}</p>
        
        <div className="flex justify-center items-center mb-6">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-200 mb-2">Love Potential Score</h4>
            <div className="flex items-center gap-4">
              <Progress value={compatibility.loveScore} className="w-64 h-3" />
              <span className="text-xl font-bold text-cosmic-gold">{compatibility.loveScore}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg p-6 border border-cosmic-bright-purple/20">
          <h3 className="text-xl font-semibold text-cosmic-gold mb-4">Relationship Strengths</h3>
          <ul className="space-y-2">
            {compatibility.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cosmic-gold mr-2">✦</span>
                <span className="text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg p-6 border border-cosmic-bright-purple/20">
          <h3 className="text-xl font-semibold text-cosmic-bright-purple mb-4">Relationship Challenges</h3>
          <ul className="space-y-2">
            {compatibility.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cosmic-bright-purple mr-2">✧</span>
                <span className="text-gray-300">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg p-6 border border-cosmic-bright-purple/20">
        <h3 className="text-xl font-semibold text-cosmic-gold mb-4">Cosmic Recommendation</h3>
        <p className="text-gray-300">{compatibility.recommendation}</p>
      </div>
    </div>
  );
};

export default ZodiacCompatibilityResult;
