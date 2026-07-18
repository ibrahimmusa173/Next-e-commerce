// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongoose";
import Order from "@/lib/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    // FIXED: Use 'unknown' instead of 'any' to satisfy ESLint
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    // FIXED: Correct Stripe type is Stripe.Checkout.Session
    const session = event.data.object as Stripe.Checkout.Session;
    
    await connectDB();
    
    // Find the order by session ID and mark as paid
    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      { status: "paid" }
    );
    
    console.log(`Order for session ${session.id} marked as PAID`);
  }

  return NextResponse.json({ received: true });
}