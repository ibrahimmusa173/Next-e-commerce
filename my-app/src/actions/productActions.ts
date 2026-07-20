// src/actions/productActions.ts
"use server";

import { PipelineStage } from "mongoose";
import connectDB from "@/lib/mongoose";
import Product, { IProduct } from "@/lib/models/Product";
import { revalidatePath, unstable_cache } from "next/cache";

// 1. Interfaces
interface ActionResponse {
  success: boolean;
  error?: string;
}

interface PaginatedProducts {
  products: IProduct[];
  totalPages: number;
}

interface AtlasSearchStage {
  $search: {
    index: string;
    compound: {
      must: Array<{
        text: {
          query: string;
          path: string;
          fuzzy?: { maxEdits: number };
        };
      }>;
      filter?: Array<{
        text: {
          query: string;
          path: string;
        };
      }>;
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

    // Automatically purges the network data caches on new upload
    revalidatePath("/client-dashboard");
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Upload Error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Internal worker function to query MongoDB cluster
async function fetchProductsFromDB(
  page: number = 1,
  query: string = "",
  category: string = ""
): Promise<PaginatedProducts> {
  try {
    await connectDB();
    const limit = 9;
    const skip = (page - 1) * limit;

    if (query.trim()) {
      const mustMatch = [
        {
          text: {
            query: query,
            path: "name",
            fuzzy: { maxEdits: 1 },
          },
        },
      ];

      const filterMatch = category.trim() 
        ? [{ text: { query: category, path: "category" } }] 
        : undefined;

      const pipeline: (PipelineStage | AtlasSearchStage)[] = [
        {
          $search: {
            index: "default",
            compound: {
              must: mustMatch,
              ...(filterMatch && { filter: filterMatch }),
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
    } 
    else {
      const filterObj: { category?: string } = {};
      if (category.trim()) {
        filterObj.category = category;
      }

      const products = await Product.find(filterObj)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await Product.countDocuments(filterObj);

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

// 3. Cache-wrapped Get Products Action (Exposed to the frontend)
export const getProducts = unstable_cache(
  async (page: number = 1, query: string = "", category: string = "") => {
    return fetchProductsFromDB(page, query, category);
  },
  ["client-products-dashboard-cache"], 
  {
    revalidate: 60, // Caches search results on CDN edge for 60 seconds
    tags: ["products"]
  }
);

// 4. Get Product By ID Action
export async function getProductById(id: string): Promise<IProduct | null> {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return null;

    return JSON.parse(JSON.stringify(product)) as IProduct;
  } catch (error) {
    console.error(error);
    return null;
  }
}
