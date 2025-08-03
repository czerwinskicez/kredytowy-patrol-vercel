"use client";
import React, { useState, useMemo } from 'react';
import { CustomSlider } from './CustomSlider';
import { BondBadge, bondColors } from './BondBadge';
import type { TreasuryBondOffer, CalculatedTreasuryBondOffer } from '@/types';

type TreasuryBondComparisonProps = {
  initialBondOffers: TreasuryBondOffer[];
  amount: number;
  expectedInflation: number;
  onAmountChange: (amount: number) => void;
  onInflationChange: (inflation: number) => void;
};

// Mapowanie symboli na okresy w latach
const bondDurations: { [key: string]: number } = {
  OTS: 0.25, // 3 miesiące
  ROR: 1,    // 1 rok
  DOR: 2,    // 2 lata
  TOS: 3,    // 3 lata
  COI: 4,    // 4 lata
  ROS: 6,    // 6 lat
  EDO: 10,   // 10 lat
  ROD: 12,   // 12 lat
};



export function TreasuryBondComparison({ 
  initialBondOffers, 
  amount, 
  expectedInflation, 
  onAmountChange, 
  onInflationChange 
}: TreasuryBondComparisonProps) {
  const maxPossibleAmount = 200000;

  const calculatedOffers = useMemo(() => {
    return initialBondOffers
      .map(bond => {
        const duration = bondDurations[bond.symbol] || 1;
        let effectiveAnnualRate = bond.baseInterestRate / 100;
        
        // Obliczenie efektywnej stopy procentowej z uwzględnieniem inflacji
        // dla obligacji inflacyjnych (COI, EDO, ROS, ROD)
        if (['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol)) {
          if (bond.symbol === 'COI') {
            // COI: 6% w pierwszym roku, potem inflacja + 1.5%
            const firstYearRate = 6 / 100;
            const subsequentRate = (expectedInflation + 1.5) / 100;
            effectiveAnnualRate = duration === 1 ? firstYearRate : 
              (firstYearRate + subsequentRate * (duration - 1)) / duration;
          } else if (bond.symbol === 'EDO') {
            // EDO: 6.25% w pierwszym roku, potem inflacja + 2%
            const firstYearRate = 6.25 / 100;
            const subsequentRate = (expectedInflation + 2.0) / 100;
            effectiveAnnualRate = duration === 1 ? firstYearRate : 
              (firstYearRate + subsequentRate * (duration - 1)) / duration;
          } else if (bond.symbol === 'ROS') {
            // ROS: 5.95% w pierwszym roku, potem inflacja + 2%
            const firstYearRate = 5.95 / 100;
            const subsequentRate = (expectedInflation + 2.0) / 100;
            effectiveAnnualRate = duration === 1 ? firstYearRate : 
              (firstYearRate + subsequentRate * (duration - 1)) / duration;
          } else if (bond.symbol === 'ROD') {
            // ROD: 6.5% w pierwszym roku, potem inflacja + 2.5%
            const firstYearRate = 6.5 / 100;
            const subsequentRate = (expectedInflation + 2.5) / 100;
            effectiveAnnualRate = duration === 1 ? firstYearRate : 
              (firstYearRate + subsequentRate * (duration - 1)) / duration;
          }
        }
        
        // Obliczenie zysku zależnie od typu kapitalizacji
        let profit: number;
        let totalReturn: number;
        
        if (bond.capitalization.includes('Kapitalizacja')) {
          // Z kapitalizacją - procent składany
          totalReturn = amount * Math.pow(1 + effectiveAnnualRate, duration);
          profit = totalReturn - amount;
        } else {
          // Bez kapitalizacji - procent prosty
          profit = amount * effectiveAnnualRate * duration;
          totalReturn = amount + profit;
        }

        return {
          ...bond,
          duration,
          profit,
          totalReturn,
          effectiveRate: effectiveAnnualRate * 100, // Dodajemy efektywną stopę do wyświetlenia
        } as CalculatedTreasuryBondOffer & { effectiveRate: number };
      })
      .sort((a, b) => b.profit - a.profit);
  }, [initialBondOffers, amount, expectedInflation]);

  const maxProfit = Math.max(...calculatedOffers.map(bond => bond.profit));

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatCurrencyDetailed = (value: number) => {
    return value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Symulator Obligacji Skarbowych</h2>
      <p className="text-gray-600 mb-8">Porównaj zyski z różnych obligacji skarbowych i wybierz najlepszą opcję dla siebie</p>
      
      {/* Kontrolki */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kwota inwestycji */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="bondAmountInput" className="block text-gray-600 font-semibold">Kwota inwestycji:</label>
              <div className="flex items-baseline space-x-2">
                <input
                  id="bondAmountInput"
                  type="number"
                  value={amount}
                  onChange={(e) => onAmountChange(Number(e.target.value))}
                  className="font-bold text-2xl text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-40 text-right bg-transparent"
                  min={100}
                  max={maxPossibleAmount}
                  step={500}
                />
                <span className="text-xl text-gray-600">zł</span>
              </div>
            </div>
            <CustomSlider
              value={amount}
              onChange={onAmountChange}
              min={100}
              max={maxPossibleAmount}
              step={1000}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>100 zł</span>
              <span>200 000 zł</span>
            </div>
          </div>

          {/* Oczekiwana inflacja */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="inflationInput" className="block text-gray-600 font-semibold">Oczekiwana inflacja:</label>
              <div className="flex items-baseline space-x-2">
                <input
                  id="inflationInput"
                  type="number"
                  value={expectedInflation}
                  onChange={(e) => onInflationChange(Number(e.target.value))}
                  className="font-bold text-2xl text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-20 text-right bg-transparent"
                  min={0}
                  max={20}
                  step={2.5}
                />
                <span className="text-xl text-gray-600">%</span>
              </div>
            </div>
            <CustomSlider
              value={expectedInflation}
              onChange={onInflationChange}
              min={0}
              max={20}
              step={0.1}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0%</span>
              <span>20%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Wpływa na obligacje inflacyjne (COI, EDO, ROS, ROD)
            </p>
          </div>
        </div>
      </div>

      {/* Wyniki porównania */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Porównanie zysków dla {formatCurrency(amount)} zł</h3>
        
        {/* Wykres słupkowy */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            {calculatedOffers.map((bond, index) => (
              <div key={bond.symbol} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-bold text-center">
                  {bond.symbol}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 truncate">{bond.interestDescription}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 relative"
                        style={{
                          width: `${(bond.profit / maxProfit) * 100}%`,
                          backgroundColor: bondColors[bond.symbol] || '#6B7280'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-start pl-3">
                        <span className="text-xs font-bold text-white mix-blend-difference">
                          {bond.baseInterestRate}% • {bond.duration} {bond.duration === 1 ? 'rok' : bond.duration < 5 ? 'lata' : 'lat'}
                        </span>
                      </div>
                    </div>
                    <div className="w-28 text-right">
                      <span className="text-lg font-bold text-[#0a472e]">
                        +{formatCurrencyDetailed(bond.profit)} zł
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Karty z detalami - szerszy układ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculatedOffers.map((bond, index) => (
            <div key={bond.symbol} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <BondBadge symbol={bond.symbol} size="lg" />
                <div className="text-xs text-gray-500">
                  #{index + 1} najlepszy
                </div>
              </div>
              
              <h4 className="font-bold text-gray-800 mb-2">{bond.interestDescriptionV2}</h4>
              
              <div className="space-y-3 flex-grow">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Zysk:</span>
                  <span className="font-bold text-[#0a472e]">+{formatCurrencyDetailed(bond.profit)} zł</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Zwrot:</span>
                  <span className="font-semibold">{formatCurrencyDetailed(bond.totalReturn)} zł</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Okres:</span>
                  <span className="font-semibold">{bond.duration} {bond.duration === 1 ? 'rok' : bond.duration < 5 ? 'lata' : 'lat'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Oprocentowanie:</span>
                  <span className="font-semibold">
                    {['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol) ? 
                      `${(bond as any).effectiveRate.toFixed(2)}%*` : 
                      `${bond.baseInterestRate}%`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kapitalizacja:</span>
                  <span className="font-semibold">{bond.capitalization.includes('Kapitalizacja') ? 'Tak' : 'Nie'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wypłata:</span>
                  <span className="font-semibold">{bond.payday}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <a
                  href={bond.url !== '/#' ? bond.url : "https://www.gov.pl/web/finanse/skarb-panstwa-obligacje-skarbowe"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Kup {bond.symbol} Online
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Podsumowanie */}
        <div className="bg-gradient-to-r from-[#0a472e] to-[#0c5a3a] text-white p-6 rounded-lg hidden">
          <h4 className="text-lg font-bold mb-2">💡 Najlepsza opcja dla Ciebie</h4>
          {calculatedOffers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm opacity-90">
                Obligacje <strong>{calculatedOffers[0].symbol}</strong> przyniosą Ci największy zysk w wysokości{' '}
                <strong>{formatCurrencyDetailed(calculatedOffers[0].profit)} zł</strong> przez{' '}
                {calculatedOffers[0].duration} {calculatedOffers[0].duration === 1 ? 'rok' : calculatedOffers[0].duration < 5 ? 'lata' : 'lat'}.
              </p>
              {['COI', 'EDO', 'ROS', 'ROD'].includes(calculatedOffers[0].symbol) && (
                <p className="text-xs opacity-75">
                  * Uwzględnia oczekiwaną inflację {expectedInflation}% dla obligacji inflacyjnych
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}