"use client";
import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/custom-order", label: "Custom Order" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(13,13,13,0.96)",
        borderBottom: "1px solid var(--hiro-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] link-logo">
          Hiroshyma.Oyk
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-widest link-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 p-1"
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block h-px transition-all duration-200 ${open ? "rotate-45 translate-y-[7px]" : ""}`}
            style={{ backgroundColor: "var(--hiro-text)" }}
          />
          <span
            className={`block h-px transition-all duration-200 ${open ? "opacity-0" : ""}`}
            style={{ backgroundColor: "var(--hiro-text)" }}
          />
          <span
            className={`block h-px transition-all duration-200 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`}
            style={{ backgroundColor: "var(--hiro-text)" }}
          />
        </button>
      </div>

      {open && (
        <nav style={{ borderTop: "1px solid var(--hiro-border)", backgroundColor: "var(--hiro-bg)" }}>
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-[11px] uppercase tracking-widest link-muted"
              style={{ borderBottom: "1px solid var(--hiro-border)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
