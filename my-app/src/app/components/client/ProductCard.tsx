// src/components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/lib/models/Product";

export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link 
      href={`/client-dashboard/${product._id}`} 
      className="group bg-slate-950/40 rounded-[2rem] overflow-hidden border border-slate-800 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/60 flex flex-col"
    >
      {/* Smaller Image Container (h-40 instead of h-64) */}
      <div className="relative h-40 w-full p-4 border-b border-slate-800/50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">
          {product.category}
        </span>
        
        <h2 className="text-lg font-medium text-slate-200 line-clamp-1 mb-2">
          {product.name}
        </h2>
        
        <p className="text-xl font-bold text-white mt-auto">
          ${product.price.toLocaleString()}
        </p>

        <div className="mt-4 w-full text-center bg-cyan-600/10 border border-cyan-600/20 group-hover:bg-cyan-600 text-cyan-400 group-hover:text-white py-2 rounded-xl text-sm font-semibold transition-all">
          View Details
        </div>
      </div>
    </Link>
  );
}