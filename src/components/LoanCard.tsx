"use client";
import React, { useState } from 'react';
import type { CalculatedLoanOffer } from '@/types';
import { LoanDetailModal } from './LoanDetailModal';

type LoanCardProps = {
  loan: CalculatedLoanOffer;
  rank: number;
  isPromoted?: boolean;
};

export function LoanCard({ loan, rank, isPromoted = false }: LoanCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rankColors: { [key: number]: string } = {
    1: 'bg-[#f0c14b] text-[#0a472e]',
    2: 'bg-gray-300 text-gray-800',
    3: 'bg-yellow-700 text-white',
  };
  const rankColor = rankColors[rank] || 'bg-gray-200 text-gray-700';

  // console.log(loan);

  return (
    <>
      <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col relative border ${isPromoted ? 'border-[#f0c14b]' : 'border-gray-100'}`}>
        {!isPromoted && (
          <div 
            className={`absolute top-4 -left-1 px-3 py-1 text-xs font-bold rounded-r-md ${rankColor} shadow-sm`}
          >
            #{rank}
          </div>
        )}

        {isPromoted && (
          <div className="absolute top-4 -left-1 px-3 py-1 text-xs font-bold rounded-r-md bg-[#f0c14b] text-[#0a472e] shadow-sm">
            Promowane
          </div>
        )}

        {loan.extraLabel && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {loan.extraLabel}
          </div>
        )}
        
        <div className="p-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

            {/* Combined Info and Details */}
            <div className="md:col-span-10">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-shrink-0 w-24 h-10 flex items-center justify-center">
                  <img 
                    src={loan.logo} 
                    alt={`${loan.provider} logo`} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-col items-center space-y-1 md:flex-row md:items-baseline md:space-y-0 md:space-x-3">
                    <h3 className="font-bold text-lg text-gray-800">{loan.provider}</h3>
                    <p className="text-sm text-gray-600">{loan.name}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center md:text-left">
                    <div>
                      <p className="text-sm text-gray-500">Miesięczna rata</p>
                      <p className="text-xl font-bold text-[#0a472e]">{loan.monthlyRate.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">RRSO</p>
                      <p className="text-lg font-bold text-gray-800">{loan.rrso.toFixed(2)} %</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prowizja</p>
                      <p className="text-lg font-bold text-gray-800">{loan.commission} %</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Całkowita kwota</p>
                      <p className="text-lg font-bold text-gray-800">{loan.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex flex-col items-center md:items-end space-y-2">
              <button className="w-full md:w-auto bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Wybierz
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto text-sm font-semibold text-[#0a472e] hover:underline"
              >
                Szczegóły oferty
              </button>
            </div>
          </div>
        </div>
      </div>
      <LoanDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} loan={loan} />
    </>
  );
}