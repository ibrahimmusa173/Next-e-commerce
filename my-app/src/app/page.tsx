"use client";

import { useState } from "react";
import { signinAction, signupAction } from "./actions/auth";

async function handleSignin(formData: FormData) {
  await signinAction(formData);
}

async function handleSignup(formData: FormData) {
  await signupAction(formData);
}

export default function Home() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40 backdrop-blur-sm">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Welcome back</h1>
            <p className="mt-2 text-slate-400">Use the buttons below to login or sign up.</p>
          </div>
          <div className="flex gap-2 rounded-full border border-slate-800 bg-slate-950/80 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Signup
            </button>
          </div>
        </div>

        {mode === "login" ? (
          <form action={handleSignin} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Login</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Login
            </button>
          </form>
        ) : (
          <form action={handleSignup} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Signup</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Signup
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
