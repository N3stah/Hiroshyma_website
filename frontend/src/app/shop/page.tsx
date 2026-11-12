import type { Metadata } from "next";
import { getAllProducts } from "@/lib/catalog";
import ShopCatalog from "./ShopCatalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse custom streetwear, caps, apparel and branded merch from Hiroshyma.Oyk, Nairobi.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const products = await getAllProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: "var(--hiro-cyber)" }}>Catalog</p>
        <h1 className="font-display text-3xl font-black uppercase tracking-tight" style={{ color: "var(--hiro-text)" }}>Shop</h1>
      </div>
      <ShopCatalog products={products} initialCategory={params.category ?? ""} />
    </div>
  );
}
