"use client";
import React from 'react';
import type { CalculatedLoanOffer } from '@/types';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

type LoanDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loan: CalculatedLoanOffer;
};

export function LoanDetailModal({ isOpen, onClose, loan }: LoanDetailModalProps) {
  if (!isOpen) {
    return null;
  }

  const renderCheckmark = (condition: boolean) => {
    return condition ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Zamknij"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Nowy layout: nazwa banku, logo, nazwa kredytu */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0a472e] mb-4">{loan.provider}</h2>
          <div className="flex justify-center mb-4">
            <img src={loan.logo} alt={`${loan.provider} logo`} className="h-12 sm:h-16 md:h-20 object-contain" />
          </div>
          <p className="text-sm sm:text-md md:text-lg text-gray-600 font-medium">{loan.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-4 mb-6 text-center">
            <div className="border-b pb-3 sm:pb-2">
                <p className="text-sm sm:text-base text-gray-500 font-medium">Całkowita kwota</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{loan.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            </div>
            <div className="border-b pb-3 sm:pb-2">
                <p className="text-sm sm:text-base text-gray-500 font-medium">Miesięczna rata</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#0a472e]">{loan.monthlyRate.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            </div>
            <div className="border-b pb-3 sm:pb-2">
                <p className="text-sm sm:text-base text-gray-500 font-medium">Prowizja</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{loan.commission} %</p>
            </div>
            <div className="border-b pb-3 sm:pb-2">
                <p className="text-sm sm:text-base text-gray-500 font-medium">RRSO</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{loan.rrso} %</p>
            </div>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-500 mb-6 px-2">
          <p>{loan.representativeExample}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Warunki oferty</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-center gap-2">
                {renderCheckmark(loan.acceptsBik)}
                <span>Akceptacja wpisów w BIK</span>
              </li>
              <li className="flex items-center gap-2">
                {renderCheckmark(loan.acceptsKrd)}
                <span>Akceptacja wpisów w KRD</span>
              </li>
              <li className="flex items-center gap-2">
                {renderCheckmark(loan.age?.min ? loan.age.min >= 18 : true)}
                <span>Wiek min. {loan.age?.min || 18} lat</span>
              </li>
              <li className="flex items-center gap-2">
                {renderCheckmark(loan.age?.max ? loan.age.max <= 80 : true)}
                <span>Wiek max. {loan.age?.max || 80} lat</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Wymagane dokumenty</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              {(loan.requiredDocuments || []).map((doc, i) => (
                <li key={i} className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center sm:text-right">
          <button className="w-full sm:w-auto bg-[#f0c14b] hover:bg-[#e0b03b] text-[#0a472e] font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base">
            Przejdź do oferty
          </button>
        </div>
      </div>
    </div>
  );
} 