""use client"

import { useState, useRef, useEffect } from "react";
import Lightbox from './Lightbox';

type PortfolioItem = {
  id: number;
  title: string;
  image: string;
  category: string;
};

export default function PortfolioGrid({ initialData }: { initialData: any }) {
  const [items, setItems] = useState<PortfolioItem[]>(initialData.results || []);
  const [nextCursor, setNextCursor] = useState<string | null>(initialData.next || null);
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (!nextCursor || isLoading) return;
    setIsLoading(true);
    
    try {
      const res = await fetch(nextCursor);
      const data = await res.json();
      setItems(prev => [...prev, ...data.results]);
      setNextCursor(data.next || null);
    } catch (error) {
      console.error("Failed to load more portfolio items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextCursor) {
        loadMore();
      }
    }, { threshold: 0.5 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [nextCursor, isLoading]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="border border-[var(--hiro-border-dim)] bg-[var(--hiro-surface)] p-2 card-hover cursor-pointer"
            onClick={() => setLightboxImage(item.image)}
          >
            <div className="overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title || "Portfolio Item"} 
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-[family-name:var(--font-display)] text-xl mb-1">
                {item.title}
              </h3>
              {item.category && (
                <span className="text-xs font-[family-name:var(--font-mono)] text-[var(--hiro-cyber)] uppercase tracking-wider">
                  {item.category.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {nextCursor && (
        <div ref={loaderRef} className="flex justify-center mt-12">
          <div className="w-8 h-8 border-4 border-[var(--hiro-border-dim)] border-t-[var(--hiro-cyber)] animate-spin rounded-none"></div>
        </div>
      )}

      {lightboxImage && (
        <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </>
  );
}
