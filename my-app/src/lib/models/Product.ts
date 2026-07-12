// src/lib/models/Product.ts
import { Schema, model, models, Document } from "mongoose";

// 1. Define the base structure of a Product
export interface IProduct {
  _id: string; 
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: Date;
}

// 2. Define the Mongoose Document type (omit _id to avoid the conflict error)
export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const ProductSchema = new Schema<IProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// 3. Create the model
const Product = models.Product || model<IProductDocument>("Product", ProductSchema);

export default Product;