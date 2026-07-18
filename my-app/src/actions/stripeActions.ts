// src/actions/stripeActions.ts
"use server";

import Stripe from "stripe";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

// Ensure the key exists before initializing
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error("CRITICAL: STRIPE_SECRET_KEY is missing in environment variables");
}
const stripe = new Stripe(stripeKey as string);

export async function createCheckoutSession(productId: string) {
  try {
    await connectDB();

    // 1. Get Product Details (Using .lean() for faster performance)
    const product = await Product.findById(productId).lean();
    if (!product) throw new Error("Product not found");

    /**
     * 2. ROBUST IMAGE VALIDATION
     * We strictly check:
     * - Is it a string?
     * - Does it start with http (not data:base64)?
     * - Is it under the character limit?
     */
    const productImage = typeof product.image === "string" ? product.image.trim() : "";
    
    const isValidUrl = 
      productImage.startsWith("http") && 
      !productImage.startsWith("data:") && 
      productImage.length <= 2000;

    const imagesArray = isValidUrl ? [productImage] : [];

    // 3. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description || "Product details",
              images: imagesArray, 
            },
            unit_amount: Math.round(product.price * 100), 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client-dashboard/${productId}`,
      metadata: { 
        productId: productId.toString() 
      },
    });

    // 4. Create Pending Order
    await Order.create({
      productId: product._id,
      amount: product.price,
      stripeSessionId: session.id,
      status: "pending",
    });

    return { url: session.url };
  } catch (error: unknown) {
    // Log the error detail specifically for Vercel
    if (error instanceof Error) {
      console.error("Stripe Checkout Session Error:", {
        message: error.message,
        productId,
      });
    }
    throw new Error("Could not initiate payment");
  }
}