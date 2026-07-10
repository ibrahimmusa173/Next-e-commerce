import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" />

      <section className="relative z-10 w-full max-w-2xl rounded-[2.5rem] border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 md:p-16 shadow-2xl text-center">
        {/* Badge */}
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-400/10 rounded-full border border-cyan-400/20">
          Powered by Next.js & MongoDB
        </div>

        {/* Hero Content */}
        <h1 className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight text-white">
          Next<span className="text-cyan-500 text-glow-cyan">Store</span>
        </h1>
        
        <p className="mb-10 text-lg md:text-xl text-slate-400 leading-relaxed max-w-md mx-auto">
          Experience the next generation of e-commerce. 
          Fast, secure, and designed for a premium shopping journey.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/signup" 
            className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-cyan-500 px-10 py-4 text-lg font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95"
          >
            Get Started
          </Link>
          
          <Link 
            href="/login" 
            className="w-full sm:w-auto rounded-full border border-slate-700 bg-slate-800/50 px-10 py-4 text-lg font-bold transition-all hover:bg-slate-800 hover:border-slate-500 active:scale-95"
          >
            Sign In
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 grid grid-cols-2 gap-4">
          <div className="text-left">
            <h3 className="text-sm font-semibold text-slate-300">Fast Shipping</h3>
            <p className="text-xs text-slate-500">Global delivery in 3-5 days</p>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-slate-300">Secure Payments</h3>
            <p className="text-xs text-slate-500">Encrypted transactions</p>
          </div>
        </div>
      </section>
    </main>
  );
}