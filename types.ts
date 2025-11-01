// Fix: Import React to resolve React-related type errors.
import React from 'react';

export enum FeatureId {
  HOME = 'home',
  ASTROLOGY = 'astrology',
  PALMISTRY = 'palmistry',
  COMPATIBILITY = 'compatibility',
  MOLEOLOGY = 'moleology',
  IMAGE_GENERATOR = 'image_generator',
  DATING = 'dating',
  MANTRA_GENERATOR = 'mantra_generator',
  SACRED_UNION = 'sacred_union',
  TAROT = 'tarot',
  FACE_READING = 'face_reading',
  HANDWRITING_ANALYSIS = 'handwriting_analysis',
  TOUR = 'tour',
}

export interface Feature {
  id: FeatureId;
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
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

export interface HandwritingAnalysisResult {
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