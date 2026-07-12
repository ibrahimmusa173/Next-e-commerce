// src/actions/productActions.ts
"use server"

import connectDB from "@/lib/mongoose";
import Product, { IProduct } from "@/lib/models/Product";
import { revalidatePath } from "next/cache";

// Define a strict interface for the response
interface ActionResponse {
  success: boolean;
  error?: string;
}

interface PaginatedProducts {
  products: IProduct[];
  totalPages: number;
}

export async function addProduct(formData: FormData): Promise<ActionResponse> {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;

    if (!image) {
      return { success: false, error: "Image is required" };
    }

    await Product.create({
      name,
      price,
      category,
      description,
      image,
    });

    revalidatePath("/client-dashboard");
    return { success: true };
  } catch (error: unknown) {
    // Logic: Handle errors without using 'any'
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Upload Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function getProducts(page: number = 1): Promise<PaginatedProducts> {
  try {
    await connectDB();
    const limit = 9;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Product.countDocuments();

    // Mongoose .lean() returns POJOs, but we sanitize _id for Next.js serialization
    const sanitizedProducts = JSON.parse(JSON.stringify(products)) as IProduct[];

    return {
      products: sanitizedProducts,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error: unknown) {
    console.error("Fetch Error:", error instanceof Error ? error.message : "Unknown error");
    return { products: [], totalPages: 0 };
  }
}

export async function getProductById(id: string): Promise<IProduct | null> {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product)) as IProduct;
  } catch (error: unknown) {
    console.error("Detail Error:", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}