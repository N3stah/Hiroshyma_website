"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const CATEGORIES = [
  { slug: "", label: "All" },
  { slug: "t-shirts", label: "T-Shirts" },
  { slug: "jackets", label: "Jackets" },
  { slug: "caps", label: "Caps" },
  { slug: "trousers", label: "Trousers" },
  { slug: "jorts", label: "Jorts" },
];

const inputCls =
  "w-full md:w-72 px-3 py-2 text-sm focus:outline-none transition-colors";

export default function ShopFilters({
  currentCategory,
  currentSearch,
}: {
  currentCategory: string;
  currentSearch: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  // Update URL with debounce when the search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (currentCategory) params.set("category", currentCategory);
      if (search) params.set("q", search);
      const qs = params.toString();
      router.push(`/shop${qs ? "?" + qs : ""}`);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function setCategory(slug: string) {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (search) params.set("q", search);
    const qs = params.toString();
    router.push(`/shop${qs ? "?" + qs : ""}`);
  }

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className={inputCls}
        style={{
          backgroundColor: "var(--hiro-surface)",
          border: "1px solid var(--hiro-border)",
          color: "var(--hiro-text)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--hiro-accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hiro-border)")}
      />

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const active = currentCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              className="px-4 py-1.5 text-[10px] uppercase tracking-widest transition-colors"
              style={{
                border: `1px solid ${active ? "var(--hiro-accent)" : "var(--hiro-border)"}`,
                color: active ? "var(--hiro-accent)" : "var(--hiro-muted)",
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
