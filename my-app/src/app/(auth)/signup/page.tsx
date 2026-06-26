import Link from "next/link";
import { signupAction } from "@/actions/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SignupPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-2 text-3xl font-semibold text-white">Create account</h1>
        
        {error && <p className="mb-4 p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-sm text-red-300">{error}</p>}

        <form action={signupAction} className="space-y-4">
          <input name="username" placeholder="Username" required className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
          <input name="name" placeholder="Full Name" required className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
          <input name="password" type="password" placeholder="Password" required className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none" />
          
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="isAdmin" className="h-4 w-4 rounded border-slate-600 bg-slate-800" />
            Create as Administrator
          </label>

          <button type="submit" className="w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-cyan-400 hover:underline">Sign in</Link>
        </p>
      </section>
    </main>
  );
}