import Link from "next/link";

const NAV_ITEMS: [string, string][] = [
  ["Shop", "/shop"],
  ["Portfolio", "/portfolio"],
  ["Custom Order", "/custom-order"],
  ["About", "/about"],
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--hiro-border)", backgroundColor: "var(--hiro-surface)" }}>
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: "var(--hiro-text)" }}>
            Hiroshyma.Oyk
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--hiro-muted)" }}>
            Custom streetwear, graphic design, and printing. Built in Nairobi for those who refuse to blend in.
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest mb-3 font-bold" style={{ color: "var(--hiro-text)" }}>
            Navigate
          </p>
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(([label, href]) => (
              <Link key={href} href={href} className="text-xs link-muted">{label}</Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest mb-3 font-bold" style={{ color: "var(--hiro-text)" }}>
            Find Us
          </p>
          <p className="text-xs mb-2" style={{ color: "var(--hiro-muted)" }}>Nairobi CBD, Kenya</p>
          <Link href="/about" className="text-[10px] uppercase tracking-widest link-accent">Get directions &rarr;</Link>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--hiro-border)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px]" style={{ color: "var(--hiro-muted)" }}>&copy; 2026 Hiroshyma.Oyk. All rights reserved.</p>
          <p className="text-[10px]" style={{ color: "var(--hiro-muted)" }}>
            Powered by{" "}
            <a href="https://www.aetsh69.duckdns.org" target="_blank" rel="noopener noreferrer" className="link-muted">AETSH-69</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
