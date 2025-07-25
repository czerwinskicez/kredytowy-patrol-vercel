"use client";
import dynamic from 'next/dynamic';
import type { DepositOffer } from '@/types';

const ClientDepositRanking = dynamic(() => import('./DepositRanking').then(mod => ({ default: mod.DepositRanking })), {
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
          <div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
});

type DepositComparisonSectionProps = {
  initialDepositOffers: DepositOffer[];
  title?: string;
};

export function DepositComparisonSection({ initialDepositOffers, title = "Dopasuj lokatę do swoich potrzeb" }: DepositComparisonSectionProps) {
  return (
    <ClientDepositRanking
      initialDepositOffers={initialDepositOffers}
      title={title}
    />
  );
} 