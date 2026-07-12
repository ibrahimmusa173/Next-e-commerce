// src/actions/productActions.ts
"use server"
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  await connectDB();
  
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as string; // Ideally an uploaded URL

  try {
    await Product.create({ name, price, description, category, image });
    revalidatePath("/client-dashboard");
    return { success: true };
   } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product" };
  }

}

export async function getProducts(page: number = 1) {
  await connectDB();
  const limit = 9;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Converts to plain JS objects

    const totalProducts = await Product.countDocuments();
    
    return {
      products: JSON.parse(JSON.stringify(products)), // Serialization fix for Next.js
      totalPages: Math.ceil(totalProducts / limit)
    };
    } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalPages: 0 };
  }
}

export async function getProductById(id: string) {
  await connectDB();
  const product = await Product.findById(id).lean();
  return JSON.parse(JSON.stringify(product));
}