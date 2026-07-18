// src/actions/stripeActions.ts
"use server";

import Stripe from "stripe";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeKey || "");

export async function createCheckoutSession(productId: string) {
  try {
    await connectDB();

    const product = await Product.findById(productId).lean();
    if (!product) throw new Error("Product not found");

    // Robust Image Validation
    const productImage = typeof product.image === "string" ? product.image.trim() : "";
    const isValidUrl = 
      productImage.startsWith("http") && 
      !productImage.startsWith("data:") && 
      productImage.length <= 2000;

    const imagesArray = isValidUrl ? [productImage] : [];

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

    await Order.create({
      productId: product._id,
      amount: product.price,
      stripeSessionId: session.id,
      status: "pending",
    });

    return { url: session.url };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Stripe Error:", error.message);
    }
    throw new Error("Could not initiate payment");
  }
}