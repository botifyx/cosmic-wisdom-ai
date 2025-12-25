import React, { useState } from 'react';
import { FeatureId, UserState } from '../types';
import { createSubscription, processPaymentSuccess } from '../services/razorpay';
import { PLANS } from '../services/subscription';
import { PAYMENT_TERMS } from '../services/terms';
import { auth } from '../services/firebase';
import Modal, { ModalType } from './ui/Modal';

interface PackagesProps {
    onSelectPackage: (pkg: any) => void; // Keeping generic for now as we transition
    userState: UserState;
    userCountry?: string;
}

export const packages = PLANS; // Re-export for compatibility if needed elsewhere

export type Package = typeof PLANS[0];

const Packages: React.FC<PackagesProps> = ({ onSelectPackage, userState, userCountry }) => {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Generic Modal State
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: ModalType;
        title: string;
        message: string;
        onAction?: () => void;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    const openModal = (type: ModalType, title: string, message: string, onAction?: () => void) => {
        setModalState({ isOpen: true, type, title, message, onAction });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    // Determine currency: Default to INR if India, else USD
    const currencyCode = userCountry === 'India' ? 'INR' : 'USD';
    const currencySymbol = currencyCode === 'INR' ? '₹' : '$';

    const handleSubscribe = async (plan: Package) => {
        if (userState === 'guest') {
            onSelectPackage(plan); // Trigger login/register flow
            return;
        }

        const user = auth.currentUser;
        if (!user || !user.email) {
            openModal('warning', 'Sign In Required', 'Please sign in to subscribe to a plan.');
            return;
        }

        if (!agreedToTerms) {
            openModal('warning', 'Terms Required', 'Please agree to the Terms and Conditions to proceed with your cosmic journey.');
            return;
        }

        setLoadingPlan(plan.id);
        
        // Pass the actual amount and currency to the payment processor
        const price = plan.prices[currencyCode];

        await createSubscription(
            plan.id,
            user.email,
            async (response) => {
                console.log("Payment Success", response);
                await processPaymentSuccess(user.uid, response, { ...plan, price, currency: currencyCode });
                setLoadingPlan(null);
                openModal('success', 'Subscription Active', 'Your subscription has been activated successfully! Enjoy the cosmic wisdom.', () => {
                     window.location.reload();
                });
            },
            (error) => {
                console.error("Payment Failure", error);
                
                let title = "Payment Failed";
                let message = "We could not process your payment. Please try again.";

                if (error.reason === 'cancelled') {
                    title = "Payment Cancelled";
                    message = "You cancelled the payment process. No charges were made.";
                } else if (error.description) {
                    message = error.description;
                } else if (error.message) {
                    message = error.message;
                }

                openModal('error', title, message);
                setLoadingPlan(null);
            }
        );
    };

    const getButtonText = (state: UserState, planId: string) => {
        if (loadingPlan === planId) return 'Processing...';
        if (state === 'full_access') return 'Current Plan'; // Simplified logic
        return 'Subscribe Now';
    };

    return (
        <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-in-out]">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold font-playfair text-white">
                    Unlock <span className="logo-text-gradient">Cosmic Wisdom</span>
                </h1>
                <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                    Choose a subscription plan to access daily insights, comprehensive reports, and our full suite of mystic tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {PLANS.map((plan) => (
                    <div 
                        key={plan.id}
                        className="mystic-card flex flex-col p-8 text-center border-t-4 relative"
                        style={{ 
                            borderColor: plan.id === 'plan_premium' ? '#A855F7' : '#EAB308',
                             // Simplified dynamic styling
                        } as React.CSSProperties}
                    >
                        {plan.id === 'plan_premium' && (
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAR
                            </div>
                        )}
                        <h2 className="text-3xl font-playfair font-bold text-white mb-2">{plan.name}</h2>
                        <div className="text-4xl font-bold text-yellow-400 my-4">
                            {currencySymbol}{plan.prices[currencyCode]}
                            <span className="text-lg text-gray-400 font-normal">/{plan.interval}</span>
                        </div>
                        

                        
                        <div className="my-6 text-left flex-grow">
                            <ul className="space-y-3 text-sm text-gray-300">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <svg className="h-5 w-5 mr-2 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <button 
                            onClick={() => handleSubscribe(plan)}
                            disabled={loadingPlan !== null || (userState !== 'full_access' && !agreedToTerms)}
                            className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 ${
                                plan.id === 'plan_premium' 
                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50' 
                                : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
                            } ${(userState !== 'full_access' && !agreedToTerms) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {getButtonText(userState, plan.id)}
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 max-w-2xl mx-auto flex items-center justify-center gap-3 text-gray-400">
                <input 
                    type="checkbox" 
                    id="terms-checkbox" 
                    checked={agreedToTerms} 
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-gray-800"
                />
                <label htmlFor="terms-checkbox" className="text-sm select-none">
                    I agree to the <button onClick={() => setShowTerms(true)} className="text-yellow-400 hover:underline">Terms and Conditions</button> and Razorpay payment policy.
                </label>
            </div>

            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowTerms(false)}>
                    <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h3 className="text-2xl font-bold font-playfair text-white mb-6">Terms and Conditions</h3>
                        <div className="text-gray-300 space-y-4 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                            {PAYMENT_TERMS}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => { setAgreedToTerms(true); setShowTerms(false); }} className="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <Modal 
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                onAction={modalState.onAction}
            />
            
            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Secure payments powered by Razorpay. Cancel anytime.</p>
            </div>
        </div>
    );
};

export default Packages;
