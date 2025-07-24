"use client";
import React from 'react';
import type { CalculatedLoanOffer } from '@/types';

type LoanDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loan: CalculatedLoanOffer;
};

export function LoanDetailModal({ isOpen, onClose, loan }: LoanDetailModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Zamknij"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-center mb-6">
          <img src={loan.logo} alt={`${loan.provider} logo`} className="h-12 mr-6" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{loan.provider}</h2>
            <p className="text-md text-gray-600">{loan.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Całkowita kwota do spłaty</p>
                <p className="text-xl font-bold text-gray-800">{loan.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            </div>
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Miesięczna rata</p>
                <p className="text-2xl font-bold text-[#0a472e]">{loan.monthlyRate.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            </div>
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Prowizja</p>
                <p className="text-xl font-bold text-gray-800">{loan.commission} %</p>
            </div>
            <div className="border-b pb-2">
                <p className="text-sm text-gray-500">RRSO</p>
                <p className="text-xl font-bold text-gray-800">{loan.rrso.toFixed(2)} %</p>
            </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Reprezentatywny przykład</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{loan.representativeExample}</p>
        </div>
        
        <div className="mt-8 text-right">
            <button className="bg-[#f0c14b] hover:bg-[#e0b03b] text-[#0a472e] font-bold py-3 px-8 rounded-lg transition-colors">
              Przejdź do wniosku
            </button>
        </div>
      </div>
    </div>
  );
} 