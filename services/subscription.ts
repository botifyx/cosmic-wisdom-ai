import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserSubscription, SubscriptionPlan } from '../types';

export const PLANS: SubscriptionPlan[] = [
    {
        id: 'plan_basic',
        name: 'Cosmic Seeker',
        prices: { INR: 199, USD: 2.99 },
        interval: 'monthly',
        features: ['Daily Horoscope', 'Basic Palm Reading', '1 Tarot Card/day']
    },
    {
        id: 'plan_premium',
        name: 'Astral Master',
        prices: { INR: 499, USD: 6.99 },
        interval: 'monthly',
        features: ['Full Astrology Chart', 'Advanced Palmistry', 'Unlimited Tarot', 'Sacred Union Matching']
    },
    {
        id: 'plan_yearly',
        name: 'Galactic Guru',
        prices: { INR: 4999, USD: 69.99 },
        interval: 'yearly',
        features: ['All Premium Features', 'Priority Support', 'Exclusive Rituals', 'Yearly Forecast']
    }
];

export const getSubscription = async (userId: string): Promise<UserSubscription | null> => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.subscription) {
                 // Check if expired
                 const sub = data.subscription as UserSubscription;
                 const now = new Date();
                 // Convert Firestore timestamp to Date if needed (Firebase SDK usually handles this if configured, but safe check)
                 const endDate = sub.currentEnd instanceof Object ? (sub.currentEnd as any).toDate() : new Date(sub.currentEnd);
                 
                 if (endDate < now && sub.status === 'active') {
                     // Auto-expire local check (ideally backend does this)
                     return { ...sub, status: 'expired' };
                 }
                 return sub;
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return null;
    }
};

export const checkFeatureAccess = (subscription: UserSubscription | undefined, featureId: string): boolean => {
    if (!subscription || subscription.status !== 'active') {
        // Allow free features here if we define them
        const freeFeatures = ['daily_horoscope_summary']; 
        return freeFeatures.includes(featureId);
    }
    
    // Logic to check plan capabilities
    // For now simple tiering:
    // Basic: Limited
    // Premium: All
    if (subscription.planId === 'plan_premium' || subscription.planId === 'plan_yearly') {
        return true;
    }
    
    if (subscription.planId === 'plan_basic') {
        const basicAllowed = ['daily_horoscope', 'basic_palm_reading', 'tarot_basic'];
        return basicAllowed.includes(featureId);
    }

    return false;
};
