// src/app/components/client/ProductList.tsx
import { getProducts } from "@/actions/productActions";
import ProductCard from "./ProductCard";
import { IProduct } from "@/lib/models/Product";
import Link from "next/link";

export default async function ProductList({ 
  currentPage, query, category 
}: { 
  currentPage: number; query: string; category: string 
}) {
  const { products, totalPages } = await getProducts(currentPage, query, category);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
        {products.length > 0 ? (
          products.map((product: IProduct) => (
            <ProductCard key={product._id.toString()} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-500">
            No products found matching &quot;{query || category}&quot;
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2 pt-8 border-t border-slate-800">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const params = new URLSearchParams();
            params.set("page", pageNum.toString());
            if (query) params.set("query", query);
            if (category) params.set("category", category);

            return (
              <Link
                key={pageNum}
                href={`/client-dashboard?${params.toString()}`}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                  currentPage === pageNum 
                  ? "bg-cyan-600 text-white shadow-lg" 
                  : "bg-slate-800 text-slate-500 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

// THE SKELETON (What users see while waiting)
export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-80 w-full bg-slate-800/50 animate-pulse rounded-[2rem]" />
      ))}
    </div>
  );
}