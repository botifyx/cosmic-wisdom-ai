
// Fix: Import React to resolve React-related type errors.
import React from 'react';

export enum FeatureId {
  HOME = 'home',
  ASTROLOGY = 'astrology',
  PALMISTRY = 'palmistry',
  COMPATIBILITY = 'compatibility',
  MOLEOLOGY = 'moleology',
  TATTOO_MAKER = 'tattoo_maker',
  COSMIC_ART_GENERATOR = 'cosmic_art_generator',
  DATING = 'dating',
  MANTRA_GENERATOR = 'mantra_generator',
  SACRED_UNION = 'sacred_union',
  TAROT = 'tarot',
  FACE_READING = 'face_reading',
  HANDWRITING_ANALYSIS = 'handwriting_analysis',
  TOUR = 'tour',
  PACKAGES = 'packages',
}

export interface Feature {
  id: FeatureId;
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// New types for the redesigned Cosmic Matchmaking feature
export interface PersonDetails {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  bio: string; // To capture desires for a soulmate
}

export interface AnalysisSection {
  title: string;
  description: string;
}

// This is a new interface for the visualizer
export interface SynastryAspect {
  title: string;
  description: string;
  // Type will help in styling (e.g., color coding)
  type: 'harmony' | 'challenge' | 'neutral';
}

export interface CosmicMatchAnalysis {
  overallCompatibility: {
    score: number;
    summary: string;
  };
  strengths: AnalysisSection[];
  challenges: AnalysisSection[];
  growthPotential: AnalysisSection[];
  synastryAspects: SynastryAspect[];
  spiritualGuidance: string;
}


export interface PlanetInfo {
  sign: string;
  isRetrograde?: boolean;
}

export interface PlanetaryPositions {
  Sun: PlanetInfo;
  Moon: PlanetInfo;
  Mars: PlanetInfo;
  Mercury: PlanetInfo;
  Jupiter: PlanetInfo;
  Venus: PlanetInfo;
  Saturn: PlanetInfo;
  Rahu: PlanetInfo;
  Ketu: PlanetInfo;
  Ascendant: PlanetInfo;
  [key: string]: PlanetInfo;
}

export interface AstrologyAnalysisSection {
  title: string;
  description: string;
  category: 'introduction' | 'ascendant' | 'placements' | 'themes' | 'summary';
}

export interface AstrologyAnalysis {
    rasi: PlanetaryPositions; // D1 chart
    navamsa: PlanetaryPositions; // D9 chart
    drekkana: PlanetaryPositions; // D3 chart
    analysis: AstrologyAnalysisSection[];
}

export interface TrialAstrologyAnalysis {
    greeting: string;
    summary: string;
}


export interface HoroscopeSection {
    title: string;
    outlook: string;
}

export interface DailyHoroscopeAnalysis {
    greeting: string;
    introduction: string;
    sections: HoroscopeSection[];
    conclusion: string;
    luckyColor: string;
    luckyNumbers: number[];
    // Fix: Added sources to comply with coding guidelines for search-based insights.
    sources?: { title: string; uri: string }[];
}

export interface ZodiacSignInfo {
  name: string;
  element: string;
  description: string;
}

export interface SacredUnionAnalysis {
  sign1Info: ZodiacSignInfo;
  sign2Info: ZodiacSignInfo;
  sacredConnection: string;
  spiritualHarmony: number;
  connectionStrengths: string[];
  intimacyStyle: {
      summary: string;
      spiritualBond: string;
  };
  relationshipChallenges: string[];
  kamasutraGuidance: string[];
  sacredRecommendation: string;
}

// New types for structured Palm Reading Analysis
export interface PalmAnalysisSection {
  title: string;
  description: string;
  category: 'impression' | 'life_line' | 'head_line' | 'heart_line' | 'fate_line' | 'mounts' | 'summary';
}

export interface PalmReadingAnalysis {
  sections: PalmAnalysisSection[];
}

// New types for structured Face Reading Analysis
export interface FaceAnalysisSection {
  title: string;
  description: string;
  category: 'overall_impression' | 'forehead' | 'eyes' | 'nose' | 'mouth' | 'cheeks' | 'chin';
}

export interface FaceReadingAnalysis {
  sections: FaceAnalysisSection[];
}


// New types for structured Moleology Analysis
export interface MoleologyAnalysisSection {
  title: string;
  description: string;
  category: 'personality' | 'love' | 'health' | 'wealth' | 'career' | 'spirituality';
}

export interface MoleologyAnalysis {
  sections: MoleologyAnalysisSection[];
}

// New types for structured Handwriting Analysis
export interface HandwritingAnalysisSection {
  title: string;
  description: string;
  category: 'overall_impression' | 'pressure' | 'slant' | 'size' | 'spacing' | 'signature' | 'summary';
}

export interface HandwritingAnalysis {
  sections: HandwritingAnalysisSection[];
}


// Updated types for structured Tarot Reading Analysis to support multiple spread types
export interface TarotCardReading {
  cardName: string;
  position: string; // e.g., "Past", "The Challenge"
  interpretation: string;
  keywords: string[];
}

export interface TarotAnalysis {
  readings: TarotCardReading[];
  overallSummary: string;
}

// New types for structured Mantra Analysis
export interface MantraWordMeaning {
  word: string;
  meaning: string;
}

export interface MantraAnalysis {
  sanskritMantra: string;
  transliteration: string;
  wordMeanings: MantraWordMeaning[];
  overallMeaning: string;
  chantingGuidance: string;
}

// New types for structured Zodiac Compatibility Analysis
export interface ZodiacCompatibilitySection {
  title: string;
  description: string;
  category: 'vibe' | 'strengths' | 'challenges' | 'tips' | 'conclusion';
}

export interface ZodiacCompatibilityAnalysis {
  sections: ZodiacCompatibilitySection[];
}

// New types for AI Hand Mudra analysis
export interface HandMudraAnalysis {
  mudraName: string;
  sanskritName: string;
  description: string;
  instructions: string[];
  personalizedGuidance: string;
  practice: string;
  imagePrompt: string;
}

// Input data collected from the Package Wizard
export interface PackageInputs {
    // Core
    name: string;
    gender: Gender;
    // Astrology & Compatibility
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    isBirthTimeUnknown?: boolean;
    partnerSign?: string; // For Compatibility/Sacred Union
    // Images
    palmImage?: string; // Base64
    faceImage?: string; // Base64
    handwritingImage?: string; // Base64
    // Specifics
    mantraGoal?: string;
    tarotSpread?: string; // e.g., 'threeCard'
    moleLocations?: string[];
}

// Final Combined Analysis Report
export interface CombinedAnalysisReport {
    introduction: string;
    
