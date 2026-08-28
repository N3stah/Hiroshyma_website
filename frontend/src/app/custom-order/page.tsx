import { Suspense } from 'react';
import CustomOrderForm from './CustomOrderForm';

export default function CustomOrderPage() {
  return (
    <div className="min-h-screen bg-[var(--hiro-bg)] text-[var(--hiro-text)]">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-[var(--hiro-border-dim)] border-t-[var(--hiro-cyber)] animate-spin rounded-none"></div></div>}>
        <div className="max-w-4xl mx-auto py-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-center mb-12">
            Custom Order Inquiry
          </h1>
          <CustomOrderForm />
        </div>
      </Suspense>
    </div>
  );
}
