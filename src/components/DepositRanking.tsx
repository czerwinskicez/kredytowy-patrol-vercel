"use client";
import React, { useState, useMemo } from 'react';
import { CustomSlider } from './CustomSlider';
import { DepositCard } from './DepositCard';
import type { DepositOffer, CalculatedDepositOffer } from '@/types';

type DepositRankingProps = {
  initialDepositOffers: DepositOffer[];
  title: string;
};

export function DepositRanking({ initialDepositOffers, title }: DepositRankingProps) {
  const [amount, setAmount] = useState(50000);
  const availablePeriods = useMemo(() => {
    if (!initialDepositOffers || initialDepositOffers.length === 0) {
      return [3, 6, 12, 24, 36];
    }
    const periods = [...new Set(initialDepositOffers.map(offer => offer.period))].sort((a, b) => a - b);
    return periods.length > 0 ? periods : [3, 6, 12, 24, 36];
  }, [initialDepositOffers]);

  const [selectedMonths, setSelectedMonths] = useState<number[]>(availablePeriods); 

  const maxPossibleAmount = 300000;

  const toggleMonth = (month: number) => {
    setSelectedMonths(prev => {
      if (prev.includes(month)) {
        // If already selected and it's not the last one, remove it
        if (prev.length > 1) {
          return prev.filter(m => m !== month);
        }
        return prev; // Don't allow removing the last selected month
      } else {
        // Add the month to selection
        return [...prev, month].sort((a, b) => a - b);
      }
    });
  };

  const { promotedOffers, regularOffers } = useMemo(() => {
    // Calculate for all selected months and group by period
    const offersByPeriod: { [key: number]: CalculatedDepositOffer[] } = {};
    
    selectedMonths.forEach(months => {
      const calculated = initialDepositOffers
        .filter(offer => 
          amount >= offer.minDepositValue && 
          amount <= offer.maxDepositValue && 
          offer.period === months
        )
        .map(offer => {
          const principal = amount;
          const annualRate = offer.baseInterestRate / 100;
          const timeInYears = offer.period / 12;
          
          // Obliczenie zysku i całkowitej kwoty zwrotu
          const profit = principal * annualRate * timeInYears;
          const totalReturn = principal + profit;

          return {
            ...offer,
            totalReturn,
            profit,
          };
        })
        .sort((a, b) => b.profit - a.profit); // Sortowanie malejąco po zysku

      offersByPeriod[months] = calculated;
    });

    // Flatten all offers and separate promoted from regular
    const allOffers = Object.values(offersByPeriod).flat();
    const promoted = allOffers.filter(offer => offer.promoted);
    const regular = allOffers.filter(offer => !offer.hidden);

    return { promotedOffers: promoted, regularOffers: regular, offersByPeriod };
  }, [amount, selectedMonths, initialDepositOffers]);

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="depositAmountInput" className="block text-gray-600">Kwota lokaty:</label>
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
          <div>
            <label className="block text-gray-600 mb-2">Okres lokaty:</label>
            <div className="flex flex-wrap gap-2">
              {availablePeriods.map(period => (
                <button
                  key={period}
                  onClick={() => toggleMonth(period)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedMonths.includes(period)
                      ? 'bg-[#0a472e] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period} mies.
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {promotedOffers.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#f0c14b] pl-4">
            Oferty promowane
          </h2>
          <div className="space-y-6">
            {promotedOffers.map((deposit, index) => <DepositCard key={`promo-${index}`} deposit={deposit} rank={index + 1} isPromoted />)}
          </div>
        </div>
      )}

      {/* Group results by period if multiple periods selected */}
      {selectedMonths.length > 1 ? (
        <div>
          {selectedMonths.map(months => {
            const offersForPeriod = (regularOffers as any).filter((offer: CalculatedDepositOffer) => offer.period === months);
            if (offersForPeriod.length === 0) return null;
            
            return (
              <div key={months} className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 border-l-4 border-[#0a472e] pl-4">
                    Najlepsze oferty na {months} miesięcy ({amount.toLocaleString('pl-PL')} zł)
                  </h2>
                </div>
                <div className="space-y-6">
                  {offersForPeriod.map((deposit: CalculatedDepositOffer, index: number) => 
                    <DepositCard key={`${months}-${index}`} deposit={deposit} rank={index + 1} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Najlepsze oferty dla kwoty {amount.toLocaleString('pl-PL')} zł na {selectedMonths[0]} miesięcy:
            </h2>
          </div>
          <div className="space-y-6">
            {regularOffers.map((deposit, index) => <DepositCard key={index} deposit={deposit} rank={index + 1} />)}
          </div>
        </div>
      )}
    </div>
  );
} 