"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Added for redirection
import { addProduct } from "@/actions/productActions";

export default function AddProductPage() {
  const [imageString, setImageString] = useState<string>("");
  const router = useRouter(); // Initialize router

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageString(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40">
        
        {/* Header with Back Link */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-white">Upload New Product</h1>
            <Link href="/admin-dashboard" className="text-sm text-cyan-400 hover:underline">
              ← Back to Dashboard
            </Link>
        </div>
        
        <div className="border-t border-slate-800 pt-8">
          <form 
            action={async (formData: FormData) => {
              formData.set("image", imageString); 
              const result = await addProduct(formData);
              if (result.success) {
                alert("Product and Image saved successfully!");
                router.push("/admin-dashboard"); // Redirect back to dashboard
              } else {
                alert("Error: " + result.error);
              }
            }} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Product Name" className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              <input name="price" type="number" step="0.01" placeholder="Price" className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>

            <input name="category" placeholder="Category" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Select Product Picture:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
                required 
              />
              
              {imageString && (
                <div className="mt-2 relative h-32 w-32">
                  <Image 
                    src={imageString} 
                    alt="Preview" 
                    fill 
                    className="object-cover rounded-lg border border-slate-700"
                    unoptimized 
                  />
                </div>
              )}
            </div>

            <textarea name="description" placeholder="Product Description" rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />

            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20">
              Save Product & Picture
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}