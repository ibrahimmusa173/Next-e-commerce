// src/app/client-dashboard/[id]/page.tsx
import { getProductById } from "@/actions/productActions";
import Image from "next/image";

export default async function ProductDetails({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-10 flex flex-col md:flex-row gap-10">
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
      <div>
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-gray-500 mt-2">Category: {product.category}</p>
        <p className="text-2xl text-green-600 font-bold mt-4">${product.price}</p>
        <div className="mt-6">
          <h3 className="font-bold">Description:</h3>
          <p className="text-gray-700 mt-2">{product.description}</p>
        </div>
      </div>
    </div>
  );
}