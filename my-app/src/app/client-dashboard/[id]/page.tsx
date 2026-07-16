// src/app/client-dashboard/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/actions/productActions";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* 1. Beautiful Background Decor (Subtle Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />

      <div className="z-10 max-w-4xl w-full">
        {/* Back Link */}
        <Link 
          href="/client-dashboard" 
          className="text-slate-400 hover:text-cyan-400 mb-6 inline-flex items-center gap-2 transition-colors font-medium text-sm"
        >
          <span className="text-lg">←</span> Back to Dashboard
        </Link>

        {/* 2. Main Dashboard-Style Container (Small/Compact Size) */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* 3. Image Container (Smaller size and styled) */}
            <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-slate-700 bg-slate-950/50 group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
            </div>

            {/* 4. Details Container */}
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.2em] bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-900/50">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-slate-500 text-sm">Tax included</span>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-800/60">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Description</h3>
                <p className="text-slate-400 leading-relaxed text-sm line-clamp-6">
                  {product.description}
                </p>
              </div>

              {/* Action Button */}
              <button className="mt-8 w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-bold text-md transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 active:scale-95">
                Add to Shopping Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}