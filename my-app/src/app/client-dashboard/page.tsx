// src/app/client-dashboard/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/actions/productActions";
import { IProduct } from "@/lib/models/Product"; 

interface DashboardProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ClientDashboard({ searchParams }: DashboardProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const { products, totalPages } = await getProducts(currentPage);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Styled Title */}
        <h1 className="text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">
          <span className="text-blue-600">Beautiful</span> Client Dashboard
        </h1>

        {/* Improved Grid: 4 columns on large screens makes cards smaller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: IProduct) => (
            <Link 
              href={`/client-dashboard/${product._id}`} 
              key={product._id.toString()}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col"
            >
              {/* Fixed Image Container: object-contain shows the FULL picture */}
              <div className="relative h-48 w-full bg-white p-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>

              <div className="p-4 flex flex-col flex-grow border-t border-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                
                <h2 className="text-lg font-bold text-slate-800 line-clamp-1">
                  {product.name}
                </h2>
                
                <p className="text-xl font-black text-slate-900 mt-2">
                  ${product.price.toLocaleString()}
                </p>

                <div className="mt-4 w-full text-sm bg-slate-900 text-white py-2 rounded-lg font-bold group-hover:bg-blue-600 transition-colors text-center">
                  View Full Details
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <Link
                  key={pageNum}
                  href={`/client-dashboard?page=${pageNum}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                    isActive 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
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