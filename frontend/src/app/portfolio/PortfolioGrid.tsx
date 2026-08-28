"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { getPortfolioPage, type PortfolioItem } from "@/lib/api";
import Lightbox from "./Lightbox";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "apparel", label: "Apparel" },
  { value: "branding", label: "Branding & Logo" },
  { value: "printing", label: "Printing" },
];

export default function PortfolioGrid({
  initialItems,
  initialNextCursor,
}: {
  initialItems: PortfolioItem[];
  initialNextCursor: string | null;
}) {
  const [category, setCategory] = useState("");
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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
    <div>
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => {
          const active = category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className="px-4 py-1.5 text-[10px] uppercase tracking-widest transition-colors"
              style={{
                border: `1px solid ${active ? "var(--hiro-cyber)" : "var(--hiro-border-dim)"}`,
                color: active ? "var(--hiro-cyber)" : "var(--hiro-muted)",
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-20" style={{ border: "1px solid var(--hiro-border-dim)" }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--hiro-muted)" }}>
            No portfolio items in this category yet
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group text-left"
          >
            <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: "var(--hiro-surface)" }}>
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
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--hiro-border-dim)" }}>No image</span>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--hiro-text)" }}>{item.title}</p>
            {item.client_name && (
              <p className="text-[10px] mt-0.5" style={{ color: "var(--hiro-muted)" }}>for {item.client_name}</p>
            )}
          </button>
        ))}
      </div>

      <div ref={observerRef} className="h-10" />
      {loading && (
        <p className="text-center py-6 text-xs uppercase tracking-widest" style={{ color: "var(--hiro-muted)" }}>Loading...</p>
      )}

      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