    // Individual Analyses (Optional depending on package)
    astrology?: AstrologyAnalysis;
    palmistry?: PalmReadingAnalysis;
    faceReading?: FaceReadingAnalysis;
    handwriting?: HandwritingAnalysis;
    tarot?: TarotAnalysis;
    sacredUnion?: SacredUnionAnalysis;
    mantra?: MantraAnalysis;
    zodiacCompatibility?: ZodiacCompatibilityAnalysis;
    moleology?: MoleologyAnalysis;
    
    // Synthesized Section
    holisticGuidance: string;
    
    // Creative Suggestions (Generated based on holistic guidance)
    tattooSuggestion?: { prompt: string, placement: string };
    artSuggestion?: { prompt: string };
}

export interface UserContext {
  geolocation: {
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    ip: string;
  } | null;
  userAgent: {
    browser: string;
    os: string;
    device: string;
  };
}

// User Authentication Types
export type UserState = 'guest' | 'trial' | 'full_access';
export type AuthView = 'login' | 'register';
export type Gender = 'Male' | 'Female' | 'Unisex';

export interface SubscriptionPlan {
  id: string;
  name: string;
  prices: { [key: string]: number };
  interval: 'monthly' | 'yearly';
  features: string[];
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'created' | 'past_due' | 'cancelled' | 'expired';
  razorpaySubscriptionId: string;
  currentStart: Date; // or Firestore Timestamp
  currentEnd: Date;   // or Firestore Timestamp
  currency: string;
  amount: number;
}

export interface LoggedInUser { 
  name: string; 
  email: string; 
  state: UserState; 
  gender: Gender;
  subscription?: UserSubscription;
}
