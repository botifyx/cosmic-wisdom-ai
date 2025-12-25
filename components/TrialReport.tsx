import React, { useState, useEffect } from 'react';
import { Package } from './Packages';
import { getTrialVedicAstrologyAnalysis } from '../services/geminiService';
import { TrialAstrologyAnalysis, Feature, FeatureId, UserContext, UserState, Gender } from '../types';
import { features } from '../features';

interface TrialReportProps {
    pkg: Package;
    userName: string;
    userGender: Gender | null;
    onPurchase: () => void;
    userContext: UserContext | null;
    userState: UserState;
    onNavClick: (featureId: FeatureId) => void;
}

const TrialReport: React.FC<TrialReportProps> = ({ pkg, userName, userGender, onPurchase, userContext, userState, onNavClick }) => {
    const [trialAnalysis, setTrialAnalysis] = useState<TrialAstrologyAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrialData = async () => {
            setIsLoading(true);
            const analysis = await getTrialVedicAstrologyAnalysis(userName, userGender || 'Unisex', userContext);
            setTrialAnalysis(analysis);
            setIsLoading(false);
        };
        fetchTrialData();
    }, [userName, userGender, userContext]);

    const allFeaturesMap = new Map<string, Feature>(features.map(f => [f.id, f]));
    const includedFeatures = pkg.features.map(fid => allFeaturesMap.get(fid)).filter(Boolean) as Feature[];

    const previewFeatureId = pkg.features.includes(FeatureId.ASTROLOGY) ? FeatureId.ASTROLOGY : pkg.features[0];
    const isFullAccess = userState === 'full_access';

    return (
        <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-in-out]">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold font-playfair text-white">
                    {isFullAccess ? "Your Full" : "Your Trial"} <span className="logo-text-gradient">Cosmic Reading</span>
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    {isFullAccess 
                        ? `Congratulations, ${userName}! Here is your complete, unlocked report for the ${pkg.name} package.`
                        : `Here is a glimpse of the cosmic wisdom waiting for you in your ${pkg.name} package.`
                    }
                </p>
            </div>

            <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 space-y-6">
                {isLoading && (
                     <div className="flex flex-col justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                        <p className="mt-4 text-yellow-400">Preparing your insights...</p>
                    </div>
                )}

                {trialAnalysis && (
                    <div className="p-6 bg-gray-800/50 rounded-lg border border-yellow-400/30">
                        <h2 className="text-2xl font-playfair text-yellow-300">{trialAnalysis.greeting}</h2>
                        <p className="mt-2 text-gray-300">{trialAnalysis.summary}</p>
                    </div>
                )}
                
                <div>
                    <h3 className="text-xl font-semibold text-white text-center mb-4">Your Full Report Includes:</h3>
                     <div className="space-y-4">
                        {includedFeatures.map((feature, index) => {
                            const isUnlockedForTrial = feature.id === previewFeatureId;
                            const isLocked = !isFullAccess && !isUnlockedForTrial;

                            return (
                                <div key={feature.id} className={`p-4 border rounded-lg transition-all duration-300 ${!isLocked ? 'border-green-400/50 bg-green-900/20' : 'border-gray-700/50 locked-section'}`}>
                                    <div className={isLocked ? 'locked-content' : ''}>
                                        <div className="flex items-center gap-3">
                                            <feature.Icon className={`w-8 h-8 flex-shrink-0 ${!isLocked ? 'text-green-400' : 'text-gray-500'}`} />
                                            <div>
                                                <h4 className={`font-bold text-lg ${!isLocked ? 'text-white' : 'text-gray-400'}`}>{feature.title}</h4>
                                                <p className={`text-sm ${!isLocked ? 'text-gray-300' : 'text-gray-500'}`}>{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {isLocked && index === 1 && (
                                        <div className="locked-indicator">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-700/50 text-center">
                    {isFullAccess ? (
                        <>
                            <p className="text-lg text-green-300 mb-4">Your wisdom is unlocked. Explore other features or return home.</p>
                            <button
                                onClick={() => onNavClick(FeatureId.HOME)}
                                className="w-full max-w-md mx-auto bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Back to Home
                            </button>
                        </>
                    ) : (
                        <>
                             <p className="text-lg text-yellow-300 mb-4">Ready to unlock your full cosmic blueprint?</p>
                             <button
                                onClick={onPurchase}
                                className="w-full max-w-md mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-500/20"
                            >
                                Unlock Full Report for {pkg.price}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrialReport;
