"use client";
import dynamic from 'next/dynamic';
import type { SavingsAccountOffer } from '@/types';

const ClientSavingsAccountRanking = dynamic(() => import('./SavingsAccountRanking').then(mod => ({ default: mod.SavingsAccountRanking })), {
  ssr: false,
  loading: () => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
});

type SavingsAccountComparisonSectionProps = {
  initialOffers: SavingsAccountOffer[];
  title?: string;
};

export function SavingsAccountComparisonSection({ initialOffers, title = "Porównaj konta oszczędnościowe" }: SavingsAccountComparisonSectionProps) {
  return (
    <ClientSavingsAccountRanking
      initialOffers={initialOffers}
      title={title}
    />
  );
}

