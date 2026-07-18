// src/lib/models/Order.ts
import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  productId: Schema.Types.ObjectId;
  amount: number;
  status: "pending" | "paid" | "failed";
  stripeSessionId: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  stripeSessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model<IOrder>("Order", OrderSchema);
export default Order;