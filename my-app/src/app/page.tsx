"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((prev) => prev + 1);
  }

  function decrement() {
    setCount((prev) => prev - 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40 backdrop-blur-sm">
        <h1 className="mb-4 text-4xl font-semibold text-white">Counter</h1>
        <p className="mb-8 text-lg text-slate-300">Current count: <span className="font-semibold text-cyan-300">{count}</span></p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={decrement}
            className="rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-xl font-semibold text-slate-100 transition hover:border-cyan-400 hover:bg-slate-700"
          >
            -
          </button>
          <button
            onClick={increment}
            className="rounded-full border border-cyan-400 bg-cyan-500 px-6 py-3 text-xl font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            +
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-red-400 hover:bg-slate-700"
          >
            Reset
          </button>
        </div>
      </section>
    </main>
  );
}