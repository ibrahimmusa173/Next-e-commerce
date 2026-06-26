import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl text-center">
        <h1 className="mb-4 text-4xl font-semibold text-white">Next E-Commerce</h1>
        <p className="mb-8 text-slate-400">Secure Authentication with MongoDB Atlas</p>
        <div className="flex flex-col gap-3">
          <Link href="/signup" className="rounded-full bg-cyan-500 px-5 py-3 text-lg font-semibold text-slate-950 hover:bg-cyan-400">
            Get Started
          </Link>
          <Link href="/login" className="rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-lg font-semibold hover:bg-slate-700">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}