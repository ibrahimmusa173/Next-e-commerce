import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40 text-center">
        <h1 className="text-3xl font-semibold text-white mb-8">Admin Dashboard</h1>
        
        <div className="mt-10 border-t border-slate-800 pt-10">
          <p className="text-slate-400 mb-6">Welcome back! Click the button below to start adding new items to your store.</p>
          
          <Link 
            href="/admin-dashboard/add-product" 
            className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-4 px-10 rounded-xl transition-all shadow-lg shadow-cyan-900/20"
          >
            + Add New Product
          </Link>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4">
            <Link href="/" className="inline-flex text-slate-500 hover:text-cyan-400 text-sm">
              Log out
            </Link>
        </div>
      </section>
    </main>
  );
}