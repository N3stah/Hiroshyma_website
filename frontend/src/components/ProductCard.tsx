import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/lib/api";

export default function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{ backgroundColor: "var(--hiro-surface)" }}
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--hiro-border)" }}>
              No image
            </span>
          </div>
        )}
        {!product.in_stock && (
          <span
            className="absolute top-2 left-2 px-2 py-1 text-[10px] uppercase tracking-widest"
            style={{ backgroundColor: "rgba(13,13,13,0.85)", color: "var(--hiro-muted)" }}
          >
            Sold Out
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--hiro-muted)" }}>
          {product.category_name}
        </p>
        <p className="text-sm mt-0.5" style={{ color: "var(--hiro-text)" }}>
          {product.name}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--hiro-muted)" }}>
          KES {Number(product.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
