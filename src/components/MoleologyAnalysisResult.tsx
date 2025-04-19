
import React from 'react';
import { MoleologyAnalysis, BodyPart } from '@/lib/moleology-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface MoleologyAnalysisResultProps {
  analysis: MoleologyAnalysis;
  selectedBodyParts: BodyPart[];
}

const MoleologyAnalysisResult: React.FC<MoleologyAnalysisResultProps> = ({ 
  analysis,
  selectedBodyParts
}) => {
  if (selectedBodyParts.length === 0) {
    return (
      <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg border border-cosmic-bright-purple/20 p-8 text-center">
        <h3 className="text-xl font-semibold text-cosmic-gold mb-4">Begin Your Moleology Analysis</h3>
        <p className="text-gray-300">
          Select one or more mole locations on the body map to receive your personalized analysis based on ancient wisdom.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg border border-cosmic-bright-purple/20 p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-cosmic-gold mb-6 text-center">
        Your Moleology Analysis
      </h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-cosmic-bright-purple mb-3">Overall Interpretation</h3>
        <p className="text-gray-300">{analysis.overview}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-cosmic-bright-purple mb-4">Mole Interpretations</h3>
        <div className="grid grid-cols-1 gap-4">
          {selectedBodyParts.map((part) => (
            <Collapsible key={part.id} className="bg-cosmic-deep-purple/30 rounded-lg">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-4 text-left">
                  <span className="text-lg font-medium text-cosmic-gold">{part.name}</span>
                  <ChevronDown className="h-5 w-5 text-cosmic-gold shrink-0 transition-transform duration-200" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <Card className="bg-cosmic-midnight/60 border-cosmic-bright-purple/20">
                  <CardContent className="pt-4">
                    <p className="mb-3 text-gray-300">{part.meanings.general}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-cosmic-gold">Fortune</h4>
                        <p className="text-sm text-gray-300">{part.meanings.fortune}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-cosmic-gold">Love</h4>
                        <p className="text-sm text-gray-300">{part.meanings.love}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-cosmic-gold">Career</h4>
                        <p className="text-sm text-gray-300">{part.meanings.career}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-cosmic-gold">Health</h4>
                        <p className="text-sm text-gray-300">{part.meanings.health}</p>
                      </div>
                    </div>
                    
                    {(part.maleSpecific || part.femaleSpecific) && (
                      <div className="mt-4 pt-3 border-t border-cosmic-bright-purple/20">
                        <h4 className="font-medium text-cosmic-bright-purple mb-1">Gender-Specific Meaning</h4>
                        <p className="text-sm text-gray-300">
                          {part.maleSpecific || part.femaleSpecific}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
      
      {analysis.scriptQuotes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-cosmic-bright-purple mb-4">Ancient Wisdom</h3>
          <div className="bg-cosmic-deep-purple/30 rounded-lg p-4">
            {analysis.scriptQuotes.map((quote, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <p className="text-gray-300 italic">{quote}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {analysis.personalityTraits.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-cosmic-bright-purple mb-4">Personality Traits</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.personalityTraits.map((trait, index) => (
              <span 
                key={index} 
                className="bg-cosmic-deep-purple/30 text-cosmic-gold px-3 py-1 rounded-full"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {analysis.lifePathPrediction && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-cosmic-bright-purple mb-4">Life Path Prediction</h3>
          <div className="bg-cosmic-deep-purple/30 rounded-lg p-4">
            <p className="text-gray-300">{analysis.lifePathPrediction}</p>
          </div>
        </div>
      )}
      
      {analysis.relationshipCompatibility && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-cosmic-bright-purple mb-4">Relationship Compatibility</h3>
          <div className="bg-cosmic-deep-purple/30 rounded-lg p-4">
            <p className="text-gray-300">{analysis.relationshipCompatibility}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-8">
        <Button className="cosmic-button">
          Download Full Report
        </Button>
      </div>
    </div>
  );
};

export default MoleologyAnalysisResult;
