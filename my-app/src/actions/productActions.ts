// src/actions/productActions.ts
"use server";

import { PipelineStage } from "mongoose";
import connectDB from "@/lib/mongoose";
import Product, { IProduct } from "@/lib/models/Product";
import { revalidatePath } from "next/cache";

// 1. Interfaces
interface ActionResponse {
  success: boolean;
  error?: string;
}

interface PaginatedProducts {
  products: IProduct[];
  totalPages: number;
}

// Custom interface for Atlas Search to avoid using 'any'
interface AtlasSearchStage {
  $search: {
    index: string;
    text: {
      query: string;
      path: string;
      fuzzy?: { maxEdits: number };
    };
  };
}

// 2. Add Product Action
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Upload Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

// 3. Get Products Action (with Search)
export async function getProducts(page: number = 1, query: string = ""): Promise<PaginatedProducts> {
  try {
    await connectDB();
    const limit = 9;
    const skip = (page - 1) * limit;

    if (query.trim()) {
      // We define the pipeline using a Union type to satisfy ESLint
      const pipeline: (PipelineStage | AtlasSearchStage)[] = [
        {
          $search: {
            index: "default",
            text: {
              query: query,
              path: "name",
              fuzzy: { maxEdits: 1 },
            },
          },
        },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }],
          },
        },
      ];

      // We cast the aggregate result to a specific structure
      const result = await Product.aggregate<{
        metadata: { total: number }[];
        data: IProduct[];
      }>(pipeline);

      const products = result[0]?.data || [];
      const totalCount = result[0]?.metadata[0]?.total || 0;

      return {
        products: JSON.parse(JSON.stringify(products)) as IProduct[],
        totalPages: Math.ceil(totalCount / limit),
      };
    } else {
      // Normal fetch
      const products = await Product.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await Product.countDocuments();

      return {
        products: JSON.parse(JSON.stringify(products)) as IProduct[],
        totalPages: Math.ceil(totalCount / limit),
      };
    }
  } catch (error: unknown) {
    console.error("Fetch Error:", error instanceof Error ? error.message : "Unknown error");
    return { products: [], totalPages: 0 };
  }
}

// 4. Get Product By ID Action
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