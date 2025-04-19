
import React from 'react';
import { BodyPart, Gender } from '@/lib/moleology-data';
import { Button } from '@/components/ui/button';
import { UserRound, UserCircle } from 'lucide-react';

interface MoleBodyMapProps {
  gender: Gender;
  bodyParts: BodyPart[];
  selectedParts: string[];
  onToggleBodyPart: (partId: string) => void;
  onChangeGender: (gender: Gender) => void;
}

const MoleBodyMap: React.FC<MoleBodyMapProps> = ({ 
  gender, 
  bodyParts, 
  selectedParts, 
  onToggleBodyPart,
  onChangeGender 
}) => {
  return (
    <div className="w-full bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg border border-cosmic-bright-purple/20 p-6 relative">
      <div className="flex justify-center mb-6 space-x-4">
        <Button
          variant={gender === 'male' ? 'default' : 'outline'}
          className={gender === 'male' ? 'bg-cosmic-bright-purple text-white' : 'text-gray-300'}
          onClick={() => onChangeGender('male')}
        >
          <UserRound className="mr-2 h-5 w-5" />
          Male
        </Button>
        <Button
          variant={gender === 'female' ? 'default' : 'outline'}
          className={gender === 'female' ? 'bg-cosmic-bright-purple text-white' : 'text-gray-300'}
          onClick={() => onChangeGender('female')}
        >
          <UserCircle className="mr-2 h-5 w-5" />
          Female
        </Button>
      </div>

      <div className="relative w-full max-w-md mx-auto h-[500px]">
        {/* Body silhouette background */}
        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-30" 
             style={{ backgroundImage: `url(/silhouette-${gender}.svg)` }}>
        </div>
        
        {/* Clickable body parts */}
        {bodyParts.map((part) => (
          <Button
            key={part.id}
            variant="ghost"
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 ${
              selectedParts.includes(part.id) 
                ? 'bg-cosmic-gold text-cosmic-midnight' 
                : 'bg-cosmic-bright-purple/30 text-white hover:bg-cosmic-bright-purple/70'
            }`}
            style={{
              left: `${part.imageCoordinates.x}%`,
              top: `${part.imageCoordinates.y}%`,
            }}
            onClick={() => onToggleBodyPart(part.id)}
          >
            {selectedParts.includes(part.id) ? '✓' : '+'}
          </Button>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-300">
          Click on the spots where you have moles to include them in your analysis
        </p>
      </div>
    </div>
  );
};

export default MoleBodyMap;
