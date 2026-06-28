import Link from "next/link";
import { forgotPasswordAction } from "@/actions/auth";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-2 text-3xl font-semibold text-white">Forgot Password</h1>
        <p className="mb-6 text-slate-400">Enter your email and well send you a reset link.</p>

        <form action={forgotPasswordAction} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="name@example.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500 transition" 
            />
          </div>
          <button type="submit" className="w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition">
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Remembered your password? <Link href="/login" className="text-cyan-400 hover:underline">Back to Sign in</Link>
        </p>
      </section>
    </main>
  );
}