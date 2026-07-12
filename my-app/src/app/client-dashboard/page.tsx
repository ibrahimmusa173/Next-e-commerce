// src/app/client-dashboard/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/actions/productActions";

interface DetailProps {
  params: Promise<{ id: string }> | { id: string }; // Handles both Next 14 and 15
}

export default async function ProductDetailsPage({ params }: DetailProps) {
  // 1. Safely extract the ID
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // 2. Fetch the product
  const product = await getProductById(id);

  // 3. DEBUG: If not found, show the ID instead of 404
  if (!product) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Product Not Found!</h1>
        <p className="mt-4 text-gray-600">The route is working, but the ID <span className="font-mono bg-gray-100 p-1">{id}</span> does not exist in the database Vercel is connected to.</p>
        <Link href="/client-dashboard" className="text-cyan-600 underline mt-4 block">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6 md:p-20">
      <div className="max-w-6xl mx-auto">
        <Link href="/client-dashboard" className="text-cyan-600 hover:underline mb-8 inline-block font-medium">
          ← Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
          <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-cyan-600 font-bold tracking-widest uppercase text-sm">
              {product.category}
            </span>
            <h1 className="text-5xl font-black text-gray-900 mt-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-4xl font-light text-gray-500 mt-4">
              ${product.price.toLocaleString()}
            </p>
            
            <div className="mt-10 pt-10 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
            
            <button className="mt-12 px-12 py-4 bg-cyan-600 text-white rounded-2xl font-bold text-xl hover:bg-cyan-700 transition-all">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}