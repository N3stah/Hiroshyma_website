export default function Loading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4 md:p-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="border border-[var(--hiro-border-dim)] bg-[var(--hiro-surface)] p-4 animate-pulse">
          <div className="w-full h-48 bg-[var(--hiro-raised)] mb-4"></div>
          <div className="h-4 bg-[var(--hiro-raised)] w-3/4 mb-2"></div>
          <div className="h-4 bg-[var(--hiro-raised)] w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
