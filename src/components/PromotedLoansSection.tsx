// src/components/PromotedLoansSection.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CalculatedLoanOffer } from '@/types';
import { LoanCard } from './LoanCard';

interface PromotedLoansSectionProps {
  promotedCashLoans: CalculatedLoanOffer[];
  promotedMortgageLoans: CalculatedLoanOffer[];
  promotedConsolidationLoans: CalculatedLoanOffer[];
}

const PromotedLoansSection: React.FC<PromotedLoansSectionProps> = ({
  promotedCashLoans,
  promotedMortgageLoans,
  promotedConsolidationLoans,
}) => {
  const [activeTab, setActiveTab] = useState('cash');

  const tabs = [
    { id: 'cash', label: 'Gotówkowe', loans: promotedCashLoans, slug: 'gotowkowy' },
    { id: 'mortgage', label: 'Hipoteczne', loans: promotedMortgageLoans, slug: 'hipoteczny' },
    { id: 'consolidation', label: 'Konsolidacyjne', loans: promotedConsolidationLoans, slug: 'konsolidacyjny' },
  ];

  return (
    <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl">
            Ranking Kredytów i Pożyczek
          </h2>
          <p className="mt-4 text-base font-normal leading-7 text-gray-600 sm:mt-6">
            Sprawdź nasz ranking kredytów gotówkowych, hipotecznych i konsolidacyjnych. Znajdź najlepszą ofertę dopasowaną do swoich potrzeb.
          </p>
        </div>

        <div className="mt-12">
          <div className="flex flex-col sm:flex-row justify-center border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-lg font-semibold transition-all duration-300 ease-in-out border-b-4 mb-2 sm:mb-0 rounded-lg sm:rounded-none
                  ${
                    activeTab === tab.id
                      ? 'border-[#f0c14b] text-[#0a472e] bg-white sm:bg-transparent'
                      : 'border-transparent text-gray-500 hover:text-[#0a472e] bg-gray-100 sm:bg-transparent hover:bg-gray-50 sm:hover:bg-transparent'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            {tabs.map(tab => (
              <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
                {tab.loans.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {tab.loans.map((loan, index) => (
                        <LoanCard key={index} loan={loan} rank={index + 1} isPromoted />
                      ))}
                    </div>
                    <div className="mt-10 text-center">
                      <Link 
                        href={`/kredyty/${tab.slug}`}
                        className="inline-block bg-[#0a472e] text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-[#0c5a3a] transition-colors duration-300 shadow-md hover:shadow-lg"
                      >
                        Pokaż pełny ranking
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500">Brak promowanych ofert w tej kategorii.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotedLoansSection;
