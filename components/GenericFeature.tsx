
import React, { useState, useCallback } from 'react';
import { generateText } from '../services/geminiService';

interface GenericFeatureProps {
  title: string;
  description: string;
  promptPrefix: string;
  placeholder: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const GenericFeature: React.FC<GenericFeatureProps> = ({ title, description, promptPrefix, placeholder, Icon }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter your details to get an analysis.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');

    const fullPrompt = `${promptPrefix}${input}`;
    const response = await generateText(fullPrompt);
    
    setResult(response);
    setIsLoading(false);
  }, [input, promptPrefix]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50">
      <div className="text-center mb-8">
        <Icon className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-4xl font-bold font-playfair text-white">{title}</h2>
        <p className="mt-2 text-gray-400">{description}</p>
      </div>

      <div className="space-y-4">
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isLoading ? 'Analyzing...' : 'Generate Analysis'}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
      
      {(isLoading || result) && (
        <div className="mt-8 bg-gray-800/50 p-6 rounded-lg min-h-[12rem]">
          <h3 className="text-2xl font-playfair text-yellow-400 mb-4">Your Cosmic Analysis:</h3>
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          )}
          {result && <p className="text-gray-300 whitespace-pre-wrap">{result}</p>}
        </div>
      )}
    </div>
  );
};

export default GenericFeature;
