
import React from 'react';

interface PalmReadingProps {
  reading: {
    heartLine: string;
    headLine: string;
    lifeLine: string;
    fateLine: string;
  };
}

const PalmReadingResult: React.FC<PalmReadingProps> = ({ reading }) => {
  return (
    <div className="bg-cosmic-deep-purple/20 backdrop-blur-sm rounded-lg p-8">
      <h2 className="text-2xl font-bold text-cosmic-gold mb-6">Your Palm Reading Results</h2>
      
      <div className="grid gap-6">
        <div className="border-b border-cosmic-bright-purple/20 pb-4">
          <h3 className="text-lg font-semibold text-cosmic-bright-purple mb-2">💓 Heart Line</h3>
          <p className="text-gray-300">{reading.heartLine}</p>
        </div>
        
        <div className="border-b border-cosmic-bright-purple/20 pb-4">
          <h3 className="text-lg font-semibold text-cosmic-bright-purple mb-2">🧠 Head Line</h3>
          <p className="text-gray-300">{reading.headLine}</p>
        </div>
        
        <div className="border-b border-cosmic-bright-purple/20 pb-4">
          <h3 className="text-lg font-semibold text-cosmic-bright-purple mb-2">🌀 Life Line</h3>
          <p className="text-gray-300">{reading.lifeLine}</p>
        </div>
        
        <div className="pb-4">
          <h3 className="text-lg font-semibold text-cosmic-bright-purple mb-2">🧭 Fate Line</h3>
          <p className="text-gray-300">{reading.fateLine}</p>
        </div>
      </div>
    </div>
  );
};

export default PalmReadingResult;
