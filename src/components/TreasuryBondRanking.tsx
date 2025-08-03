"use client";
import React, { useState, useMemo } from 'react';
import { BondBadge } from './BondBadge';
import type { TreasuryBondOffer, CalculatedTreasuryBondOffer } from '@/types';

type TreasuryBondRankingProps = {
  initialBondOffers: TreasuryBondOffer[];
  title: string;
  amount: number;
  expectedInflation: number;
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

export function TreasuryBondRanking({ initialBondOffers, title, amount, expectedInflation }: TreasuryBondRankingProps) {
  const [sortBy, setSortBy] = useState<'rate' | 'duration'>('rate');



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
        } as CalculatedTreasuryBondOffer;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rate':
            return b.baseInterestRate - a.baseInterestRate;
          case 'duration':
            return a.duration - b.duration;
          default:
            return b.baseInterestRate - a.baseInterestRate;
        }
      });
  }, [initialBondOffers, amount, expectedInflation, sortBy]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <label className="block text-gray-600 mb-2 font-medium text-center">Sortuj według:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rate' | 'duration')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0a472e] focus:outline-none"
            >
              <option value="rate">Oprocentowania</option>
              <option value="duration">Okresu</option>
            </select>
          </div>
        </div>
      </div>
      
      {calculatedOffers.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 border-l-4 border-[#0a472e] pl-4">
              Obligacje skarbowe ({formatCurrency(amount)} zł)
            </h2>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">{calculatedOffers.length}</span> opcji
            </div>
          </div>
          
          {/* Responsywna tabela */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obligacja</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oprocentowanie</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Okres</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zysk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Całkowity zwrot</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapitalizacja</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wypłata</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcja</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculatedOffers.map((bond, index) => (
                    <tr key={bond.symbol} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <BondBadge symbol={bond.symbol} size="sm" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{bond.interestDescription}</div>
                            <div className="text-xs text-gray-500">{bond.interestDescriptionV2}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900">{bond.baseInterestRate.toFixed(2)}%</div>
                        {['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol) && (
                          <div className="text-xs text-blue-600">inflacyjne</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-900">
                          {bond.duration} {bond.duration === 1 ? 'rok' : bond.duration < 5 ? 'lata' : 'lat'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-[#0a472e]">
                          +{formatCurrency(bond.profit)} zł
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-900">
                          {formatCurrency(bond.totalReturn)} zł
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          bond.capitalization.includes('Kapitalizacja') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bond.capitalization.includes('Kapitalizacja') ? 'Tak' : 'Nie'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{bond.payday}</div>
                      </td>
                      <td className="px-4 py-4">
                        <a 
                          href={bond.url !== '/#' ? bond.url : "https://www.gov.pl/web/finanse/skarb-panstwa-obligacje-skarbowe"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-[#0a472e] hover:bg-[#0c5a3a] transition-colors"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          Kup online
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {calculatedOffers.map((bond, index) => (
                <div key={bond.symbol} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <BondBadge symbol={bond.symbol} size="md" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bond.interestDescription}</div>
                        <div className="text-xs text-gray-500">{bond.interestDescriptionV2}</div>
                      </div>
                    </div>
                    <a 
                      href={bond.url !== '/#' ? bond.url : "https://www.gov.pl/web/finanse/skarb-panstwa-obligacje-skarbowe"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-[#0a472e] hover:bg-[#0c5a3a] transition-colors"
                    >
                      Kup
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Oprocentowanie</div>
                      <div className="font-semibold">
                        {bond.baseInterestRate.toFixed(2)}%
                        {['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol) && (
                          <span className="text-blue-600 text-xs ml-1">*</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Okres</div>
                      <div className="font-semibold">
                        {bond.duration} {bond.duration === 1 ? 'rok' : bond.duration < 5 ? 'lata' : 'lat'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Zysk</div>
                      <div className="font-bold text-[#0a472e]">+{formatCurrency(bond.profit)} zł</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Kapitalizacja</div>
                      <div className="font-semibold">
                        {bond.capitalization.includes('Kapitalizacja') ? 'Tak' : 'Nie'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Wypłata</div>
                      <div className="font-semibold">{bond.payday}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Brak obligacji dla wybranych kryteriów.</p>
          <p className="text-gray-400 mt-2">Spróbuj zmienić filtry lub kategorię.</p>
        </div>
      )}
    </div>
  );
}