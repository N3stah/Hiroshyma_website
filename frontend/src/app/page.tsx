import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/api";
import type { ProductListItem } from "@/lib/api";

function FeaturedCard({ product }: { product: ProductListItem }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: "var(--hiro-surface)" }}>
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--hiro-border)" }}>No image</span>
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute top-2 left-2 px-2 py-1 text-[10px] uppercase tracking-widest" style={{ backgroundColor: "rgba(13,13,13,0.85)", color: "var(--hiro-muted)" }}>
            Sold Out
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--hiro-muted)" }}>{product.category_name}</p>
        <p className="text-sm mt-0.5" style={{ color: "var(--hiro-text)" }}>{product.name}</p>
        <p className="text-xs mt-1" style={{ color: "var(--hiro-muted)" }}>KES {Number(product.price).toLocaleString()}</p>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  let featured: ProductListItem[] = [];
  try {
    featured = await getFeaturedProducts();
  } catch {
    // renders without featured section if API is unreachable
  }

  return (
    <>
      {/* Hero */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 text-center" style={{ borderBottom: "1px solid var(--hiro-border)" }}>
        <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: "var(--hiro-accent)" }}>
          Nairobi CBD &middot; Est. 2024
        </p>
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tight leading-none mb-6">
          <span style={{ color: "var(--hiro-text)" }}>Hiroshyma</span>
          <span className="block" style={{ color: "var(--hiro-accent)" }}>.Oyk</span>
        </h1>
        <p className="text-sm max-w-sm leading-relaxed mb-10" style={{ color: "var(--hiro-muted)" }}>
          Custom streetwear, graphic design, and printing. Built in Nairobi for those who refuse to blend in.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="btn-primary">Shop Now</Link>
          <Link href="/custom-order" className="btn-outline">Custom Order</Link>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: "var(--hiro-accent)" }}>Featured</p>
              <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: "var(--hiro-text)" }}>Selected Pieces</h2>
            </div>
            <Link href="/shop" className="text-[10px] uppercase tracking-widest link-muted">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((product) => (
              <FeaturedCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-16 px-4" style={{ borderTop: "1px solid var(--hiro-border)", borderBottom: "1px solid var(--hiro-border)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { label: "Custom Apparel", desc: "Round-neck tees, jackets, caps, jorts -- printed to order." },
            { label: "Graphic Design", desc: "Logos, cards, brand identities. Your vision, our craft." },
            { label: "Print Services", desc: "On-demand printing in Nairobi CBD. Fast turnaround." },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: "var(--hiro-accent)" }}>{item.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--hiro-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: "var(--hiro-muted)" }}>Something in mind?</p>
        <h2 className="text-2xl font-bold uppercase mb-8" style={{ color: "var(--hiro-text)" }}>Design it. Print it. Wear it.</h2>
        <Link href="/custom-order" className="btn-ghost">Start a Custom Order</Link>
      </section>
    </>
  );
}
