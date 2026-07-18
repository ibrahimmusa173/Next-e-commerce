// src/app/components/client/CategoryFilter.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["cars", "books", "furniture", "houses"];

export default function CategoryFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const activeCategory = searchParams.get("category");

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (activeCategory === category) {
      params.delete("category"); // Toggle off if clicking the same one
    } else {
      params.set("category", category);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.delete("category");
          replace(`${pathname}?${params.toString()}`);
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
          !activeCategory
            ? "bg-cyan-600 border-cyan-500 text-white"
            : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryClick(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border ${
            activeCategory === cat
              ? "bg-cyan-600 border-cyan-500 text-white"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}