
import * as React from 'react';
import { FeatureId, Feature } from './types';

// Centralize Icon components
export const AstrologyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" }))
);
export const PalmistryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 12 10.125A2.625 2.625 0 0 0 12 4.875Z" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.875v.01" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 9.75a3 3 0 1 1-6 0" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M18 11.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 11.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" }))
);
export const FaceReadingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 8.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0 1.5ZM12 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8.25 9.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9 11.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15.75 9.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM15 11.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 15.75a2.25 2.25 0 0 1-2.25-2.25H9a3.75 3.75 0 0 0 7.5 0h-.75A2.25 2.25 0 0 1 12 15.75Z M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" })
    )
);
export const HandwritingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" })
    )
);
export const CompatibilityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" }))
);
export const MoleologyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" }))
);
export const TattooIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.223 2.296-5.274 4.325z" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9 9 0 100-18 9 9 0 000 18z" })
    )
);
export const ArtIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" })
    )
);
export const PackagesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m12.75 3-4.5 4.5 1.5 1.5 2.25-2.25 4.5 4.5-6.75 6.75-1.5-1.5-4.5 4.5m0 0 6-6M12.75 3l6 6m-1.5-1.5-6 6m6-6-6 6" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 12.75 2.25 15l1.5 1.5 1.5-1.5m0 0-1.5-1.5m1.5 1.5-1.5-1.5m0 0 1.5-1.5 1.5 1.5m-1.5 1.5-1.5-1.5" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12.75 21 15 18.75l-1.5-1.5-1.5 1.5m0 0 1.5 1.5m-1.5-1.5 1.5 1.5m0 0-1.5 1.5-1.5-1.5m1.5-1.5 1.5 1.5" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12.75 18.75 15l-1.5-1.5-1.5 1.5m0 0 1.5 1.5m-1.5-1.5 1.5 1.5m0 0-1.5 1.5-1.5-1.5m1.5-1.5 1.5 1.5" })
    )
);
export const MantraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
      React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 7.5c-3.14 0-6.02.9-8.47 2.47M12 7.5c3.14 0-6.02.9 8.47 2.47M12 7.5v9.75m0-9.75a4.5 4.5 0 1 1 0 9.75 4.5 4.5 0 0 1 0-9.75ZM4.5 12a7.5 7.5 0 0 0 15 0" })
    )
);
export const SacredUnionIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" })
    )
);
export const TarotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a14.956 14.956 0 0 1-5.84 2.56m0 0a14.956 14.956 0 0 0-5.84-2.56m5.84 2.56v4.82a6 6 0 0 1-5.84-7.38m5.84 2.56c1.474 0 2.854-.366 4.093-.996m-4.093.996c-1.474 0-2.854-.366-4.093-.996m0 0a14.95 14.95 0 0 1-5.632-4.138m13.818 4.138a14.95 14.95 0 0 0 5.632-4.138m-13.818 4.138c-1.572 1.21-3.5 1.938-5.632 1.938m13.818-1.938c1.572 1.21 3.5 1.938 5.632 1.938M8.409 6.262a14.92 14.92 0 0 0-5.632 4.138m13.818-4.138a14.92 14.92 0 0 1 5.632 4.138" })
    )
);
export const MudraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 9.75v2.25a8.25 8.25 0 0 1-16.5 0V9.75" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 19.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18.75v-1.5" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 9.75a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Z" }),
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 9.75a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Z" })
    )
);


export const features: Feature[] = [
  { 
    id: FeatureId.PACKAGES, 
    title: 'Cosmic Readings', 
    description: 'Get a personalized, synthesized report combining multiple analyses.', 
    Icon: PackagesIcon,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.ASTROLOGY, 
    title: 'AI Vedic Astrology', 
    description: 'Generate your cosmic blueprint and Janam Kundali.', 
    Icon: AstrologyIcon,
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.PALMISTRY, 
    title: 'AI Palm Reading', 
    description: 'Upload a photo of your palm for an AI-enhanced reading.', 
    Icon: PalmistryIcon,
    imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.FACE_READING, 
    title: 'AI Face Reading', 
    description: 'Upload a photo of your face for an AI-enhanced reading.', 
    Icon: FaceReadingIcon,
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.HANDWRITING_ANALYSIS, 
    title: 'AI Handwriting Analysis', 
    description: 'Analyze your handwriting to reveal personality traits and emotional states.', 
    Icon: HandwritingIcon,
    imageUrl: 'https://images.unsplash.com/photo-1555601568-c9e6f328489b?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.TAROT, 
    title: 'AI Tarot Reading', 
    description: 'Shuffle a virtual deck for AI interpretations of your cards.', 
    Icon: TarotIcon,
    imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.SACRED_UNION, 
    title: 'Sacred Union Insights', 
    description: 'Explore spiritual connection and intimacy via Kamasutra wisdom.', 
    Icon: SacredUnionIcon,
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.MANTRA_GENERATOR, 
    title: 'AI Mantra Generator', 
    description: 'Receive a personalized mantra for your goals.', 
    Icon: MantraIcon,
    imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.COMPATIBILITY, 
    title: 'Zodiac Compatibility', 
    description: 'Analyze the cosmic connection between two zodiac signs.', 
    Icon: CompatibilityIcon,
    imageUrl: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.MOLEOLOGY, 
    title: 'Moleology AI', 
    description: 'Discover what your moles reveal about your personality.', 
    Icon: MoleologyIcon,
    imageUrl: 'https://images.unsplash.com/photo-1515942661900-94b3d1972591?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.DATING, 
    title: 'Cosmic Matchmaking', 
    description: 'Deep astrological compatibility analysis for relationships.', 
    Icon: CompatibilityIcon,
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.COSMIC_ART_GENERATOR, 
    title: 'Cosmic Art Generator', 
    description: 'Create mystical art from your cosmic analysis.', 
    Icon: ArtIcon,
    imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: FeatureId.TATTOO_MAKER, 
    title: 'Cosmic Tattoo Maker', 
    description: 'Design a sacred tattoo from your cosmic analysis.', 
    Icon: TattooIcon,
    imageUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=800'
  },
];
