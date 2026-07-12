// src/app/client-dashboard/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/actions/productActions";

interface DashboardProps {
  searchParams: { page?: string };
}

export default async function ClientDashboard({ searchParams }: DashboardProps) {
  // Logic: Default to page 1 if no parameter is provided
  const currentPage = Number(searchParams.page) || 1;
  const { products, totalPages } = await getProducts(currentPage);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>

        {/* 9 Product Grid (3 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link 
              href={`/client-dashboard/${product._id}`} 
              key={product._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="relative h-64 w-full bg-gray-200">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
                  {product.category}
                </span>
                <h2 className="text-xl font-bold text-gray-800 mt-1 truncate">
                  {product.name}
                </h2>
                <p className="text-2xl font-black text-gray-900 mt-2">
                  ${product.price.toLocaleString()}
                </p>
                <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg font-medium group-hover:bg-cyan-600 transition-colors">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Logic */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <Link
                  key={pageNum}
                  href={`/client-dashboard?page=${pageNum}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                    isActive 
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
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