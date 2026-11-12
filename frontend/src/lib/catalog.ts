import type { ProductListItem } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductPage {
  next: string | null;
  results: ProductListItem[];
}

// Follows pagination so the shop never silently drops products past page 1.
export async function getAllProducts(timeoutMs = 10000): Promise<ProductListItem[]> {
  const all: ProductListItem[] = [];
  let url: string | null = `${API_URL}/products/`;
  for (let page = 0; url && page < 10; page++) {
    const res: Response = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
    const data: ProductPage = await res.json();
    all.push(...data.results);
    url = data.next;
  }
  return all;
}
