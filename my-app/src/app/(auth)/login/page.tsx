import Link from "next/link";
import { loginAction, loginWithGoogle } from "@/actions/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const message = typeof params.message === "string" ? params.message : undefined;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-2 text-3xl font-semibold text-white">Sign in</h1>
        <p className="mb-6 text-slate-400">Enter your credentials or use social sign-in to continue.</p>

        {/* Status Alerts */}
        {error && (
          <p className="mb-4 p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-sm text-red-300">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-4 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-sm text-emerald-300">
            {message}
          </p>
        )}

        {/* Credentials Form */}
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Username</label>
            <input
              name="username"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500 transition"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500 transition"
            />
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-cyan-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition"
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-between text-xs text-slate-500 uppercase tracking-wider before:h-[1px] before:w-1/4 before:bg-slate-800 after:h-[1px] after:w-1/4 after:bg-slate-800">
          Or continue with
        </div>

        {/* Google Authentication Form */}
        <form action={loginWithGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 shadow-sm hover:bg-slate-700 transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 15.02 1 12 1 7.21 1 3.16 3.76 1.22 7.78l3.81 2.95C5.93 7.33 8.73 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.48z"
              />
              <path
                fill="#FBBC05"
                d="M5.03 14.73c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3L1.22 7.18C.44 8.74 0 10.49 0 12.33c0 1.84.44 3.59 1.22 5.15l3.81-2.75z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.32 1.09-4.3 1.09-3.27 0-6.07-2.29-7.05-5.69L1.14 15.4C3.08 19.42 7.13 23 12 23z"
              />
            </svg>
            Google
          </button>
        </form>

        {/* Sign Up Navigation */}
        <p className="mt-8 text-center text-sm text-slate-400">
          New here?{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}
