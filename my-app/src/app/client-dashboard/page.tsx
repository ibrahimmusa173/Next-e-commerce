// src/app/client-dashboard/page.tsx
import Link from "next/link";
import Image from "next/image"; // Imported optimized Image component
import { getProducts } from "@/actions/productActions";
import { IProduct } from "@/lib/models/Product"; // Imported Product interface

// Defined strict Document type extending your schema interface for Mongo IDs
interface IProductDoc extends IProduct {
  _id: string;
}

export default async function ClientDashboard({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const { products, totalPages } = await getProducts(currentPage);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Changed 'any' type to 'IProductDoc' */}
        {products.map((product: IProductDoc) => (
          <Link href={`/client-dashboard/${product._id}`} key={product._id}>
            <div className="border p-4 rounded hover:shadow-md transition">
              {/* Replaced <img> with optimized Next.js <Image /> */}
              <div className="relative h-40 w-full mb-2">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover rounded" 
                  unoptimized
                />
              </div>
              <h2 className="text-xl font-bold mt-2">{product.name}</h2>
              <p className="text-blue-600 font-semibold">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link 
            key={i + 1} 
            href={`/client-dashboard?page=${i + 1}`}
            className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-black text-white' : ''}`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
}
