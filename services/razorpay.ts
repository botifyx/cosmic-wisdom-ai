import { db, auth } from './firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createSubscription = async (
  planId: string, 
  userEmail: string, 
  onSuccess: (response: any) => void, 
  onFailure: (error: any) => void
) => {
  if (!window.Razorpay) {
    const res = await initializeRazorpay();
    if (!res) {
      onFailure({ message: "Razorpay SDK failed to load. Check your internet connection." });
      return;
    }
  }

  // NOTE: In a real production app, you would verify stock/logic on backend 
  // and create the subscription ID via API there, then pass it here.
  // For this client-side integration task, we will simulate the subscription ID 
  // or use a dummy flow if backend is strictly not available.
  // Ideally: const subId = await api.createSubscription({ planId });

  // Mocking a subscription ID for demo purposes if backend isn't set up to generate it.
  const options = {
    key: RAZORPAY_KEY_ID,
    subscription_id: "sub_" + Math.random().toString(36).substring(7), // This normally comes from backend
    name: "Taintra Cosmic Wisdom",
    description: "Premium Subscription",
    handler: function (response: any) {
      onSuccess(response);
    },
    prefill: {
      email: userEmail,
    },
    theme: {
      color: "#F37254",
    },
    modal: {
        ondismiss: function() {
            onFailure({ reason: 'cancelled' });
        }
    }
  };

  const rzp1 = new window.Razorpay(options);
  rzp1.on('payment.failed', function (response: any) {
    onFailure(response.error);
  });
  rzp1.open();
};

export const processPaymentSuccess = async (userId: string, response: any, planDetails: any) => {
    // Save to Firestore
    // This is where we securely save the 'active' status.
    // In production, verify signature on backend.
    
    // Determining period based on plan interval
    const now = new Date();
    const endDate = new Date();
    if (planDetails.interval === 'yearly') {
        endDate.setFullYear(now.getFullYear() + 1);
    } else {
        endDate.setMonth(now.getMonth() + 1);
    }

    const subscriptionData = {
        userId,
        planId: planDetails.id,
        status: 'active',
        razorpaySubscriptionId: response.razorpay_subscription_id || response.razorpay_payment_id, // Fallback for one-time
        currentStart: now,
        currentEnd: endDate,
        currency: planDetails.currency,
        amount: planDetails.price,
        lastPaymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature // Store for audit
    };

    // Update User Document with Subscription
    // Often acceptable to store critical entitlement info directly on user or subcollection
    await setDoc(doc(db, "users", userId), { 
        subscription: subscriptionData 
    }, { merge: true });

    // Also could log to a 'transactions' collection
    await setDoc(doc(db, `users/${userId}/transactions`, response.razorpay_payment_id), {
        ...response,
        timestamp: new Date()
    });
};
