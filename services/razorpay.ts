import { db, auth } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

/* ----------------------------------------
   Load Razorpay SDK
---------------------------------------- */
export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ----------------------------------------
   Open Razorpay Checkout (One-time payment)
---------------------------------------- */
export const createSubscription = async (
  planDetails: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: "monthly" | "yearly";
  },
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
) => {
  const user = auth.currentUser;
  if (!user) {
    onFailure({ message: "User not logged in" });
    return;
  }

  const sdkLoaded = await initializeRazorpay();
  if (!sdkLoaded) {
    onFailure({ message: "Razorpay SDK failed to load" });
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: planDetails.price * 100,
    currency: planDetails.currency,
    name: "Taintra Cosmic Wisdom",
    description: planDetails.name,

    prefill: {
      email: user.email,
    },

    handler: function (response: any) {
      onSuccess(response);
    },

    modal: {
      ondismiss: function () {
        onFailure({ reason: "cancelled" });
      },
    },

    theme: {
      color: "#F37254",
    },
  };

  const razorpay = new window.Razorpay(options);

  razorpay.on("payment.failed", function (response: any) {
    onFailure(response.error);
  });

  razorpay.open();
};

/* ----------------------------------------
   Save subscription after payment success
---------------------------------------- */
export const processPaymentSuccess = async (
  response: any,
  planDetails: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: "monthly" | "yearly";
  }
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const now = new Date();
  const endDate = new Date();

  planDetails.interval === "yearly"
    ? endDate.setFullYear(now.getFullYear() + 1)
    : endDate.setMonth(now.getMonth() + 1);

  const subscriptionDoc = {
    userId: user.uid,
    planId: planDetails.id,
    planName: planDetails.name,
    interval: planDetails.interval,

    status: "active",
    amount: planDetails.price,
    currency: planDetails.currency,

    currentStart: now,
    currentEnd: endDate,

    lastPayment: {
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id || null,
      signature: response.razorpay_signature || null,
      paidAt: now,
    },

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "subscriptions", user.uid), subscriptionDoc, {
    merge: true,
  });

  console.log("✅ Subscription saved successfully");
};
