const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  category_name: string;
  category_slug: string;
  thumbnail: string | null;
  is_featured: boolean;
  in_stock: boolean;
}

export interface ProductImage {
  image: string;
  alt_text: string;
  display_order: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  available_sizes: string[];
  stock_quantity: number;
  in_stock: boolean;
  category: { id: number; name: string; slug: string; description: string };
  images: ProductImage[];
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getProducts(params?: {
  category?: string;
  q?: string;
}): Promise<ProductListItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category__slug", params.category);
  if (params?.q) searchParams.set("q", params.q);
  const res = await fetch(`${API_URL}/products/?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
  const data: PaginatedResponse<ProductListItem> = await res.json();
  return data.results;
}

export async function getFeaturedProducts(): Promise<ProductListItem[]> {
  const res = await fetch(`${API_URL}/products/featured/`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to load featured products (${res.status})`);
  const data: PaginatedResponse<ProductListItem> = await res.json();
  return data.results;
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const res = await fetch(`${API_URL}/products/${slug}/`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error(`Failed to load product (${res.status})`);
  return res.json();
}

export type InquiryType =
  | "custom_apparel"
  | "graphic_design"
  | "logo_design"
  | "card_design"
  | "printing";

interface InquirySuccess { message: string; }
interface InquiryError {
  detail?: string;
  [field: string]: string[] | string | undefined;
}

export async function submitInquiry(
  formData: FormData
): Promise<{ ok: true; data: InquirySuccess } | { ok: false; status: number; data: InquiryError }> {
  const res = await fetch(`${API_URL}/inquiries/`, { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) return { ok: false, status: res.status, data };
  return { ok: true, data };
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: "apparel" | "branding" | "printing";
  client_name: string;
  completed_date: string | null;
  is_featured: boolean;
}

interface CursorPage<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getPortfolioPage(
  urlOrCategory?: string
): Promise<CursorPage<PortfolioItem>> {
  const isFullUrl = urlOrCategory?.startsWith("http");
  const url = isFullUrl
    ? urlOrCategory!
    : `${API_URL}/portfolio/${urlOrCategory ? "?category=" + urlOrCategory : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load portfolio (${res.status})`);
  return res.json();
}

export interface SiteSettings {
  shop_name: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  opening_hours_lines: string[];
  instagram_handle: string;
  twitter_handle: string;
  latitude: string | null;
  longitude: string | null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_URL}/site-settings/`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to load site settings (${res.status})`);
  return res.json();
}
