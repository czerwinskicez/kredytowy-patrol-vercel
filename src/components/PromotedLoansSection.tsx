// src/components/PromotedLoansSection.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { CalculatedLoanOffer, LoanOffer } from '@/types';
import { LoanCard } from './LoanCard';

interface PromotedLoansSectionProps {
  promotedCashLoans: LoanOffer[];
  promotedMortgageLoans: LoanOffer[];
  promotedConsolidationLoans: LoanOffer[];
}

const PromotedLoansSection: React.FC<PromotedLoansSectionProps> = ({
  promotedCashLoans,
  promotedMortgageLoans,
  promotedConsolidationLoans,
}) => {
  const [activeTab, setActiveTab] = useState('cash');

  function calculateForAmountMonths(offer: LoanOffer, amount: number, months: number): CalculatedLoanOffer {
    const principal = amount;
    const commissionAmount = principal * ((offer.commission || 0) / 100);
    const totalPrincipal = principal + commissionAmount;
    const monthlyInterestRate = (offer.baseInterestRate || 0) / 100 / 12;

    let monthlyRate = 0;
    let totalAmount = 0;

    if (monthlyInterestRate > 0) {
      monthlyRate =
        totalPrincipal *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
        (Math.pow(1 + monthlyInterestRate, months) - 1);
      totalAmount = monthlyRate * months;
    } else {
      // Jeśli oprocentowanie wynosi 0, rata to po prostu kwota podzielona przez liczbę miesięcy
      monthlyRate = totalPrincipal / months;
      totalAmount = totalPrincipal;
    }

    return {
      provider: offer.provider || '',
      logo: offer.logo || '/trust.jpg',
      name: offer.name || '',
      totalAmount: isFinite(totalAmount) && totalAmount > 0 ? totalAmount : 0,
      commission: offer.commission || 0,
      rrso: offer.rrso || 0,
      monthlyRate: isFinite(monthlyRate) && monthlyRate > 0 ? monthlyRate : 0,
      representativeExample: offer.representativeExample || '',
      promoted: offer.promoted || false,
      hidden: offer.hidden || false,
      extraLabel: offer.extraLabel || '',
      acceptsBik: true,
      acceptsKrd: false,
      age: { min: 18, max: 80 },
      requiredDocuments: [
        'Dokument tożsamości',
        'Zaświadczenie o dochodach',
      ],
    };
  }

  const tabs = [
    { id: 'cash', label: 'Gotówkowe', loans: promotedCashLoans, slug: 'gotowkowy' },
    { id: 'mortgage', label: 'Hipoteczne', loans: promotedMortgageLoans, slug: 'hipoteczny' },
    { id: 'consolidation', label: 'Konsolidacyjne', loans: promotedConsolidationLoans, slug: 'konsolidacyjny' },
  ] as const;

  const sharedByTab = useMemo(() => {
    const computeShared = (offers: LoanOffer[]) => {
      if (!offers || offers.length === 0) {
        return { amount: 50000, months: 48 };
      }
      const maxAmounts = offers.map(o => o.maxLoanValue);
      const maxMonths = offers.map(o => o.maxLoanTime);
      const amount = Math.max(5000, Math.min(...maxAmounts));
      const months = Math.max(12, Math.min(...maxMonths));
      return { amount, months };
    };
    return {
      cash: computeShared(promotedCashLoans),
      mortgage: computeShared(promotedMortgageLoans),
      consolidation: computeShared(promotedConsolidationLoans),
    };
  }, [promotedCashLoans, promotedMortgageLoans, promotedConsolidationLoans]);

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
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        Pokazujemy promowane oferty dla kwoty
                        {' '}<span className="font-bold text-[#0a472e]">{sharedByTab[tab.id as 'cash'|'mortgage'|'consolidation'].amount.toLocaleString('pl-PL')} zł</span>
                        {' '}na{' '}
                        <span className="font-bold text-[#0a472e]">{sharedByTab[tab.id as 'cash'|'mortgage'|'consolidation'].months}</span>
                        {' '}miesięcy
                      </p>
                    </div>
                    <div className="space-y-6">
                      {tab.loans.map((loan, index) => {
                        const a = sharedByTab[tab.id as 'cash'|'mortgage'|'consolidation'].amount;
                        const m = sharedByTab[tab.id as 'cash'|'mortgage'|'consolidation'].months;
                        const calc = calculateForAmountMonths(loan, a, m);
                        return (
                          <LoanCard key={index} loan={calc} rank={index + 1} isPromoted />
                        );
                      })}
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
