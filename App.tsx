
import React, { useState, useCallback, useEffect } from 'react';
import { FeatureId, UserContext, UserState, AuthView, Gender, LoggedInUser, PackageInputs, CombinedAnalysisReport } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import GufyChatbot from './components/GufyChatbot';
import PalmReading from './components/PalmReading';
import FaceReading from './components/FaceReading';
import TattooMaker from './components/TattooMaker';
import ArtGenerator from './components/ArtGenerator';
import Dating from './components/Dating';
import Moleology from './components/Moleology';
import AstrologyFeature from './components/AstrologyFeature';
import SacredUnion from './components/SacredUnion';
import TarotReading from './components/TarotReading';
import MantraGenerator from './components/MantraGenerator';
import HandwritingAnalysis from './components/HandwritingAnalysis';
import ZodiacCompatibility from './components/ZodiacCompatibility';
import Tour from './components/Tour';
import Packages, { Package, packages } from './components/Packages';
import FeaturePreview from './components/FeaturePreview';
import Auth from './components/Auth';
import TrialReport from './components/TrialReport';
import PackageWizard from './components/PackageWizard';
import FullReport from './components/FullReport';
import { features } from './features';
import { getUserContextInfo } from './services/deviceInfoService';
import { generateComprehensiveReport } from './services/geminiService';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureId>(FeatureId.HOME);
  const [tattooGenerationDetails, setTattooGenerationDetails] = useState<{ prompt: string; placement: string; aspectRatio: string; } | null>(null);
  const [artGenerationDetails, setArtGenerationDetails] = useState<{ prompt: string; aspectRatio: string; } | null>(null);
  const [previewFeatureId, setPreviewFeatureId] = useState<FeatureId | null>(null);

  // Auth and user flow state
  const [userState, setUserState] = useState<UserState>('guest');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userGender, setUserGender] = useState<Gender | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [authPackage, setAuthPackage] = useState<Package | null>(null);
  const [trialPackage, setTrialPackage] = useState<Package | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);

  // New State for Full Package Flow
  const [showPackageWizard, setShowPackageWizard] = useState(false);
  const [activePackage, setActivePackage] = useState<Package | null>(null);
  const [fullReportData, setFullReportData] = useState<CombinedAnalysisReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Fetch user context on load
  useEffect(() => {
    const fetchUserContext = async () => {
        const info = await getUserContextInfo();
        setUserContext(info);
    };
    fetchUserContext();
  }, []);

  // Check for session on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in.
            const email = user.email || '';
            const name = user.displayName || email.split('@')[0];
            
            // Try to recover extended state from local storage mock DB
            // In a real app, this would be a Firestore fetch
            const users = JSON.parse(localStorage.getItem('taintra-users') || '{}');
            const storedUser = users[email];

            if (storedUser) {
                setUserName(storedUser.name);
                setUserState(storedUser.state);
                setUserEmail(storedUser.email);
                setUserGender(storedUser.gender || 'Unisex');
            } else {
                // If not in local DB (e.g. cleared storage or fresh OAuth), init as trial
                 setUserName(name);
                 setUserEmail(email);
                 setUserState('trial');
                 setUserGender('Unisex');
                 
                 // Sync to mock DB for consistency
                 users[email] = {
                     name,
                     email,
                     state: 'trial',
                     gender: 'Unisex',
                     provider: 'firebase'
                 };
                 localStorage.setItem('taintra-users', JSON.stringify(users));
            }
            // Keep session storage for legacy compatibility
            localStorage.setItem('taintra-session', JSON.stringify({ name, email, state: storedUser?.state || 'trial', gender: storedUser?.gender || 'Unisex' }));

        } else {
            // User is signed out.
            setUserState('guest');
            setUserName('');
            setUserEmail('');
            setUserGender(null);
            setTrialPackage(null);
            setFullReportData(null);
            localStorage.removeItem('taintra-session');
        }
    });

    return () => unsubscribe();
  }, []);

  const handleSuggestTattoo = useCallback((details: { prompt: string; placement: string; aspectRatio: string; }) => {
    setTattooGenerationDetails(details);
    setActiveFeature(FeatureId.TATTOO_MAKER);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleTattooGenerationComplete = useCallback(() => {
    setTattooGenerationDetails(null);
  }, []);

  const handleSuggestArt = useCallback((details: { prompt: string; aspectRatio: string; }) => {
    setArtGenerationDetails(details);
    setActiveFeature(FeatureId.COSMIC_ART_GENERATOR);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleArtGenerationComplete = useCallback(() => {
    setArtGenerationDetails(null);
  }, []);

  const handleAuthModalOpen = (view: AuthView, pkg?: Package) => {
    setAuthView(view);
    setShowAuthModal(true);
    setAuthPackage(pkg || (view === 'register' ? packages[0] : null));
  };
  
  const handleSelectPackage = (pkg: Package) => {
    if (userState === 'guest') {
      handleAuthModalOpen('register', pkg);
    } else if (userState === 'full_access') {
      // Start the wizard for full report generation
      setActivePackage(pkg);
      setShowPackageWizard(true);
    } else if (userState === 'trial') {
      setTrialPackage(pkg);
    }
  };

  const handlePackageInputComplete = async (inputs: PackageInputs) => {
      if (!activePackage) return;
      setShowPackageWizard(false);
      setIsGeneratingReport(true);
      
      // Call the synthesis service
      const report = await generateComprehensiveReport(inputs, activePackage.features, userContext);
      
      setFullReportData(report);
      setIsGeneratingReport(false);
  };

  const handleRegisterSuccess = (name: string, email: string, gender: Gender) => {
    // Auth component handles Firebase registration.
    // This callback updates local state immediately for better UX while onAuthStateChanged catches up.
    setShowAuthModal(false);
    setUserState('trial');
    setUserName(name);
    setUserEmail(email);
    setUserGender(gender);
    setTrialPackage(authPackage); // Set the package for the trial report
    localStorage.setItem('taintra-session', JSON.stringify({ name, email, state: 'trial', gender }));
    setAuthPackage(null);
  };

  const handleLoginSuccess = (user: LoggedInUser) => {
    setUserName(user.name);
    setUserState(user.state);
    setUserEmail(user.email);
    setUserGender(user.gender);
    setShowAuthModal(false);
    localStorage.setItem('taintra-session', JSON.stringify(user));
    setActiveFeature(FeatureId.PACKAGES); 
  };
  
  const handleLogout = () => {
    signOut(auth).then(() => {
        // State clearing is handled by onAuthStateChanged, but we can do extra cleanup if needed
        setActiveFeature(FeatureId.HOME);
    }).catch((error) => {
        console.error("Logout error", error);
    });
  };
  
  const handlePurchase = () => {
    const updatedState: UserState = 'full_access';
    setUserState(updatedState);
    
    // Update master user list
    const users = JSON.parse(localStorage.getItem('taintra-users') || '{}');
    if (users[userEmail]) {
        users[userEmail].state = updatedState;
        localStorage.setItem('taintra-users', JSON.stringify(users));
    }

    // Update session
    localStorage.setItem('taintra-session', JSON.stringify({ name: userName, email: userEmail, state: updatedState, gender: userGender }));
    
    alert("Purchase successful! You've unlocked your full cosmic report.");
    
    // Transition from Trial Report to Package Wizard immediately if a package was selected
    if (trialPackage) {
        const pkg = trialPackage; // capture ref
        setTrialPackage(null);
        setActivePackage(pkg);
        setShowPackageWizard(true);
    }
  };

  const handleNavClick = (featureId: FeatureId) => {
    if (activeFeature === FeatureId.TATTOO_MAKER && featureId !== FeatureId.TATTOO_MAKER) {
        setTattooGenerationDetails(null);
    }
    if (activeFeature === FeatureId.COSMIC_ART_GENERATOR && featureId !== FeatureId.COSMIC_ART_GENERATOR) {
        setArtGenerationDetails(null);
    }
    
    // Reset reports if navigating
    if (trialPackage) setTrialPackage(null);
    if (fullReportData) setFullReportData(null);
    
    const directNavFeatures = [FeatureId.HOME, FeatureId.PACKAGES, FeatureId.TOUR];
    if (userState === 'guest' && !directNavFeatures.includes(featureId)) {
        setPreviewFeatureId(featureId);
    } else {
        setActiveFeature(featureId);
        setPreviewFeatureId(null);
    }
  };

  const renderContent = () => {
    // 1. Generating State
    if (isGeneratingReport) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-[fadeIn_0.5s]">
                <div className="w-24 h-24 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                <h2 className="text-3xl font-playfair text-white text-center mb-2">Synthesizing Cosmic Wisdom</h2>
                <p className="text-gray-400 text-center max-w-md">Connecting your astrological chart, palm lines, and sacred data into one unified prophecy...</p>
            </div>
        );
    }

    // 2. Full Report State
    if (fullReportData && activePackage) {
        return <FullReport report={fullReportData} pkg={activePackage} onClose={() => setFullReportData(null)} />;
    }

    // 3. Trial Report State
    if ((userState === 'trial') && trialPackage) {
        return <TrialReport pkg={trialPackage} onPurchase={handlePurchase} userName={userName} userGender={userGender} userContext={userContext} userState={userState} onNavClick={handleNavClick} />;
    }
    
    // 4. Standard Features
    switch (activeFeature) {
      case FeatureId.HOME: return <HeroSection onFeatureSelect={handleNavClick} />;
      case FeatureId.TOUR: return <Tour onFeatureSelect={handleNavClick} />;
      case FeatureId.PACKAGES: return <Packages onSelectPackage={handleSelectPackage} userState={userState} />;
      case FeatureId.PALMISTRY: return <PalmReading onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.FACE_READING: return <FaceReading onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.HANDWRITING_ANALYSIS: return <HandwritingAnalysis onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.TATTOO_MAKER: return <TattooMaker initialPrompt={tattooGenerationDetails?.prompt} initialAspectRatio={tattooGenerationDetails?.aspectRatio} initialPlacement={tattooGenerationDetails?.placement} onGenerationComplete={handleTattooGenerationComplete} />;
      case FeatureId.COSMIC_ART_GENERATOR: return <ArtGenerator initialPrompt={artGenerationDetails?.prompt} initialAspectRatio={artGenerationDetails?.aspectRatio} onGenerationComplete={handleArtGenerationComplete} />;
      case FeatureId.ASTROLOGY: return <AstrologyFeature onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.COMPATIBILITY: return <ZodiacCompatibility onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.MOLEOLOGY: return <Moleology onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.MANTRA_GENERATOR: return <MantraGenerator onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.SACRED_UNION: return <SacredUnion onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.DATING: return <Dating onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      case FeatureId.TAROT: return <TarotReading onSuggestTattoo={handleSuggestTattoo} onSuggestArt={handleSuggestArt} userGender={userGender} userContext={userContext} />;
      default: return <HeroSection onFeatureSelect={handleNavClick} />;
    }
  };
  
  const previewedFeature = features.find(f => f.id === previewFeatureId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavClick={handleNavClick} onStartTrial={() => handleAuthModalOpen('register')} onLogin={() => handleAuthModalOpen('login')} userState={userState} userName={userName} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {activeFeature !== FeatureId.HOME && !trialPackage && !fullReportData && !isGeneratingReport && (
          <button onClick={() => handleNavClick(FeatureId.HOME)} className="mb-8 flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors print-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Back to Home
          </button>
        )}
        {renderContent()}
      </main>
      <GufyChatbot activeFeature={activeFeature} userGender={userGender} userContext={userContext} />
      <Footer onNavClick={handleNavClick} />

      {previewedFeature && (
        <FeaturePreview feature={previewedFeature} onClose={() => setPreviewFeatureId(null)} onSelectPackage={() => { setPreviewFeatureId(null); handleAuthModalOpen('register'); }} />
      )}
      
      {showAuthModal && (
          <Auth initialView={authView} selectedPackage={authPackage} onClose={() => setShowAuthModal(false)} onRegisterSuccess={handleRegisterSuccess} onLoginSuccess={handleLoginSuccess} />
      )}

      {showPackageWizard && activePackage && (
          <PackageWizard 
            pkg={activePackage} 
            userGender={userGender} 
            userName={userName} 
            onComplete={handlePackageInputComplete} 
            onCancel={() => setShowPackageWizard(false)} 
          />
      )}
    </div>
  );
};

export default App;
