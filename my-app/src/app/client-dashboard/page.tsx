// src/app/client-dashboard/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/actions/productActions";
import { IProduct } from "@/lib/models/Product"; // Ensure this path matches your model folder

// Logic: Strictly define the props for Next.js 15 (searchParams is a Promise)
interface DashboardProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ClientDashboard({ searchParams }: DashboardProps) {
  // 1. Resolve searchParams and get current page
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  // 2. Fetch products and total page count from MongoDB
  const { products, totalPages } = await getProducts(currentPage);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Product Catalog</h1>

        {/* 3. The Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: IProduct) => (
            <Link 
              href={`/client-dashboard/${product._id}`} 
              key={product._id.toString()}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200"
            >
              <div className="relative h-64 w-full bg-slate-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized // Required for Base64 images
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">
                  {product.category}
                </span>
                <h2 className="text-xl font-bold text-slate-800 mt-1 truncate">
                  {product.name}
                </h2>
                <p className="text-2xl font-black text-slate-900 mt-2">
                  ${product.price.toLocaleString()}
                </p>
                <div className="w-full mt-4 text-center bg-slate-900 text-white py-2 rounded-lg font-medium group-hover:bg-cyan-600 transition-colors">
                  View Full Details
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 4. Pagination Logic */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-3">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <Link
                  key={pageNum}
                  href={`/client-dashboard?page=${pageNum}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${
                    isActive 
                    ? "bg-cyan-600 text-white shadow-lg" 
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}