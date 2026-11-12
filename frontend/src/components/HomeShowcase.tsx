"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/lib/api";
import { whatsappLink, productOrderMessage } from "@/lib/whatsapp";

const INTERVAL_MS = 4000;

export default function HomeShowcase({ products }: { products: ProductListItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = products.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const autoplay = !paused && !reduceMotion && count > 1;

  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(next, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [autoplay, index, next]);

  if (count === 0) return null;
  const p = products[index];

  return (
    <section className="relative overflow-hidden" style={{ borderTop: "1px solid var(--hiro-border-dim)", borderBottom: "1px solid var(--hiro-border-dim)", backgroundColor: "#000" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured products">
      <div className="absolute inset-0" aria-hidden="true">
        <div key={p.id} className="absolute inset-0 reveal-card">{p.thumbnail && <Image src={p.thumbnail} alt="" fill sizes="25vw" className="object-cover scale-125 blur-3xl opacity-30" />}</div>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(var(--hiro-border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--hiro-border-dim) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #000 0%, transparent 25%, transparent 75%, #000 100%)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] mb-1" style={{ color: "var(--hiro-cyber)" }}>The Drop</p>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide" style={{ color: "var(--hiro-text)" }}>On the Rack</h2>
          </div>
          <Link href="/shop" className="text-[10px] uppercase tracking-widest link-muted">View All &rarr;</Link>
        </div>

        <div key={p.id} className="reveal-card grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <Link href={`/shop/${p.slug}`} className="relative block aspect-[3/4] w-full max-w-sm mx-auto md:mx-0" style={{ border: "3px solid var(--hiro-border)", backgroundColor: "var(--hiro-surface)" }}>
            {p.thumbnail && <Image src={p.thumbnail} alt={p.name} fill sizes="(max-width: 768px) 80vw, 384px" className="object-cover" priority={index === 0} />}
          </Link>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--hiro-cyber)" }}>{p.category_name}</p>
            <h3 className="font-display text-3xl md:text-4xl font-black uppercase leading-tight mb-3" style={{ color: "var(--hiro-text)" }}>{p.name}</h3>
            <div className="ornament-divider my-4" />
            <p className="text-lg mb-8" style={{ color: "var(--hiro-text)" }}>KES {Number(p.price).toLocaleString()}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/shop/${p.slug}`} className="btn-primary text-center">View Piece</Link>
              <a href={whatsappLink(productOrderMessage(p.name, p.slug, p.price))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 whatsapp-btn">Order on WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10">
          <div className="flex items-center gap-2" role="group" aria-label="Choose product">
            {products.map((item, i) => (
              <button key={item.id} onClick={() => setIndex(i)} aria-label={`Show ${item.name}`} aria-current={i === index} className="h-2 transition-all" style={{ width: i === index ? 32 : 12, backgroundColor: i === index ? "var(--hiro-cyber)" : "var(--hiro-border-dim)" }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest mr-3" style={{ color: "var(--hiro-muted)" }}>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
            <button onClick={prev} aria-label="Previous product" className="px-3 py-1 text-sm cyber-glow brutal-border" style={{ color: "var(--hiro-text)" }}>&larr;</button>
            <button onClick={next} aria-label="Next product" className="px-3 py-1 text-sm cyber-glow brutal-border" style={{ color: "var(--hiro-text)" }}>&rarr;</button>
          </div>
        </div>
        {autoplay && <div key={`bar-${index}`} className="mt-4 h-px progress-bar" style={{ backgroundColor: "var(--hiro-cyber)" }} />}
      </div>
    </section>
  );
}
