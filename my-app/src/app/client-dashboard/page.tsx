// src/app/client-dashboard/page.tsx
import Link from "next/link";
import { getProducts } from "@/actions/productActions";
import ProductCard from "@/app/components/client/ProductCard"; // Import the new component
import { IProduct } from "@/lib/models/Product";

interface DashboardProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ClientDashboard({ searchParams }: DashboardProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const { products, totalPages } = await getProducts(currentPage);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10">
      {/* MAIN ADMIN-STYLE CONTAINER */}
      <section className="mx-auto max-w-6xl rounded-[2.5rem] border border-slate-800 bg-slate-900/90 p-8 md:p-12 shadow-2xl shadow-slate-950/40">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-white">Client Dashboard</h1>
            
          </div>
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-all">
            Log Out
          </Link>
        </div>

        {/* Product Grid - 3 columns, smaller gap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
          {products.map((product: IProduct) => (
            <ProductCard key={product._id.toString()} product={product} />
          ))}
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 pt-8 border-t border-slate-800">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <Link
                  key={pageNum}
                  href={`/client-dashboard?page=${pageNum}`}
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