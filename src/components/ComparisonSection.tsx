"use client";
import React, { useState, useMemo } from 'react';
import { CustomSlider } from './CustomSlider';
import { LoanCard } from './LoanCard';
import { SlidersIcon } from 'lucide-react';

const loanOffers = [
  {
    provider: 'Citi Handlowy',
    logo: '/logos/citi.png',
    name: 'Pożyczka gotówkowa online dla nowych klientów - oferta specjalna',
    baseInterestRate: 8.99,
    commission: 0,
  },
  {
    provider: 'Bank Pekao',
    logo: '/logos/pekao.png',
    name: 'Pożyczka ekspresowa',
    baseInterestRate: 9.99,
    commission: 0,
  },
  {
    provider: 'Alior Bank',
    logo: '/logos/alior.png',
    name: 'Pożyczka internetowa',
    baseInterestRate: 10.15,
    commission: 0,
  },
  {
    provider: 'VeloBank',
    logo: '/logos/velo.png',
    name: 'Kredyt gotówkowy online',
    baseInterestRate: 9.5,
    commission: 2,
  },
];

export type CalculatedLoanOffer = {
  provider: string;
  logo: string;
  name: string;
  totalAmount: number;
  commission: number;
  rrso: number;
  monthlyRate: number;
};

export function ComparisonSection() {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(48);

  const calculatedOffers = useMemo(() => {
    return loanOffers
      .map(offer => {
        const principal = amount;
        const commissionAmount = principal * (offer.commission / 100);
        const totalPrincipal = principal + commissionAmount;
        const monthlyInterestRate = offer.baseInterestRate / 100 / 12;
        
        // Formula na ratę stałą
        const monthlyRate =
          totalPrincipal *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
          (Math.pow(1 + monthlyInterestRate, months) - 1);

        const totalAmount = monthlyRate * months;
        const totalInterest = totalAmount - principal;
        
        // Uproszczone obliczenie RRSO (dla celów demonstracyjnych)
        const rrso = (((totalAmount / principal) - 1) / (months / 12)) * 100;

        return {
          ...offer,
          totalAmount,
          monthlyRate,
          rrso: parseFloat(rrso.toFixed(2)),
          commission: offer.commission,
        };
      })
      .sort((a, b) => a.monthlyRate - b.monthlyRate);
  }, [amount, months]);

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dopasuj kredyt do swoich potrzeb</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Suwak kwoty */}
          <div>
            <label className="block text-gray-600 mb-2">Kwota pożyczki: <span className="font-bold text-lg text-[#0a472e]">{amount.toLocaleString('pl-PL')} zł</span></label>
            <CustomSlider
              value={amount}
              onChange={setAmount}
              min={5000}
              max={500000}
              step={5000}
            />
          </div>
          {/* Suwak okresu */}
          <div>
            <label className="block text-gray-600 mb-2">Okres spłaty: <span className="font-bold text-lg text-[#0a472e]">{months} miesięcy</span></label>
            <CustomSlider
              value={months}
              onChange={setMonths}
              min={12}
              max={120}
              step={1}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Najlepsze oferty dla kwoty {amount.toLocaleString('pl-PL')} zł na {months} miesięcy:
        </h2>
      </div>
      <div className="space-y-6">
        {calculatedOffers.map((loan, index) => <LoanCard key={index} loan={loan} rank={index + 1} />)}
      </div>
    </div>
  );
}