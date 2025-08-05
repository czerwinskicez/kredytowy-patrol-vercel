"use client";
import React from 'react';
import { BondBadge, bondColors } from './BondBadge';
import type { CalculatedTreasuryBondOffer } from '@/types';

type ProfitChartProps = {
  offers: CalculatedTreasuryBondOffer[];
  amount: number;
};

export function ProfitChart({ offers, amount }: ProfitChartProps) {
  const maxProfit = Math.max(...offers.map(bond => bond.profit), 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="bg-gray-50 p-4 lg:p-6 rounded-lg mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Wykres zysków dla {formatCurrency(amount)} zł</h3>
      <div className="space-y-3 lg:space-y-2">
        {offers.map((bond) => (
          <div key={bond.symbol} className="hidden lg:flex items-center gap-4">
            <div className="flex-shrink-0"><BondBadge symbol={bond.symbol} size="sm" /></div>
            <div className="w-40 flex-shrink-0"><div className="text-sm text-gray-600 truncate">{bond.interestDescription}</div></div>
            <div className="flex-1 relative">
              <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 relative" 
                  style={{ 
                    width: `${Math.max((bond.profit / maxProfit) * 100, 5)}%`, 
                    backgroundColor: bondColors[bond.symbol] || '#6B7280' 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-15"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-start pl-3">
                  <span className="text-xs font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                    {bond.baseInterestRate.toFixed(2)}% • {bond.duration < 1 ? `${bond.duration * 12}m` : `${bond.duration}l`}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-28 text-right flex-shrink-0"><span className="text-lg font-bold text-[#0a472e]">+{formatCurrency(bond.profit)} zł</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}