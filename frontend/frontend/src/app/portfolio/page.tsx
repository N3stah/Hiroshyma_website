import PortfolioGrid from './PortfolioGrid';

export default async function PortfolioPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/portfolio/`, { cache: 'no-store' });
  const initialData = await res.json();

  return (
    <div className="min-h-screen bg-[var(--hiro-bg)] text-[var(--hiro-text)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl mb-4 leading-none">
            Portfolio
          </h1>
          <div className="ornament-divider w-24 mx-auto"></div>
        </div>
        <PortfolioGrid initialData={initialData} />
      </div>
    </div>
  );
}
