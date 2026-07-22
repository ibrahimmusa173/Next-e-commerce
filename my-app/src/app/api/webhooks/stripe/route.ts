import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongoose";
import Order from "@/lib/models/Order";
import { inngest } from "@/lib/inngest"; // 🆕 Import queue client

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
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    await connectDB();
    
    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      { status: "paid" }
    );
    
    console.log(`Order for session ${session.id} marked as PAID`);

    // 🆕 Extract metadata and send a job message to the queue asynchronously
    const productId = session.metadata?.productId;
    if (productId) {
      await inngest.send({
        name: "order.payment_success",
        data: {
          productId: productId,
          quantity: 1, // Matches line item allocation inside your Server Action
        },
      });
      console.log(`Dispatched stock reduction message for product ${productId} to the queue`);
    }
  }

  return NextResponse.json({ received: true });
}
