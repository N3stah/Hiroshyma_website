import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/api";
import type { SiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "About",
  description: "Find Hiroshyma.Oyk in Nairobi CBD -- custom streetwear, graphic design, and printing. Visit us or send a WhatsApp.",
};

export default async function AboutPage() {
  let settings: SiteSettings | null = null;
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);
    settings = await getSiteSettings();
  } catch { /* renders with static fallbacks */ }

  const phone = settings?.phone || "";
  const whatsapp = settings?.whatsapp || "";
  const email = settings?.email || "";
  const address = settings?.address || "Nairobi CBD, Kenya";
  const hours = settings?.opening_hours_lines || ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: Closed"];
  const instagram = settings?.instagram_handle || "";
  const lat = settings?.latitude;
  const lng = settings?.longitude;

  const whatsappNumber = whatsapp.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=Hi%20Hiroshyma.Oyk%2C%20I%20would%20like%20to%20make%20an%20enquiry.`
    : null;

  const mapsQuery = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
  const mapsEmbedUrl = lat && lng
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;

  const contactItems = [
    phone && { label: "Phone", value: phone, href: `tel:${phone}`, external: false },
    whatsappUrl && { label: "WhatsApp", value: whatsapp || phone, href: whatsappUrl, external: true },
    email && { label: "Email", value: email, href: `mailto:${email}`, external: false },
    instagram && { label: "Instagram", value: `@${instagram}`, href: `https://instagram.com/${instagram}`, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string; external: boolean }[];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: "var(--hiro-cyber)" }}>The Brand</p>
        <h1 className="font-display text-3xl font-black uppercase tracking-tight" style={{ color: "var(--hiro-text)" }}>About Hiroshyma.Oyk</h1>
        <div className="ornament-divider mt-4" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-sm leading-loose mb-4" style={{ color: "var(--hiro-muted)" }}>
            Hiroshyma.Oyk is a Nairobi-based streetwear label built around quality and self-expression. We design and produce custom-printed apparel -- round-neck tees, jackets, caps, and jorts -- as well as graphic design, logo design, and professional printing services, all from the heart of Nairobi CBD.
          </p>
          <p className="text-sm leading-loose mb-8" style={{ color: "var(--hiro-muted)" }}>
            Every piece is made to order. If you can imagine it, we can put it on fabric.
          </p>
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 whatsapp-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </a>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-5" style={{ border: "1px solid var(--hiro-border-dim)" }}>
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--hiro-cyber)" }}>Location</p>
            <p className="text-sm mb-3" style={{ color: "var(--hiro-text)" }}>{address}</p>
            <a href={`https://maps.google.com/?q=${mapsQuery}`} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest link-muted">Open in Google Maps &rarr;</a>
          </div>
          <div className="p-5" style={{ border: "1px solid var(--hiro-border-dim)" }}>
            <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--hiro-cyber)" }}>Opening Hours</p>
            {hours.map((line, i) => (
              <p key={i} className="text-sm" style={{ color: "var(--hiro-muted)" }}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="ornament-divider mb-8" />
        <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: "var(--hiro-cyber)" }}>Find Us</p>
        <div className="relative w-full overflow-hidden" style={{ height: "380px", border: "3px solid var(--hiro-border)" }}>
          <iframe src={mapsEmbedUrl} width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Hiroshyma.Oyk location map" />
        </div>
        <p className="text-[10px] mt-2" style={{ color: "var(--hiro-muted)" }}>Map inverted to match the dark theme. Click to open in Google Maps.</p>
      </div>

      {contactItems.length > 0 && (
        <div style={{ borderTop: "1px solid var(--hiro-border-dim)", paddingTop: "3rem" }}>
          <p className="text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: "var(--hiro-cyber)" }}>Get in Touch</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {contactItems.map((item) => (
              <a key={item.label} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} className="block p-4 card-hover">
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--hiro-muted)" }}>{item.label}</p>
                <p className="text-sm" style={{ color: "var(--hiro-text)" }}>{item.value}</p>
              </a>
            ))}
          </div>
          <Link href="/custom-order" className="btn-primary">Place a Custom Order</Link>
        </div>
      )}
    </div>
  );
}
