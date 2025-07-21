import React from 'react';
import type { CalculatedLoanOffer } from './ComparisonSection';

type LoanCardProps = {
  loan: CalculatedLoanOffer;
  rank: number;
};

export function LoanCard({ loan, rank }: LoanCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="text-lg font-bold text-gray-400 mr-4">Nr {rank}</div>
            <img src={loan.logo} alt={`${loan.provider} logo`} className="h-10 w-auto mr-4" />
            <div>
              <h3 className="font-bold text-lg text-gray-800">{loan.provider}</h3>
              <p className="text-sm text-gray-600">{loan.name}</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <button className="bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Wybierz
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        <div>
          <p className="text-sm text-gray-500">Całkowita kwota</p>
          <p className="text-lg font-bold text-gray-800">{loan.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Prowizja</p>
          <p className="text-lg font-bold text-gray-800">{loan.commission} %</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">RRSO</p>
          <p className="text-lg font-bold text-gray-800">{loan.rrso.toFixed(2)} %</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Miesięczna rata</p>
          <p className="text-2xl font-bold text-[#0a472e]">{loan.monthlyRate.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
        </div>
      </div>
      
      <div className="p-5 bg-gray-50 flex items-center justify-between mt-auto">
        <a href="#" className="text-sm font-semibold text-[#0a472e] hover:underline">
          Szczegóły oferty
        </a>
        <div className="md:hidden">
          <button className="bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Wybierz
          </button>
        </div>
      </div>
    </div>
  );
}