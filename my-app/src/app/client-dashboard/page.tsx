// src/app/client-dashboard/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import Search from "@/app/components/client/Search";
import CategoryFilter from "@/app/components/client/CategoryFilter";
import ProductList, { ProductListSkeleton } from "@/app/components/client/ProductList";

interface DashboardProps {
  searchParams: Promise<{ page?: string; query?: string; category?: string }>;
}

export default async function ClientDashboard({ searchParams }: DashboardProps) {
  // 1. Await the params
  const resolvedParams = await searchParams;
  
  // 2. Extract values with fallbacks to satisfy TypeScript
  const query = resolvedParams.query || "";
  const category = resolvedParams.category || "";
  const page = resolvedParams.page || "1";

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

        <CategoryFilter />

        {/* 
           3. Use the extracted variables here. 
           The 'key' ensures Suspense triggers every time the URL changes.
        */}
        <Suspense 
          key={`${query}-${category}-${page}`} 
          fallback={<ProductListSkeleton />}
        >
          <ProductList 
            currentPage={Number(page)}
            query={query}
            category={category}
          />
        </Suspense>

      </section>
    </main>
  );
}