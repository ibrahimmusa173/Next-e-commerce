import { inngest } from "./inngest";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";

export const reduceStockWorker = inngest.createFunction(
  { 
    id: "reduce-product-stock",
    // Wrap the event property inside 'triggers' for SDK v4 compatibility
    triggers: {
      event: "order.payment_success"
    }
  }, 
  async ({ event }) => {
    const { productId, quantity } = event.data as { productId: string; quantity: number };

    await connectDB();

    // Safely reduce the stock using MongoDB atomic operators to prevent race conditions
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } }, // Subtracts the quantity purchased
      { new: true }
    );

    if (!updatedProduct) {
      throw new Error(`Product ${productId} not found to reduce stock`);
    }

    console.log(`Successfully reduced stock for Product ${productId} by ${quantity}`);
    return { success: true, newStock: updatedProduct.stock };
  }
);
