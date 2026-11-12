"use client";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { ProductListItem } from "@/lib/api";

export default function ShopCatalog({ products, initialCategory }: { products: ProductListItem[]; initialCategory: string }) {
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      if (!seen.has(p.category_slug)) seen.set(p.category_slug, p.category_name);
    }
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [products]);

  const [active, setActive] = useState(categories.some((c) => c.slug === initialCategory) ? initialCategory : "");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => (!active || p.category_slug === active) && (!q || p.name.toLowerCase().includes(q)));
  }, [products, active, query]);

  function choose(slug: string) {
    setActive(slug);
    window.history.replaceState(null, "", slug ? `/shop?category=${slug}` : "/shop");
  }

  const pills = [{ slug: "", name: "All", count: products.length }, ...categories.map((c) => ({ ...c, count: products.filter((p) => p.category_slug === c.slug).length }))];

  return (
    <div>
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." aria-label="Search products" className="w-full md:w-72 px-3 py-2 text-sm focus:outline-none" style={{ backgroundColor: "var(--hiro-surface)", border: "1px solid var(--hiro-border)", color: "var(--hiro-text)" }} />
      <div className="flex gap-2 flex-wrap mt-4">
        {pills.map((c) => (
          <button key={c.slug || "all"} onClick={() => choose(c.slug)} aria-pressed={active === c.slug} className="px-4 py-1.5 text-[10px] uppercase tracking-widest transition-colors" style={{ border: `1px solid ${active === c.slug ? "var(--hiro-cyber)" : "var(--hiro-border)"}`, color: active === c.slug ? "var(--hiro-cyber)" : "var(--hiro-muted)" }}>{c.name} ({c.count})</button>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="text-center py-20 mt-8" style={{ border: "1px solid var(--hiro-border)" }}><p className="text-xs uppercase tracking-widest" style={{ color: "var(--hiro-muted)" }}>No products found</p></div>
      ) : (
        <div key={`${active}|${query}`} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
          {visible.map((product, i) => (
            <div key={product.id} className="reveal-card" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}><ProductCard product={product} /></div>
          ))}
        </div>
      )}
    </div>
  );
}
