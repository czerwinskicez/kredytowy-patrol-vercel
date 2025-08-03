"use client";
import React, { useState, useMemo } from 'react';
import { CustomSlider } from './CustomSlider';
import { CurrencyDepositCard } from './CurrencyDepositCard';
import type { CurrencyDepositOffer, CalculatedCurrencyDepositOffer } from '@/types';

type CurrencyDepositRankingProps = {
  initialDepositOffers: CurrencyDepositOffer[];
  title: string;
};

const currencySymbols: { [key: string]: string } = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'Fr',
};

export function CurrencyDepositRanking({ initialDepositOffers, title }: CurrencyDepositRankingProps) {
  const [amount, setAmount] = useState(10000);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<('EUR' | 'USD' | 'GBP' | 'CHF')[]>([]);

  const maxPossibleAmount = 250000;

  const availableCurrencies = useMemo(() => {
    const currencies = [...new Set(initialDepositOffers.map(offer => offer.currency))];
    // Set all available currencies as selected by default
    if (selectedCurrencies.length === 0) {
      setSelectedCurrencies(currencies as ('EUR' | 'USD' | 'GBP' | 'CHF')[]);
    }
    return currencies as ('EUR' | 'USD' | 'GBP' | 'CHF')[];
  }, [initialDepositOffers, selectedCurrencies.length]);

  const availablePeriods = useMemo(() => {
    const periods = [...new Set(
      initialDepositOffers
        .filter(offer => selectedCurrencies.includes(offer.currency))
        .map(offer => offer.period)
    )].sort((a, b) => a - b);
    
    // Set all available periods as selected by default when currencies change
    setSelectedMonths(periods);
    
    return periods;
  }, [initialDepositOffers, selectedCurrencies]);

  const toggleMonth = (month: number) => {
    setSelectedMonths(prev => {
      if (prev.includes(month)) {
        return prev.length > 1 ? prev.filter(m => m !== month) : prev;
      } else {
        return [...prev, month].sort((a, b) => a - b);
      }
    });
  };

  const toggleCurrency = (currency: 'EUR' | 'USD' | 'GBP' | 'CHF') => {
    setSelectedCurrencies(prev => {
      if (prev.includes(currency)) {
        return prev.length > 1 ? prev.filter(c => c !== currency) : prev;
      } else {
        return [...prev, currency];
      }
    });
  };

  const { regularOffers, offersByPeriodAndCurrency } = useMemo(() => {
    const offersByPeriodAndCurrency: { [key: string]: CalculatedCurrencyDepositOffer[] } = {};
    
    selectedMonths.forEach(months => {
      selectedCurrencies.forEach(currency => {
        const calculated = initialDepositOffers
          .filter(offer => 
            offer.currency === currency &&
            amount >= offer.minDepositValue && 
            (offer.maxDepositValue === -1 || amount <= offer.maxDepositValue) &&
            offer.period === months
          )
          .map(offer => {
            const principal = amount;
            const annualRate = offer.baseInterestRate / 100;
            const timeInYears = offer.period / 12;
            const profit = principal * annualRate * timeInYears;
            const totalReturn = principal + profit;

            return { ...offer, totalReturn, profit };
          })
          .sort((a, b) => b.profit - a.profit);

        const key = `${months}-${currency}`;
        offersByPeriodAndCurrency[key] = calculated;
      });
    });

    const allOffers = Object.values(offersByPeriodAndCurrency).flat();
    const regular = allOffers.filter(offer => !offer.hidden);

    return { regularOffers: regular, offersByPeriodAndCurrency };
  }, [amount, selectedMonths, selectedCurrencies, initialDepositOffers]);

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 items-start">
          {/* Waluta */}
          <div className="md:col-span-1">
            <label className="block text-gray-600 mb-2">Waluta:</label>
            <div className="flex flex-wrap gap-2">
              {availableCurrencies.map(currency => (
                <button
                  key={currency}
                  onClick={() => toggleCurrency(currency)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedCurrencies.includes(currency)
                      ? 'bg-[#0a472e] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          {/* Okres lokaty */}
          <div className="md:col-span-2">
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

          {/* Kwota lokaty - suwak */}
          <div className="md:col-span-3 pt-4">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="depositAmountInput" className="block text-gray-600">Kwota lokaty:</label>
              <div className="flex items-baseline space-x-2">
                <input
                  id="depositAmountInput"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="font-bold text-lg text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-32 text-right bg-transparent"
                  min={100}
                  max={maxPossibleAmount}
                  step={100}
                />
                <span className="text-lg text-gray-600">{selectedCurrencies.map(c => currencySymbols[c]).join('/')}</span>
              </div>
            </div>
            <CustomSlider
              value={amount}
              onChange={setAmount}
              min={100}
              max={maxPossibleAmount}
              step={100}
            />
          </div>
        </div>
      </div>
      
      {regularOffers.length > 0 ? (
        <div>
          {selectedMonths.sort((a, b) => a - b).map(months => {
            const periodOffers = selectedCurrencies.map(currency => {
              const key = `${months}-${currency}`;
              return offersByPeriodAndCurrency[key] || [];
            }).flat().filter(offer => offer !== undefined);
            
            if (periodOffers.length === 0) return null;
            
            return (
              <div key={months} className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 border-l-4 border-[#0a472e] pl-4">
                    Najlepsze oferty na {months} miesięcy ({amount.toLocaleString('pl-PL')})
                  </h2>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">Waluty:</span> {selectedCurrencies.join(', ')}
                  </div>
                </div>
                <div className="space-y-6">
                  {periodOffers
                    .sort((a, b) => b.profit - a.profit)
                    .map((deposit, index) => 
                      <CurrencyDepositCard key={`${months}-${deposit.currency}-${index}`} deposit={deposit} rank={index + 1} />
                    )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Brak ofert dla wybranych kryteriów.</p>
            <p className="text-gray-400 mt-2">Spróbuj zmienić kwotę, okres lub walutę.</p>
        </div>
      )}
    </div>
  );
}
