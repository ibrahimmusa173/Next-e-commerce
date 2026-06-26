import Link from "next/link";

export default function ClientDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40">
        <h1 className="text-3xl font-semibold text-white">Client Dashboard</h1>
        <p className="mt-3 text-slate-400">You are signed in successfully.</p>
        <Link href="/" className="mt-6 inline-flex text-cyan-400 hover:text-cyan-300">
          Back to home
        </Link>
      </section>
    </main>
  );
}
