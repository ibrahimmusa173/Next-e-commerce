// src/app/client-dashboard/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/actions/productActions";

interface DetailProps {
  params: { id: string };
}

export default async function ProductDetailsPage({ params }: DetailProps) {
  const product = await getProductById(params.id);

  if (!product) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-white p-6 md:p-20">
      <div className="max-w-6xl mx-auto">
        <Link href="/client-dashboard" className="text-cyan-600 hover:underline mb-8 inline-block font-medium">
          ← Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
          {/* Image Section */}
          <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Content Section */}
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

            <button className="mt-12 w-full md:w-max px-12 py-4 bg-cyan-600 text-white rounded-2xl font-bold text-xl hover:bg-cyan-700 hover:-translate-y-1 transition-all shadow-xl shadow-cyan-100">
              Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}