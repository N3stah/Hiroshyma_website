import Link from "next/link";
import { getAllProducts } from "@/lib/catalog";
import type { ProductListItem } from "@/lib/api";
import HomeShowcase from "@/components/HomeShowcase";

export default async function HomePage() {
  let showcase: ProductListItem[] = [];
  try {
    const all = await getAllProducts(8000);
    showcase = all.filter((p) => p.thumbnail).sort((a, b) => Number(b.is_featured) - Number(a.is_featured)).slice(0, 8);
  } catch {
    // The page still renders without the slideshow if the API is waking up
  }

  return (
    <>
      <section className="scanlines min-h-[90vh] flex flex-col items-center justify-center px-4 text-center" style={{ borderBottom: "1px solid var(--hiro-border-dim)" }}>
        <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: "var(--hiro-cyber)" }}>Nairobi CBD &middot; Custom Streetwear</p>
        <h1 className="font-display text-6xl md:text-9xl font-black uppercase tracking-tight leading-none mb-6">
          <span style={{ color: "var(--hiro-text)" }}>Hiroshyma</span>
          <span className="block" style={{ color: "var(--hiro-cyber)" }}>.Oyk</span>
        </h1>
        <p className="text-sm max-w-sm leading-relaxed mb-10" style={{ color: "var(--hiro-muted)" }}>Custom streetwear, graphic design, and printing. Built in Nairobi for those who refuse to blend in.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="btn-primary">Shop Now</Link>
          <Link href="/custom-order" className="btn-outline">Custom Order</Link>
        </div>
      </section>

      <HomeShowcase products={showcase} />

      <section className="py-16 px-4" style={{ borderBottom: "1px solid var(--hiro-border-dim)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { label: "Custom Apparel", desc: "Round-neck tees, jackets, caps, jorts, printed to order." },
            { label: "Graphic Design", desc: "Logos, cards, brand identities. Your vision, our craft." },
            { label: "Print Services", desc: "On-demand printing in Nairobi CBD." },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: "var(--hiro-cyber)" }}>{item.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--hiro-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: "var(--hiro-muted)" }}>Something in mind?</p>
        <h2 className="font-display text-2xl font-bold uppercase mb-8" style={{ color: "var(--hiro-text)" }}>Design it. Print it. Wear it.</h2>
        <Link href="/custom-order" className="btn-ghost">Start a Custom Order</Link>
      </section>
    </>
  );
}
