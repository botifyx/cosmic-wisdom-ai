
import React, { useState, useRef } from 'react';
import { FeatureId, PackageInputs, Gender } from '../types';
import { Package } from './Packages';

interface PackageWizardProps {
    pkg: Package;
    userGender: Gender | null;
    userName: string;
    onComplete: (inputs: PackageInputs) => void;
    onCancel: () => void;
}

const PackageWizard: React.FC<PackageWizardProps> = ({ pkg, userGender, userName, onComplete, onCancel }) => {
    const [step, setStep] = useState(0);
    const [inputs, setInputs] = useState<PackageInputs>({
        name: userName,
        gender: userGender || 'Unisex',
    });

    // Determine necessary steps based on package features
    const needsAstrology = pkg.features.some(f => [FeatureId.ASTROLOGY, FeatureId.COMPATIBILITY, FeatureId.SACRED_UNION, FeatureId.DATING].includes(f));
    const needsPalm = pkg.features.includes(FeatureId.PALMISTRY);
    const needsFace = pkg.features.includes(FeatureId.FACE_READING);
    const needsHandwriting = pkg.features.includes(FeatureId.HANDWRITING_ANALYSIS);
    const needsMantra = pkg.features.includes(FeatureId.MANTRA_GENERATOR);
    const needsMoleology = pkg.features.includes(FeatureId.MOLEOLOGY);

    const steps = [
        ...(needsAstrology ? [{ id: 'astrology', title: 'Cosmic Coordinates', desc: 'Your birth details align your chart.' }] : []),
        ...(needsPalm ? [{ id: 'palm', title: 'Palm Image', desc: 'Upload a clear photo of your dominant hand.' }] : []),
        ...(needsFace ? [{ id: 'face', title: 'Face Image', desc: 'Upload a clear photo of your face.' }] : []),
        ...(needsHandwriting ? [{ id: 'handwriting', title: 'Handwriting Sample', desc: 'Upload a photo of your handwriting.' }] : []),
        ...(needsMantra ? [{ id: 'mantra', title: 'Intention', desc: 'What is your current spiritual goal?' }] : []),
        // Add more steps as needed
    ];

    if (steps.length === 0) {
        // If no inputs needed, just submit
        onComplete(inputs);
        return null;
    }

    const currentStep = steps[step];
    const isLastStep = step === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onComplete(inputs);
        } else {
            setStep(step + 1);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PackageInputs) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInputs(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const renderStepContent = () => {
        switch (currentStep.id) {
            case 'astrology':
                return (
                    <div className="space-y-4 animate-[fadeIn_0.3s]">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Birth Date</label>
                                <input type="date" value={inputs.birthDate || ''} onChange={e => setInputs({...inputs, birthDate: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Birth Time</label>
                                <input type="time" value={inputs.birthTime || ''} onChange={e => setInputs({...inputs, birthTime: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Birth Place</label>
                            <input type="text" placeholder="e.g. Mumbai, India" value={inputs.birthPlace || ''} onChange={e => setInputs({...inputs, birthPlace: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                        </div>
                    </div>
                );
            case 'palm':
            case 'face':
            case 'handwriting':
                const fieldMap: Record<string, keyof PackageInputs> = {
                    palm: 'palmImage',
                    face: 'faceImage',
                    handwriting: 'handwritingImage'
                };
                const field = fieldMap[currentStep.id];
                const currentImage = inputs[field] as string;
                
                return (
                    <div className="flex flex-col items-center animate-[fadeIn_0.3s]">
                        <label className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors bg-gray-800/50">
                            {currentImage ? (
                                <img src={currentImage} alt="Preview" className="h-full object-contain rounded" />
                            ) : (
                                <div className="text-center p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-gray-400">Click to upload image</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, field)} />
                        </label>
                    </div>
                );
            case 'mantra':
                return (
                    <div className="space-y-4 animate-[fadeIn_0.3s]">
                        <label className="block text-sm text-gray-400">What is your primary intention or goal right now?</label>
                        <textarea 
                            rows={3}
                            placeholder="e.g., Peace of mind, Career success, Healing..."
                            value={inputs.mantraGoal || ''} 
                            onChange={e => setInputs({...inputs, mantraGoal: e.target.value})} 
                            className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s]">
            <div className="w-full max-w-lg bg-gray-900 border border-yellow-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800/50 p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-playfair font-bold text-white">{pkg.name} Wizard</h2>
                    <p className="text-yellow-400 text-sm">Step {step + 1} of {steps.length}: {currentStep.title}</p>
                    <div className="w-full bg-gray-700 h-1 mt-4 rounded-full overflow-hidden">
                        <div 
                            className="bg-yellow-500 h-full transition-all duration-300" 
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow">
                    <p className="text-gray-300 mb-4">{currentStep.desc}</p>
                    {renderStepContent()}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-800/30 border-t border-gray-700 flex justify-between">
                    <button onClick={onCancel} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                    <button 
                        onClick={handleNext} 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all"
                    >
                        {isLastStep ? 'Generate Full Report' : 'Next Step'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageWizard;
