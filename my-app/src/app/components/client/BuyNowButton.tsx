// src/app/components/client/BuyNowButton.tsx
"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/actions/stripeActions";

interface BuyNowProps {
  productId: string;
}

export default function BuyNowButton({ productId }: BuyNowProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setLoading(true);
      const res = await createCheckoutSession(productId);
      if (res?.url) {
        window.location.assign(res.url); // Redirect to Stripe
      }
    } catch (error) {
      alert("Payment failed to initialize. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
}