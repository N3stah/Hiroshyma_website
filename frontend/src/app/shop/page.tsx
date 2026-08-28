import type { Metadata } from "next";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "./ShopFilters";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse custom streetwear, apparel, and branded merch from Hiroshyma.Oyk, Nairobi.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts({ category: params.category, q: params.q });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: "var(--hiro-accent)" }}>
          Catalog
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: "var(--hiro-text)" }}>
          Shop
        </h1>
      </div>

      <ShopFilters
        currentCategory={params.category ?? ""}
        currentSearch={params.q ?? ""}
      />

      <div className="mt-8">
        {products.length === 0 ? (
          <div
            className="text-center py-20"
            style={{ border: "1px solid var(--hiro-border)" }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--hiro-muted)" }}>
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
