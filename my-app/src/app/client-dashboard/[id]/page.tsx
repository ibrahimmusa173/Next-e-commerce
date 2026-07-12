import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/actions/productActions";

// Logic: We must define the Props specifically for Next.js 15
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  // 1. Await the params to get the ID (Required in Next.js 15)
  const { id } = await params;

  // 2. Fetch the data from MongoDB
  const product = await getProductById(id);

  // 3. If the DB returns null, trigger the 404 explicitly
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/client-dashboard" className="text-cyan-600 hover:text-cyan-700 mb-8 inline-block font-medium">
          ← Back to Catalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Image container */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl border">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Details container */}
          <div className="flex flex-col justify-start py-4">
            <span className="text-sm font-bold text-cyan-600 uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-slate-500 mt-4">
              ${product.price.toLocaleString()}
            </p>
            
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Description</h3>
              <p className="mt-4 text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <button className="mt-12 w-full bg-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 transition-all shadow-lg">
              Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}