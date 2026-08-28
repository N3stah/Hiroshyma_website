import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    const image = product.images[0]?.image;
    return {
      title: product.name,
      description: product.description.slice(0, 155),
      openGraph: {
        title: `${product.name} -- Hiroshyma.Oyk`,
        description: product.description.slice(0, 155),
        images: image ? [{ url: image, width: 800, height: 1000, alt: product.name }] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") notFound();
    throw err;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/shop" className="text-[10px] uppercase tracking-widest link-muted inline-block mb-8">
        &larr; Back to Shop
      </Link>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="grid grid-cols-2 gap-2">
          {product.images.length > 0 ? (
            product.images.map((img, i) => (
              <div key={i} className="relative aspect-square" style={{ backgroundColor: "var(--hiro-surface)", border: "3px solid var(--hiro-border)" }}>
                <Image src={img.image} alt={img.alt_text || product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" priority={i === 0} />
              </div>
            ))
          ) : (
            <div className="aspect-square col-span-2 flex items-center justify-center" style={{ backgroundColor: "var(--hiro-surface)", border: "3px solid var(--hiro-border)" }}>
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--hiro-border-dim)" }}>No images</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--hiro-cyber)" }}>{product.category.name}</p>
          <h1 className="font-display text-2xl font-bold uppercase mb-2" style={{ color: "var(--hiro-text)" }}>{product.name}</h1>
          <div className="ornament-divider my-4" />
          <p className="text-lg mb-6" style={{ color: "var(--hiro-text)", fontFamily: "var(--font-mono)" }}>
            KES {Number(product.price).toLocaleString()}
          </p>
          {product.available_sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--hiro-muted)" }}>Available Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {product.available_sizes.map((size) => (
                  <span key={size} className="px-3 py-1 text-xs cyber-glow" style={{ border: "1px solid var(--hiro-border-dim)", color: "var(--hiro-text)" }}>{size}</span>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--hiro-muted)" }}>{product.description}</p>
          {product.in_stock ? (
            <Link href={`/custom-order?ref=${product.slug}`} className="btn-primary">Enquire to Order</Link>
          ) : (
            <span className="inline-block px-8 py-3 text-xs uppercase tracking-widest" style={{ backgroundColor: "var(--hiro-surface)", color: "var(--hiro-muted)" }}>Sold Out</span>
          )}
        </div>
      </div>

      {/* JSON-LD structured data for Google Shopping */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images.map((img) => img.image),
            offers: {
              "@type": "Offer",
              priceCurrency: "KES",
              price: product.price,
              availability: product.in_stock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              seller: {
                "@type": "Organization",
                name: "Hiroshyma.Oyk",
              },
            },
          }),
        }}
      />
    </div>
  );
}
