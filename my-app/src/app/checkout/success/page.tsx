// src/app/checkout/success/page.tsx
import Link from "next/link"; // 1. Import Link component

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] text-center shadow-2xl">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">Payment Successful!</h1>
        <p className="text-slate-400 mb-8">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
        
        {/* 2. Replace <a> with <Link> */}
        <Link 
          href="/client-dashboard" 
          className="text-white bg-slate-800 px-6 py-3 rounded-xl hover:bg-slate-700 transition-all inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}