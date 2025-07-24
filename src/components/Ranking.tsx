"use client";
import React, { useState, useMemo } from 'react';
import { CustomSlider } from './CustomSlider';
import { LoanCard } from './LoanCard';
import type { LoanOffer, CalculatedLoanOffer } from '@/types';

type RankingProps = {
  initialLoanOffers: LoanOffer[];
  title: string;
};

export function Ranking({ initialLoanOffers, title }: RankingProps) {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(48);

  const maxPossibleAmount = useMemo(() => {
    if (!initialLoanOffers || initialLoanOffers.length === 0) {
      return 500000;
    }
    return Math.max(...initialLoanOffers.map(offer => offer.maxLoanValue));
  }, [initialLoanOffers]);

  const maxPossibleMonths = useMemo(() => {
    if (!initialLoanOffers || initialLoanOffers.length === 0) {
        return 120;
    }
    return Math.max(...initialLoanOffers.map(offer => offer.maxLoanTime));
  }, [initialLoanOffers]);

  const { promotedOffers, regularOffers } = useMemo(() => {
    const calculated = initialLoanOffers
      .filter(offer => amount <= offer.maxLoanValue && months <= offer.maxLoanTime)
      .map(offer => {
        const principal = amount;
        const commissionAmount = principal * (offer.commission / 100);
        const totalPrincipal = principal + commissionAmount;
        const monthlyInterestRate = offer.baseInterestRate / 100 / 12;
        
        const monthlyRate =
          totalPrincipal *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
          (Math.pow(1 + monthlyInterestRate, months) - 1);

        const totalAmount = monthlyRate * months;

        return {
          ...offer,
          totalAmount,
          monthlyRate,
          rrso: offer.rrso,
          commission: offer.commission,
          representativeExample: offer.representativeExample,
        };
      })
      .sort((a, b) => a.monthlyRate - b.monthlyRate);

    const promoted = calculated.filter(offer => offer.promoted);
    const regular = calculated.filter(offer => !offer.hidden);

    return { promotedOffers: promoted, regularOffers: regular };
  }, [amount, months, initialLoanOffers]);

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="loanAmountInput" className="block text-gray-600">Kwota pożyczki:</label>
              <div className="flex items-baseline space-x-2">
                <input
                  id="loanAmountInput"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="font-bold text-lg text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-32 text-right bg-transparent"
                  min={5000}
                  max={maxPossibleAmount}
                  step={5000}
                />
                <span className="text-lg text-gray-600">zł</span>
              </div>
            </div>
            <CustomSlider
              value={amount}
              onChange={setAmount}
              min={5000}
              max={maxPossibleAmount}
              step={5000}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="loanMonthsInput" className="block text-gray-600">Okres spłaty:</label>
               <div className="flex items-baseline space-x-2">
                <input
                  id="loanMonthsInput"
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="font-bold text-lg text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-20 text-right bg-transparent"
                  min={12}
                  max={maxPossibleMonths}
                  step={1}
                />
                <span className="text-sm text-gray-600">miesięcy</span>
              </div>
            </div>
            <CustomSlider
              value={months}
              onChange={setMonths}
              min={12}
              max={maxPossibleMonths}
              step={1}
            />
          </div>
        </div>
      </div>
      
      {promotedOffers.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#f0c14b] pl-4">
            Oferty promowane
          </h2>
          <div className="space-y-6">
            {promotedOffers.map((loan, index) => <LoanCard key={`promo-${index}`} loan={loan} rank={index + 1} isPromoted />)}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Najlepsze oferty dla kwoty {amount.toLocaleString('pl-PL')} zł na {months} miesięcy:
        </h2>
      </div>
      <div className="space-y-6">
        {regularOffers.map((loan, index) => <LoanCard key={index} loan={loan} rank={index + 1} />)}
      </div>
    </div>
  );
} 