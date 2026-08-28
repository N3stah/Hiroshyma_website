""use client"

import { useEffect } from "react";

export default function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden"; // Lock background scroll
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-[var(--hiro-text)] text-4xl font-[family-name:var(--font-mono)] hover:text-[var(--hiro-cyber)] transition-colors"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        &times;
      </button>
      <img 
        src={src} 
        alt="Full size portfolio view" 
        className="max-w-full max-h-[90vh] object-contain border-2 border-[var(--hiro-border)] cyber-glow"
        onClick={(e) => e.stopPropagation()} // Prevent click on image from closing
      />
    </div>
  );
}
