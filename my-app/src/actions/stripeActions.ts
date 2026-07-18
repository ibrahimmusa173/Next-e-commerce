// src/actions/stripeActions.ts
"use server";

import Stripe from "stripe";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createCheckoutSession(productId: string) {
  try {
    await connectDB();

    // 1. Get Product Details from DB
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    /**
     * 2. FIX: Image URL Validation
     * Stripe requires images to be absolute HTTPS URLs under 2048 characters.
     * Base64 strings (data:image...) are too long and will crash the request.
     */
    const productImage = product.image;
    const isValidUrl = 
      productImage && 
      productImage.startsWith("http") && 
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
              description: product.description,
              images: imagesArray, // Only pass valid public URLs
            },
            unit_amount: Math.round(product.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Use environment variable for the base URL
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/client-dashboard/${productId}`,
      metadata: { 
        productId: productId.toString() 
      },
    });

    // 4. Create Pending Order in our DB
    await Order.create({
      productId: product._id,
      amount: product.price,
      stripeSessionId: session.id,
      status: "pending",
    });

    return { url: session.url };
  } catch (error: unknown) {
    // Improved logging for production debugging
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe Error:", message);
    throw new Error("Could not initiate payment");
  }
}