"use client";
import { useEffect } from "react";
import Image from "next/image";
import type { PortfolioItem } from "@/lib/api";

export default function Lightbox({
  item,
  onClose,
}: {
  item: PortfolioItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 text-2xl leading-none cyber-glow brutal-border px-3 py-1"
        style={{ color: "var(--hiro-text)", backgroundColor: "var(--hiro-bg)" }}
      >
        &times;
      </button>
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="relative flex-1" style={{ backgroundColor: "var(--hiro-surface)", border: "3px solid var(--hiro-border)" }}>
          {item.image ? (
            <Image src={item.image} alt={item.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 768px" />
          ) : (
            <div className="w-full h-full min-h-[50vh] flex items-center justify-center">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--hiro-muted)" }}>No image</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: "var(--hiro-text)" }}>{item.title}</p>
            {item.client_name && (
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--hiro-muted)" }}>for {item.client_name}</p>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--hiro-cyber)" }}>{item.category}</span>
        </div>
      </div>
    </div>
  );
}
