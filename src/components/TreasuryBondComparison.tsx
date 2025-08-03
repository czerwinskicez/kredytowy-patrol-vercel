"use client";
import React, { useState, useMemo } from 'react';
import { CustomSlider } from './CustomSlider';
import { BondBadge, bondColors } from './BondBadge';
import type { TreasuryBondOffer } from '@/types';
import { calculateTreasuryBondOffers } from '@/lib/treasury-bonds-calculations';

type TreasuryBondComparisonProps = {
  initialBondOffers: TreasuryBondOffer[];
};

export function TreasuryBondComparison({ initialBondOffers }: TreasuryBondComparisonProps) {
  const [amount, setAmount] = useState(10000);
  const [expectedInflation, setExpectedInflation] = useState(4.0);
  const maxPossibleAmount = 200000;

  const calculatedOffers = useMemo(() => {
    return calculateTreasuryBondOffers(initialBondOffers, amount, expectedInflation)
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
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="font-bold text-2xl text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-40 text-right bg-transparent"
                  min={100}
                  max={maxPossibleAmount}
                  step={1000}
                />
                <span className="text-xl text-gray-600">zł</span>
              </div>
            </div>
            <CustomSlider
              value={amount}
              onChange={setAmount}
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
                  onChange={(e) => setExpectedInflation(Number(e.target.value))}
                  className="font-bold text-2xl text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-20 text-right bg-transparent"
                  min={0}
                  max={20}
                  step={0.5}
                />
                <span className="text-xl text-gray-600">%</span>
              </div>
            </div>
            <CustomSlider
              value={expectedInflation}
              onChange={setExpectedInflation}
              min={0}
              max={20}
              step={0.5}
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
        
        {/* Wykres porównawczy - paski */}
        <div className="bg-gray-50 p-4 lg:p-6 rounded-lg">
          <div className="space-y-3 lg:space-y-2">
            {calculatedOffers.map((bond, index) => (
              <div key={bond.symbol}>
                {/* Mobile Layout - dwulinijkowy */}
                <div className="lg:hidden">
                  {/* Pierwsza linia: Badge + Nazwa + Zysk */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-shrink-0">
                      <BondBadge symbol={bond.symbol} size="sm" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 truncate">{bond.interestDescription}</div>
                      <div className="text-xs text-gray-400">
                        {bond.baseInterestRate}% • {bond.duration}{bond.duration === 1 ? 'r' : bond.duration < 5 ? 'l' : 'l'}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-[#0a472e]">
                        +{formatCurrency(bond.profit)} zł
                      </span>
                      <div className="text-xs text-gray-500">#{index + 1}</div>
                    </div>
                  </div>
                  
                  {/* Druga linia: Progress bar na całą szerokość */}
                  <div className="w-full">
                    <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 relative"
                        style={{
                          width: `${Math.max((bond.profit / maxProfit) * 100, 8)}%`,
                          backgroundColor: bondColors[bond.symbol] || '#6B7280'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-15"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - jednolinijkowy */}
                <div className="hidden lg:flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <BondBadge symbol={bond.symbol} size="sm" />
                  </div>
                  
                  <div className="w-40 flex-shrink-0">
                    <div className="text-sm text-gray-600 truncate">{bond.interestDescription}</div>
                  </div>
                  
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 relative"
                        style={{
                          width: `${Math.max((bond.profit / maxProfit) * 100, 8)}%`,
                          backgroundColor: bondColors[bond.symbol] || '#6B7280'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-15"></div>
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-start pl-3">
                        <span 
                          className="text-xs font-bold text-white"
                          style={{ 
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'
                          }}
                        >
                          {bond.baseInterestRate}% • {bond.duration} {bond.duration === 1 ? 'rok' : bond.duration < 5 ? 'lata' : 'lat'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-28 text-right flex-shrink-0">
                    <span className="text-lg font-bold text-[#0a472e]">
                      +{formatCurrency(bond.profit)} zł
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Karty z detalami - szerszy układ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {calculatedOffers.map((bond, index) => (
            <div key={bond.symbol} className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <BondBadge symbol={bond.symbol} size="lg" />
                <div className="text-xs text-gray-500">
                  #{index + 1} najlepszy
                </div>
              </div>
              
              <h4 className="font-bold text-gray-800 mb-2 break-words">{bond.interestDescriptionV2}</h4>
              
              <div className="space-y-3 flex-grow mb-4">
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
                  <span className="font-semibold text-sm text-right break-words">{bond.payday}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <a
                  href={bond.url !== '/#' ? bond.url : "https://www.gov.pl/web/finanse/skarb-panstwa-obligacje-skarbowe"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-3 px-2 sm:px-4 rounded-lg transition-colors text-sm leading-tight"
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
