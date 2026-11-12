export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254793257483";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hiroshyma-oyk.vercel.app";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(name: string, slug: string, price: string): string {
  const amount = Number(price).toLocaleString("en-KE");
  return `Hi Hiroshyma.Oyk, I would like to order: ${name} (KES ${amount}).\n${SITE_URL}/shop/${slug}`;
}
