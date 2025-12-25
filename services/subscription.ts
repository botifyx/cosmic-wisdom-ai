import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserSubscription, SubscriptionPlan } from "../types";

/* ----------------------------------------
   Subscription Plans
---------------------------------------- */
export const PLANS: SubscriptionPlan[] = [
  {
    id: "plan_basic",
    name: "Cosmic Seeker",
    prices: { INR: 99, USD: 2.99 },
    interval: "monthly",
    features: ["Daily Horoscope", "Basic Palm Reading", "1 Tarot Card/day"],
  },
  {
    id: "plan_premium",
    name: "Astral Master",
    prices: { INR: 499, USD: 6.99 },
    interval: "monthly",
    features: [
      "Full Astrology Chart",
      "Advanced Palmistry",
      "Unlimited Tarot",
      "Sacred Union Matching",
    ],
  },
  {
    id: "plan_yearly",
    name: "Galactic Guru",
    prices: { INR: 4999, USD: 69.99 },
    interval: "yearly",
    features: [
      "All Premium Features",
      "Priority Support",
      "Exclusive Rituals",
      "Yearly Forecast",
    ],
  },
];

/* ----------------------------------------
   Get Subscription (from subscriptions collection)
---------------------------------------- */
export const getSubscription = async (
  userId: string
): Promise<UserSubscription | null> => {
  try {
    const subRef = doc(db, "subscriptions", userId);
    const subSnap = await getDoc(subRef);

    if (!subSnap.exists()) return null;

    const sub = subSnap.data() as UserSubscription;

    // Auto-expire check (frontend safety)
    const now = new Date();
    const endDate =
      typeof (sub.currentEnd as any)?.toDate === "function"
        ? (sub.currentEnd as any).toDate()
        : new Date(sub.currentEnd);

    if (endDate < now && sub.status === "active") {
      return { ...sub, status: "expired" };
    }

    return sub;
  } catch (error) {
    console.error("❌ Error fetching subscription:", error);
    return null;
  }
};

/* ----------------------------------------
   Feature Access Logic
---------------------------------------- */
export const checkFeatureAccess = (
  subscription: UserSubscription | null | undefined,
  featureId: string
): boolean => {
  // Free-tier features
  const freeFeatures = ["daily_horoscope_summary"];

  if (!subscription || subscription.status !== "active") {
    return freeFeatures.includes(featureId);
  }

  // Premium & Yearly → full access
  if (
    subscription.planId === "plan_premium" ||
    subscription.planId === "plan_yearly"
  ) {
    return true;
  }

  // Basic tier
  if (subscription.planId === "plan_basic") {
    const basicAllowed = [
      "daily_horoscope",
      "basic_palm_reading",
      "tarot_basic",
    ];
    return basicAllowed.includes(featureId);
  }

  return false;
};
