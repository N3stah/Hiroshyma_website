"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { getPortfolioPage, type PortfolioItem } from "@/lib/api";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "apparel", label: "Apparel" },
  { value: "branding", label: "Branding & Logo" },
  { value: "printing", label: "Printing" },
];

export default function PortfolioPage() {
  const [category, setCategory] = useState("");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadFirstPage = useCallback(async (cat: string) => {
    setLoading(true);
    try {
      const page = await getPortfolioPage(cat || undefined);
      setItems(page.results);
      setNextCursor(page.next);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    try {
      const page = await getPortfolioPage(nextCursor);
      setItems((prev) => [...prev, ...page.results]);
      setNextCursor(page.next);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading]);

  useEffect(() => {
    setItems([]);
    setNextCursor(null);
    setInitialized(false);
    loadFirstPage(category);
  }, [category, loadFirstPage]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: "var(--hiro-accent)" }}>
          Our Work
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: "var(--hiro-text)" }}>
          Portfolio
        </h1>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => {
          const active = category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
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

      {initialized && items.length === 0 && (
        <div
          className="text-center py-20"
          style={{ border: "1px solid var(--hiro-border)" }}
        >
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--hiro-muted)" }}>
            No portfolio items in this category yet
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {items.map((item) => (
          <div key={item.id} className="group">
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{ backgroundColor: "var(--hiro-surface)" }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--hiro-border)" }}>
                    No image
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--hiro-text)" }}>
              {item.title}
            </p>
            {item.client_name && (
              <p className="text-[10px] mt-0.5" style={{ color: "var(--hiro-muted)" }}>
                for {item.client_name}
              </p>
            )}
          </div>
        ))}
      </div>

      <div ref={observerRef} className="h-10" />
      {loading && (
        <p className="text-center py-6 text-xs uppercase tracking-widest" style={{ color: "var(--hiro-muted)" }}>
          Loading...
        </p>
      )}
    </div>
  );
}
