import Link from "next/link";
import { loginAction } from "@/actions/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const message = typeof params.message === "string" ? params.message : undefined;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-2 text-3xl font-semibold text-white">Sign in</h1>
        <p className="mb-6 text-slate-400">Enter your credentials to continue.</p>

        {error && <p className="mb-4 p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-sm text-red-300">{error}</p>}
        {message && <p className="mb-4 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-sm text-emerald-300">{message}</p>}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Username</label>
            <input name="username" required className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input name="password" type="password" required className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
          </div>
          <button type="submit" className="w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here? <Link href="/signup" className="text-cyan-400 hover:underline">Create account</Link>
        </p>

        <Link href="/forgot-password" className="text-xs text-cyan-400 hover:underline">Forgot password?</Link>
        
      </section>
    </main>
  );
}