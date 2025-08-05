"use client";
import React, { useState, useMemo } from 'react';
import { CustomSlider } from './CustomSlider';
import { BondBadge } from './BondBadge';
import { GridIcon, ListIcon, InfoIcon, SortIcon, ProfitIcon, DurationIcon, ViewIcon } from './icons';
import { ProfitChart } from './ProfitChart';
import type { TreasuryBondOffer } from '@/types';
import { calculateTreasuryBondOffers } from '@/lib/treasury-bonds-calculations';

type TreasuryBondOffersProps = {
  initialBondOffers: TreasuryBondOffer[];
  title?: string;
};

type ViewMode = 'grid' | 'list';
type SortBy = 'profit' | 'duration';

export function TreasuryBondOffers({ 
  initialBondOffers, 
  title = "Porównanie Obligacji Skarbowych",
}: TreasuryBondOffersProps) {
  const [amount, setAmount] = useState(10000);
  const [expectedInflation, setExpectedInflation] = useState(4.0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('profit');
  const [includeTax, setIncludeTax] = useState(true);
  const [hideFamilyBonds, setHideFamilyBonds] = useState(false);
  const maxPossibleAmount = 100000;

  const filteredOffers = useMemo(() => {
    let offers = initialBondOffers;
    if (hideFamilyBonds) {
      offers = offers.filter(bond => !['ROS', 'ROD'].includes(bond.symbol));
    }
    return offers;
  }, [initialBondOffers, hideFamilyBonds]);

  const calculatedOffers = useMemo(() => {
    return calculateTreasuryBondOffers(filteredOffers, amount, expectedInflation, includeTax)
      .sort((a, b) => {
        switch (sortBy) {
          case 'profit':
            return b.profit - a.profit;
          case 'duration':
            return a.duration - b.duration;
          default:
            return b.profit - a.profit;
        }
      });
  }, [filteredOffers, amount, expectedInflation, includeTax, sortBy]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };
  
  const formatCurrencyDetailed = (value: number) => {
    return value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">Porównaj zyski z różnych obligacji i wybierz najlepszą opcję.</p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <label htmlFor="bondAmountInput" className="block text-gray-600 font-semibold mb-2 sm:mb-0">Kwota inwestycji:</label>
              <div className="flex items-baseline space-x-2 w-full sm:w-auto">
                <input id="bondAmountInput" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="font-bold text-2xl text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-full sm:w-40 text-right bg-transparent" min={500} max={maxPossibleAmount} step={500} />
                <span className="text-xl text-gray-600">zł</span>
              </div>
            </div>
            <CustomSlider value={amount} onChange={setAmount} min={500} max={maxPossibleAmount} step={500} />
            <div className="flex justify-between text-sm text-gray-500 mt-2"><span>500 zł</span><span>{formatCurrency(maxPossibleAmount)} zł</span></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="inflationInput" className="block text-gray-600 font-semibold">Oczekiwana inflacja:</label>
              <div className="flex items-baseline space-x-2">
                <input id="inflationInput" type="number" value={expectedInflation} onChange={(e) => setExpectedInflation(Number(e.target.value))} className="font-bold text-2xl text-[#0a472e] border-b-2 border-gray-300 focus:border-[#f0c14b] outline-none transition-colors w-20 text-right bg-transparent" min={0} max={20} step={0.5} />
                <span className="text-xl text-gray-600">%</span>
              </div>
            </div>
            <CustomSlider value={expectedInflation} onChange={setExpectedInflation} min={0} max={20} step={0.5} />
            <div className="flex justify-between text-sm text-gray-500 mt-2"><span>0%</span><span>20%</span></div>
            <p className="text-xs text-gray-500 mt-2">💡 Wpływa na obligacje inflacyjne (COI, EDO, ROS, ROD)</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4 md:gap-8">
              <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={includeTax} onChange={() => setIncludeTax(!includeTax)} className="h-5 w-5 rounded border-gray-300 text-[#0a472e] focus:ring-[#0a472e]" />
                      <span className="text-sm font-medium text-gray-700">Licz podatek Belki (19%)</span>
                  </label>
                  <div className="tooltip" tabIndex={0}>
                      <InfoIcon className="w-4 h-4 text-gray-500" />
                      <span className="tooltip-text">Zysk zostanie pomniejszony o 19% podatek od zysków kapitałowych.</span>
                  </div>
              </div>
              <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={hideFamilyBonds} onChange={() => setHideFamilyBonds(!hideFamilyBonds)} className="h-5 w-5 rounded border-gray-300 text-[#0a472e] focus:ring-[#0a472e]" />
                      <span className="text-sm font-medium text-gray-700">Ukryj obligacje rodzinne (tylko dla rodzin 800+)</span>
                  </label>
                  <div className="tooltip" tabIndex={0}>
                      <InfoIcon className="w-4 h-4 text-gray-500" />
                      <span className="tooltip-text">Obligacje ROS i ROD są dostępne tylko dla beneficjentów programu Rodzina 800+.</span>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <ProfitChart offers={calculatedOffers} amount={amount} />

      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-6">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <span className="text-sm font-medium text-gray-600 px-3 flex items-center"><SortIcon className="w-4 h-4 mr-1"/>Sortuj:</span>
            <button onClick={() => setSortBy('profit')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortBy === 'profit' ? 'bg-white text-[#0a472e] shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}><ProfitIcon className="w-4 h-4"/><span>Zysk</span></button>
            <button onClick={() => setSortBy('duration')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortBy === 'duration' ? 'bg-white text-[#0a472e] shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}><DurationIcon className="w-4 h-4"/><span>Okres</span></button>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <span className="text-sm font-medium text-gray-600 px-3 flex items-center"><ViewIcon className="w-4 h-4 mr-1"/>Widok:</span>
            <button onClick={() => setViewMode('grid')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white text-[#0a472e] shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}><GridIcon className="w-4 h-4" /><span>Siatka</span></button>
            <button onClick={() => setViewMode('list')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-[#0a472e] shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}><ListIcon className="w-4 h-4" /><span>Lista</span></button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {calculatedOffers.map((bond, index) => (
            <div key={bond.symbol} className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <BondBadge symbol={bond.symbol} size="lg" />
                <div className="text-xs text-gray-500">#{index + 1} w rankingu</div>
              </div>
              <h4 className="font-bold text-gray-800 mb-2 break-words">{bond.interestDescriptionV2}</h4>
              <div className="space-y-3 flex-grow mb-4">
                <div className="flex justify-between"><span className="text-sm text-gray-600">Zysk:</span><span className="font-bold text-[#0a472e]">+{formatCurrencyDetailed(bond.profit)} zł</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Zwrot:</span><span className="font-semibold">{formatCurrencyDetailed(bond.totalReturn)} zł</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Okres:</span><span className="font-semibold">{bond.duration < 1 ? `${bond.duration * 12} miesięcy` : `${bond.duration} ${bond.duration === 1 ? 'rok' : 'lata'}`}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Oprocentowanie:</span><span className="font-semibold">{['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol) ? `${(bond as any).effectiveRate?.toFixed(2) || bond.baseInterestRate}%*` : `${bond.baseInterestRate}%`}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Kapitalizacja:</span><span className="font-semibold">{bond.capitalization.includes('Kapitalizacja') ? 'Tak' : 'Nie'}</span></div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-200"><a href={bond.url !== '/#' ? bond.url : "https://www.gov.pl/web/finanse/skarb-panstwa-obligacje-skarbowe"} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-3 px-2 sm:px-4 rounded-lg transition-colors text-sm leading-tight">Kup {bond.symbol} Online</a></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-2 py-3 sm:px-4">Obligacja</th>
                  <th className="px-2 py-3 sm:px-4">Oprocentowanie</th>
                  <th className="px-2 py-3 sm:px-4">Okres</th>
                  <th className="px-2 py-3 sm:px-4">Zysk</th>
                  <th className="px-2 py-3 sm:px-4">Całkowity zwrot</th>
                  <th className="px-2 py-3 sm:px-4">Akcja</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calculatedOffers.map((bond) => (
                  <tr key={bond.symbol} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 sm:px-4 sm:py-4"><div className="flex items-center space-x-2 sm:space-x-3"><BondBadge symbol={bond.symbol} size="sm" /><div><div className="text-sm font-medium text-gray-900">{bond.interestDescription}</div><div className="text-xs text-gray-500">{bond.interestDescriptionV2}</div></div></div></td>
                    <td className="px-2 py-3 sm:px-4 sm:py-4"><div className="text-sm font-semibold text-gray-900">{bond.baseInterestRate.toFixed(2)}%</div>{['COI', 'EDO', 'ROS', 'ROD'].includes(bond.symbol) && <div className="text-xs text-blue-600">inflacyjne</div>}</td>
                    <td className="px-2 py-3 sm:px-4 sm:py-4"><span className="text-sm text-gray-900">{bond.duration < 1 ? `${bond.duration * 12} mies.` : `${bond.duration} ${bond.duration === 1 ? 'rok' : 'lat'}`}</span></td>
                    <td className="px-2 py-3 sm:px-4 sm:py-4"><span className="text-sm font-bold text-[#0a472e]">+{formatCurrency(bond.profit)} zł</span></td>
                    <td className="px-2 py-3 sm:px-4 sm:py-4"><span className="text-sm text-gray-900">{formatCurrency(bond.totalReturn)} zł</span></td>
                    <td className="px-2 py-3 sm:px-4 sm:py-4"><a href={bond.url !== '/#' ? bond.url : "https://www.gov.pl/web/finanse/skarb-panstwa-obligacje-skarbowe"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-[#0a472e] hover:bg-[#0c5a3a] transition-colors whitespace-nowrap">Kup online</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white pointer-events-none lg:hidden"></div>
        </div>
      )}
    </div>
  );
}