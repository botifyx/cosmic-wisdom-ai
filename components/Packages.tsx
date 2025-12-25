import React from 'react';
import { FeatureId, UserState } from '../types';

interface PackagesProps {
    onSelectPackage: (pkg: Package) => void;
    userState: UserState;
}

export const packages = [
    {
        name: "Seeker's Path",
        price: "$4.99",
        numServices: 3,
        value: 11,
        description: "Begin your journey with a foundational reading of your core identity.",
        services: ["Vedic Astrology", "Palm Reading", "Moleology"],
        features: [FeatureId.ASTROLOGY, FeatureId.PALMISTRY, FeatureId.MOLEOLOGY],
        color: "yellow",
        glowColor: "rgba(234, 179, 8, 0.2)",
    },
    {
        name: "Oracle's Insight",
        price: "$9.99",
        numServices: 5,
        value: 17,
        description: "Deepen your understanding by exploring your identity, path, and relationships.",
        services: ["Vedic Astrology", "Palm Reading", "Tarot Reading", "Mantra Generator", "Zodiac Compatibility"],
        features: [FeatureId.ASTROLOGY, FeatureId.PALMISTRY, FeatureId.TAROT, FeatureId.MANTRA_GENERATOR, FeatureId.COMPATIBILITY],
        color: "purple",
        glowColor: "rgba(168, 85, 247, 0.2)",
    },
    {
        name: "Guru's Wisdom",
        price: "$14.99",
        numServices: 9,
        value: 30,
        description: "A comprehensive look into multiple facets of your being for profound wisdom.",
        services: ["Astrology", "Palmistry", "Tarot", "Mantra", "Compatibility", "Face Reading", "Handwriting", "Sacred Union", "Moleology"],
        features: [FeatureId.ASTROLOGY, FeatureId.PALMISTRY, FeatureId.TAROT, FeatureId.MANTRA_GENERATOR, FeatureId.COMPATIBILITY, FeatureId.FACE_READING, FeatureId.HANDWRITING_ANALYSIS, FeatureId.SACRED_UNION, FeatureId.MOLEOLOGY],
        color: "pink",
        glowColor: "rgba(236, 72, 153, 0.2)",
    },
    {
        name: "Cosmic Blueprint",
        price: "$19.99",
        numServices: 12,
        value: 41,
        description: "The ultimate analysis. A complete, holistic view of your cosmic self, including all creative tools.",
        services: ["All 9 from Guru's Wisdom", "Cosmic Matchmaking", "Cosmic Tattoo Maker", "Cosmic Art Generator"],
        features: [FeatureId.ASTROLOGY, FeatureId.PALMISTRY, FeatureId.TAROT, FeatureId.MANTRA_GENERATOR, FeatureId.COMPATIBILITY, FeatureId.FACE_READING, FeatureId.HANDWRITING_ANALYSIS, FeatureId.SACRED_UNION, FeatureId.MOLEOLOGY, FeatureId.DATING, FeatureId.TATTOO_MAKER, FeatureId.COSMIC_ART_GENERATOR],
        color: "blue",
        glowColor: "rgba(59, 130, 246, 0.2)",
    }
];

export type Package = typeof packages[0];

const Packages: React.FC<PackagesProps> = ({ onSelectPackage, userState }) => {

    const getButtonText = (state: UserState) => {
        switch (state) {
            case 'trial':
                return 'Get My Trial Reading';
            case 'full_access':
                return 'View My Reading';
            case 'guest':
            default:
                return 'Get My Reading';
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-in-out]">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold font-playfair text-white">
                        Your Personalized <span className="logo-text-gradient">Cosmic Reading</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                        Choose a curated package to receive a detailed, synthesized report from our AI Guru. We interconnect the wisdom from multiple ancient arts to create a holistic analysis tailored specifically to you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {packages.map((pkg) => (
                        <div 
                            key={pkg.name}
                            className="mystic-card flex flex-col p-6 text-center border-t-4"
                            style={{ borderColor: `var(--color-${pkg.color})`, '--color-yellow': '#FBBF24', '--color-purple': '#A78BFA', '--color-pink': '#EC4899', '--color-blue': '#3B82F6' } as React.CSSProperties}
                        >
                            <h2 className={`text-3xl font-playfair font-bold text-${pkg.color}-400`}>{pkg.name}</h2>
                            <p className="text-5xl font-bold text-white my-4">{pkg.price}</p>
                            <p className="text-sm text-gray-500 mb-4">(Total value up to ${pkg.value})</p>
                            
                            <p className="text-gray-400 flex-grow">{pkg.description}</p>

                            <div className="my-6 text-left">
                                <h3 className="font-semibold text-white mb-2 text-center">{pkg.numServices} Services Included:</h3>
                                <ul className="space-y-1 text-sm text-gray-400">
                                    {pkg.services.map(service => (
                                        <li key={service} className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-${pkg.color}-400`} fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span>{service}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <button 
                                onClick={() => onSelectPackage(pkg)}
                                className={`mt-auto w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-${pkg.color}-500 text-gray-900 hover:bg-${pkg.color}-400 hover:scale-105 hover:shadow-lg`}
                                style={{ boxShadow: `0 0 20px ${pkg.glowColor}` }}
                            >
                                {getButtonText(userState)}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p>After selecting a package, you will be prompted to provide all necessary information (like birth details or photos) for our AI Guru to begin the comprehensive analysis.</p>
                    <p>Your final, collated report will be delivered as a beautiful, downloadable, and printable document.</p>
                </div>
            </div>
        </>
    );
};

export default Packages;
