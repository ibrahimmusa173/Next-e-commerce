// src/models/Product.ts
import { Schema, model, models } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }, // Store URL of the image
  createdAt: { type: Date, default: Date.now },
});

// Use existing model if available (Next.js hot reloading fix)
const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;