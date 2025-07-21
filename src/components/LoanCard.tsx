import React from 'react';
import { CheckIcon, XIcon, InfoIcon } from 'lucide-react';
export function LoanCard({
  loan
}) {
  return <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0a472e] text-white mr-4">
              {loan.logoInitials}
            </div>
            <div>
              <h3 className="font-bold text-lg">{loan.provider}</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => <svg key={i} className={`w-4 h-4 ${i < loan.rating ? 'text-[#f0c14b]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
                <span className="text-xs text-gray-500 ml-1">
                  ({loan.reviewCount})
                </span>
              </div>
            </div>
          </div>
          {loan.featured && <div className="bg-[#f0c14b] text-[#0a472e] text-xs font-bold py-1 px-2 rounded">
              FEATURED
            </div>}
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <div className="bg-gray-50 p-3 rounded-lg h-full">
              <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
              <p className="text-2xl font-bold text-[#0a472e]">
                {loan.interestRate}%
              </p>
              <p className="text-xs text-gray-500">APR from {loan.aprRange}</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <div className="bg-gray-50 p-3 rounded-lg h-full">
              <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
              <p className="text-lg font-bold text-gray-800">
                ${loan.minAmount} - ${loan.maxAmount}
              </p>
              <p className="text-xs text-gray-500">Term: {loan.term}</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-2">
            <div className="bg-gray-50 p-3 rounded-lg h-full">
              <p className="text-sm text-gray-500 mb-1">Funding Time</p>
              <p className="text-lg font-bold text-gray-800">
                {loan.fundingTime}
              </p>
              <p className="text-xs text-gray-500">After approval</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Highlights</h4>
            <ul>
              {loan.highlights.map((highlight, index) => <li key={index} className="flex items-start mb-1">
                  <CheckIcon className="h-4 w-4 text-[#0a472e] mr-2 mt-0.5" />
                  <span className="text-sm">{highlight}</span>
                </li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Requirements</h4>
            <ul>
              {loan.requirements.map((req, index) => <li key={index} className="flex items-start mb-1">
                  <InfoIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-sm">{req}</span>
                </li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="p-5 bg-gray-50 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-gray-500">Credit Score:</span>
          <span className="font-medium ml-1">{loan.minCreditScore}+</span>
        </div>
        <button className="bg-[#0a472e] hover:bg-[#0c5a3a] text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Apply Now
        </button>
      </div>
    </div>;
}