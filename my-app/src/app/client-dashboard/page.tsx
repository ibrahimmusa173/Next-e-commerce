// src/app/client-dashboard/page.tsx
import Link from "next/link";
import { getProducts } from "@/actions/productActions";
import ProductCard from "@/app/components/client/ProductCard";
import Search from "@/app/components/client/Search";
import CategoryFilter from "@/app/components/client/CategoryFilter"; // Import here
import { IProduct } from "@/lib/models/Product";

interface DashboardProps {
  searchParams: Promise<{ page?: string; query?: string; category?: string }>;
}

export default async function ClientDashboard({ searchParams }: DashboardProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const query = resolvedParams.query || "";
  const category = resolvedParams.category || "";
  
  // Pass category to the updated server action
  const { products, totalPages } = await getProducts(currentPage, query, category);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10">
      <section className="mx-auto max-w-6xl rounded-[2.5rem] border border-slate-800 bg-slate-900/90 p-8 md:p-12 shadow-2xl shadow-slate-950/40">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-white">Client Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Manage and browse products</p>
          </div>
          
          <Search />

          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-all">
            Log Out
          </Link>
        </div>

        {/* Category Filter Component */}
        <CategoryFilter />

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

        {/* Updated Pagination to preserve category */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 pt-8 border-t border-slate-800">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              
              const params = new URLSearchParams();
              params.set("page", pageNum.toString());
              if (query) params.set("query", query);
              if (category) params.set("category", category);

              return (
                <Link
                  key={pageNum}
                  href={`/client-dashboard?${params.toString()}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                    isActive 
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/40" 
                    : "bg-slate-800 text-slate-500 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}