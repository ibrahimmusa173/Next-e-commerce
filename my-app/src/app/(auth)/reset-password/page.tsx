import { resetPasswordAction } from "@/actions/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const token = params.token as string;
  const email = params.email as string;

  if (!token || !email) {
    return <div className="text-white text-center p-20">Invalid Reset Link.</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-2 text-3xl font-semibold text-white">Set New Password</h1>
        <p className="mb-6 text-slate-400">Enter your new secure password below.</p>

        <form action={resetPasswordAction} className="space-y-4">
          {/* Hidden inputs to pass data back to the server action */}
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email} />

          <div>
            <label className="mb-2 block text-sm text-slate-300">New Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-cyan-500 transition" 
            />
          </div>
          
          <button type="submit" className="w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition">
            Update Password
          </button>
        </form>
      </section>
    </main>
  );
}