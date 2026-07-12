// src/app/client-dashboard/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/actions/productActions";

interface DashboardProps {
  searchParams: Promise<{ page?: string }> | { page?: string };
}

export default async function ClientDashboard({ searchParams }: DashboardProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const { products } = await getProducts(currentPage);

  return (
    <main className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link 
              href={`/client-dashboard/${product._id}`} 
              key={product._id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border"
            >
              <div className="relative h-64 w-full">
                <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-cyan-600 font-bold text-lg">${product.price}</p>
                <div className="mt-4 text-sm bg-gray-100 p-2 text-center rounded">View Details</div>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination bar remains the same... */}
      </div>
    </main>
  );
}