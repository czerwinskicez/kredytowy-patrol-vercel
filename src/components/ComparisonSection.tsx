import React from 'react';
import { LoanCard } from './LoanCard';
import { SlidersIcon } from 'lucide-react';
// Mock data for loan offers
const loanData = {
  mortgage: [{
    provider: 'GreenPath Mortgage',
    logoInitials: 'GP',
    rating: 4,
    reviewCount: 1243,
    featured: true,
    interestRate: 5.25,
    aprRange: '5.25% - 6.10%',
    minAmount: '50,000',
    maxAmount: '2,000,000',
    term: '15-30 years',
    fundingTime: '30-45 days',
    highlights: ['Low down payment options available', 'No application fees', 'Rate lock guarantee for 60 days'],
    requirements: ['Minimum credit score of 620', 'Debt-to-income ratio under 43%', 'Proof of steady income'],
    minCreditScore: 620
  }, {
    provider: 'Golden Home Loans',
    logoInitials: 'GL',
    rating: 5,
    reviewCount: 879,
    featured: false,
    interestRate: 5.75,
    aprRange: '5.75% - 6.25%',
    minAmount: '100,000',
    maxAmount: '3,000,000',
    term: '10-30 years',
    fundingTime: '21-30 days',
    highlights: ['Specialized in jumbo loans', 'Personalized rate quotes in minutes', 'Digital application process'],
    requirements: ['Minimum credit score of 680', '20% down payment preferred', 'Maximum 36% debt-to-income ratio'],
    minCreditScore: 680
  }, {
    provider: 'First National Bank',
    logoInitials: 'FN',
    rating: 4,
    reviewCount: 1052,
    featured: false,
    interestRate: 5.35,
    aprRange: '5.35% - 5.90%',
    minAmount: '75,000',
    maxAmount: '1,500,000',
    term: '15-30 years',
    fundingTime: '25-35 days',
    highlights: ['First-time homebuyer programs', 'Flexible qualification requirements', 'No prepayment penalties'],
    requirements: ['Minimum credit score of 640', '3.5% minimum down payment', 'Stable employment history'],
    minCreditScore: 640
  }],
  auto: [{
    provider: 'Drive Finance',
    logoInitials: 'DF',
    rating: 4,
    reviewCount: 932,
    featured: true,
    interestRate: 3.49,
    aprRange: '3.49% - 7.25%',
    minAmount: '5,000',
    maxAmount: '100,000',
    term: '24-84 months',
    fundingTime: '1-3 days',
    highlights: ['Pre-approval in minutes', 'No early payoff penalties', 'Rate discounts for autopay'],
    requirements: ['Minimum credit score of 600', 'Proof of income', 'Vehicle must be under 10 years old'],
    minCreditScore: 600
  }
  // More auto loan data would go here
  ],
  personal: [{
    provider: 'Emerald Personal Loans',
    logoInitials: 'EP',
    rating: 5,
    reviewCount: 1426,
    featured: true,
    interestRate: 7.99,
    aprRange: '7.99% - 15.49%',
    minAmount: '1,000',
    maxAmount: '50,000',
    term: '12-60 months',
    fundingTime: 'Next business day',
    highlights: ['No origination fees', 'Fixed monthly payments', 'Direct deposit to your bank account'],
    requirements: ['Minimum credit score of 680', 'Verifiable income', 'Maximum 40% debt-to-income ratio'],
    minCreditScore: 680
  }
  // More personal loan data would go here
  ],
  // Default data for other categories
  default: [{
    provider: 'Sample Loan Provider',
    logoInitials: 'SL',
    rating: 4,
    reviewCount: 850,
    featured: true,
    interestRate: 6.25,
    aprRange: '6.25% - 12.99%',
    minAmount: '5,000',
    maxAmount: '100,000',
    term: '1-10 years',
    fundingTime: '1-5 business days',
    highlights: ['Competitive rates', 'Flexible terms', 'Simple application process'],
    requirements: ['Good credit history', 'Stable income', 'U.S. citizenship or permanent residency'],
    minCreditScore: 650
  }, {
    provider: 'Financial Solutions',
    logoInitials: 'FS',
    rating: 3,
    reviewCount: 623,
    featured: false,
    interestRate: 7.15,
    aprRange: '7.15% - 14.50%',
    minAmount: '2,500',
    maxAmount: '75,000',
    term: '1-7 years',
    fundingTime: '2-7 business days',
    highlights: ['No prepayment penalties', 'Multiple repayment options', 'Special rates for existing customers'],
    requirements: ['Minimum credit score of 600', 'Proof of income', 'Active bank account'],
    minCreditScore: 600
  }]
};
export function ComparisonSection({
  activeCategory
}) {
  // Get loan data for the active category or use default if not available
  const loans = loanData[activeCategory] || loanData.default;
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Best{' '}
          {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}{' '}
          Loans
        </h2>
        <button className="flex items-center text-sm bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
          <SlidersIcon className="h-4 w-4 mr-2" />
          Filter Results
        </button>
      </div>
      <div className="space-y-6">
        {loans.map((loan, index) => <LoanCard key={index} loan={loan} />)}
      </div>
    </div>;
}