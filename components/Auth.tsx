import React, { useState, useEffect } from 'react';
import { Package } from './Packages';
import { getGenderFromName } from '../services/geminiService';
import { Gender, AuthView, LoggedInUser } from '../types';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider } from 'firebase/auth';

interface AuthProps {
    initialView: AuthView;
    selectedPackage: Package | null;
    onClose: () => void;
    onRegisterSuccess: (name: string, email: string, gender: Gender) => void;
    onLoginSuccess: (user: LoggedInUser) => void;
}

const Auth: React.FC<AuthProps> = ({ initialView, selectedPackage, onClose, onRegisterSuccess, onLoginSuccess }) => {
    const [view, setView] = useState(initialView);
    const [isClosing, setIsClosing] = useState(false);
    
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const themeColor = selectedPackage?.color || 'yellow';
    const themeColors = {
        yellow: { main: '#FBBF24', glow: 'rgba(234, 179, 8, 0.3)' },
        purple: { main: '#A78BFA', glow: 'rgba(168, 85, 247, 0.3)' },
        pink: { main: '#EC4899', glow: 'rgba(236, 72, 153, 0.3)' },
        blue: { main: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' }
    };
    const activeTheme = themeColors[themeColor as keyof typeof themeColors] || themeColors.yellow;

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // For Google Sign-In, we might need to guess gender if it's a new user flow,
            // but for simplicity we can default or try to detect from name if possible.
            // Since we don't distinguish new/old easily without checking db or metadata,
            // we'll just check if we need to call onRegisterSuccess (new) or onLoginSuccess (existing).
            // But the current app logic separates these roughly.
            // For now, let's assume successful login.
            
            // Check creation time to see if new user (optional, but good for flow)
            const isNewUser = (user.metadata.creationTime === user.metadata.lastSignInTime);

            if (isNewUser) {
                 const detectedGender = await getGenderFromName(user.displayName || '');
                 onRegisterSuccess(user.displayName || '', user.email || '', detectedGender);
            } else {
                 // We don't store gender in Firebase Auth profile by default, so we might need to fetch it or default it.
                 // App.tsx expects a user object.
                 onLoginSuccess({
                     name: user.displayName || '',
                     email: user.email || '',
                     state: 'trial', // Default to trial or fetch from db if we had a db
                     gender: 'Unisex' // Fallback
                 });
            }

        } catch (error: any) {
            console.error("Google Sign-In Error", error);
            setError(error.message || 'Failed to sign in with Google.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please enter email and password.');
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
             const user = userCredential.user;
             onLoginSuccess({
                 name: user.displayName || '',
                 email: user.email || '',
                 state: 'trial', // Fallback, real app would fetch from DB
                 gender: 'Unisex' // Fallback
             });
        } catch (error: any) {
            console.error("Login Error", error);
            setError('Invalid email or password.');
        } finally {
             setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!name || !email || !password) {
            setError('Please fill all fields.');
            setIsLoading(false);
            return;
        }
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            const detectedGender = await getGenderFromName(name);
            
            onRegisterSuccess(name, email, detectedGender);
            
        } catch (error: any) {
             console.error("Register Error", error);
             if (error.code === 'auth/email-already-in-use') {
                 setError('An account with this email already exists.');
             } else {
                 setError(error.message || 'Failed to register.');
             }
        } finally {
             setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const modalAnimation = isClosing ? 'animate-[fadeOut_0.3s_ease-in-out]' : 'auth-modal-overlay';
    const containerAnimation = isClosing ? 'animate-[modal-scale-down_0.3s_ease-in-out]' : 'auth-modal-container';
    
    return (
        <div 
            className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${modalAnimation}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
        >
            <style>
                {`
                @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
                @keyframes modal-scale-down { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
                :root {
                    --active-color: ${activeTheme.main};
                    --glow-color: ${activeTheme.glow};
                }
                `}
            </style>
            <div 
                className={`w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col overflow-hidden ${containerAnimation}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center border-b border-gray-700/50" style={{borderBottomColor: 'var(--active-color)'}}>
                    <h2 className="text-2xl font-playfair font-bold text-white">Continue with Taintra</h2>
                    {selectedPackage && view === 'register' && (
                        <p className="text-sm text-gray-400 mt-1">
                            You've selected the <span className="font-bold" style={{color: 'var(--active-color)'}}>{selectedPackage.name}</span> package
                        </p>
                    )}
                </div>

                <div className="px-6 pt-6">
                    {/* Google Button */}
                    <button 
                         onClick={handleGoogleSignIn}
                         disabled={isLoading}
                         className="w-full mb-6 font-bold py-3 px-4 rounded-lg bg-white text-gray-900 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-gray-100 uppercase text-sm tracking-wider"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Continue with Google
                    </button>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-grow h-px bg-gray-700"></div>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">or use email</span>
                        <div className="flex-grow h-px bg-gray-700"></div>
                    </div>

                    <div className="flex border-b-2 border-gray-700/50">
                        <button onClick={() => { setView('login'); setError('')}} className={`auth-tab flex-1 py-3 text-lg font-semibold ${view === 'login' ? 'active' : 'text-gray-500 hover:text-white'}`}>
                            Login
                            <span className="active-indicator"></span>
                        </button>
                        <button onClick={() => { setView('register'); setError('')}} className={`auth-tab flex-1 py-3 text-lg font-semibold ${view === 'register' ? 'active' : 'text-gray-500 hover:text-white'}`}>
                            Register
                            <span className="active-indicator"></span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
                                <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className="auth-input w-full p-3 rounded-lg text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
                                <input type="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} className="auth-input w-full p-3 rounded-lg text-white" />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full font-bold py-3 px-4 rounded-lg text-gray-900 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed" style={{backgroundColor: 'var(--active-color)'}}>
                                {isLoading ? 'Signing In...' : 'Sign In & Continue'}
                            </button>
                        </form>
                    )}
                    {view === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="reg-name">Name</label>
                                <input type="text" id="reg-name" required value={name} onChange={e => setName(e.target.value)} className="auth-input w-full p-3 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="reg-email">Email</label>
                                <input type="email" id="reg-email" required value={email} onChange={e => setEmail(e.target.value)} className="auth-input w-full p-3 rounded-lg text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="reg-password">Password</label>
                                <input type="password" id="reg-password" required value={password} onChange={e => setPassword(e.target.value)} className="auth-input w-full p-3 rounded-lg text-white" />
                            </div>
                            <div className="text-center text-xs text-gray-500 pt-2">
                                After creating your account, you will receive a complimentary trial reading to begin your journey.
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full font-bold py-3 px-4 rounded-lg text-gray-900 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed" style={{backgroundColor: 'var(--active-color)'}}>
                                {isLoading ? 'Creating Account...' : 'Create Account & Start Trial'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;