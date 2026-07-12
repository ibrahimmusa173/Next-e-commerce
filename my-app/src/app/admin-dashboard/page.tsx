// src/app/admin-dashboard/page.tsx
"use client" // Added this to handle the alert/client-side wrapper
import Link from "next/link";
import { addProduct } from "@/actions/productActions";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40">
        <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
        <p className="mt-3 text-slate-400">You are signed in as an administrator.</p>
        
        <div className="mt-10 border-t border-slate-800 pt-8">
          <h2 className="text-xl font-medium text-cyan-400 mb-6">Add New Product</h2>
          
          {/* WRAPPED ACTION TO FIX TYPESCRIPT ERROR */}
          <form 
            action={async (formData: FormData) => {
              const result = await addProduct(formData);
              if (result.success) {
                alert("Product Added Successfully!");
              } else {
                alert("Error: " + result.error);
              }
            }} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="name" 
                placeholder="Product Name" 
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white"
                required 
              />
              <input 
                name="price" 
                type="number" 
                step="0.01" 
                placeholder="Price" 
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white"
                required 
              />
            </div>

            <input 
              name="category" 
              placeholder="Category" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white"
              required 
            />

            <input 
              name="image" 
              placeholder="Image URL" 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white"
              required 
            />

            <textarea 
              name="description" 
              placeholder="Product Description" 
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500 text-white"
              required 
            />

            <button 
              type="submit" 
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20"
            >
              Save Product to Database
            </button>
          </form>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4">
            <Link href="/" className="inline-flex text-cyan-400 hover:text-cyan-300">
            Back to home
            </Link>
        </div>
      </section>
    </main>
  );
}