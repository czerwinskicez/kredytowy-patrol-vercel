"use client";
import React, { useState, useMemo } from 'react';
import { CustomSlider } from './CustomSlider';
import { SavingsAccountCard } from './SavingsAccountCard';
import type { SavingsAccountOffer, CalculatedSavingsAccountOffer } from '@/types';

type SavingsAccountRankingProps = {
  initialOffers: SavingsAccountOffer[];
  title: string;
};

export function SavingsAccountRanking({ initialOffers, title }: SavingsAccountRankingProps) {
  const [amount, setAmount] = useState(25000);
  const maxPossibleAmount = 200000;

  const calculatedOffers = useMemo(() => {
    const offers = initialOffers
      .filter(offer => 
        (offer.maxDepositValue === 0 || amount <= offer.maxDepositValue)
      )
      .map(offer => {
        const principal = amount;
        const annualRate = offer.baseInterestRate / 100;
        
        const profit = principal * annualRate; // Zysk po 1 roku
        const totalReturn = principal + profit;

        return {
          ...offer,
          totalReturn,
          profit,
        };
      })
      .sort((a, b) => b.profit - a.profit);

    const promoted = offers.filter(offer => offer.promoted);
    const regular = offers.filter(offer => !offer.hidden && !offer.promoted);
    
    return { promotedOffers: promoted, regularOffers: regular };
  }, [amount, initialOffers]);

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="depositAmountInput" className="block text-gray-600">Kwota oszczędności:</label>
              <div className="flex items-baseline space-x-2">
                <input
                  id="depositAmountInput"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="font-bold text-lg text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-32 text-right bg-transparent"
                  min={1000}
                  max={maxPossibleAmount}
                  step={1000}
                />
                <span className="text-lg text-gray-600">zł</span>
              </div>
            </div>
            <CustomSlider
              value={amount}
              onChange={setAmount}
              min={1000}
              max={maxPossibleAmount}
              step={1000}
            />
          </div>
        </div>
      </div>
      
      {calculatedOffers.promotedOffers.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#f0c14b] pl-4">
            Oferty promowane
          </h2>
          <div className="space-y-6">
            {calculatedOffers.promotedOffers.map((offer, index) => <SavingsAccountCard key={`promo-${index}`} offer={offer} rank={index + 1} isPromoted />)}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Najlepsze konta oszczędnościowe dla kwoty {amount.toLocaleString('pl-PL')} zł:
          </h2>
        </div>
        <div className="space-y-6">
          {calculatedOffers.regularOffers.map((offer, index) => <SavingsAccountCard key={index} offer={offer} rank={index + 1} />)}
        </div>
      </div>
    </div>
  );
}

