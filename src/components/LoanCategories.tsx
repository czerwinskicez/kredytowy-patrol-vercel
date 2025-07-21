import React from 'react';
import { HomeIcon, CarIcon, UserIcon, GraduationCapIcon, BuildingIcon, HomeIcon as HomeEquityIcon, CoinsIcon, BanknoteIcon } from 'lucide-react';
const categories = [{
  id: 'mortgage',
  name: 'Mortgage Loans',
  icon: <HomeIcon className="h-5 w-5" />
}, {
  id: 'auto',
  name: 'Auto Loans',
  icon: <CarIcon className="h-5 w-5" />
}, {
  id: 'personal',
  name: 'Personal Loans',
  icon: <UserIcon className="h-5 w-5" />
}, {
  id: 'student',
  name: 'Student Loans',
  icon: <GraduationCapIcon className="h-5 w-5" />
}, {
  id: 'business',
  name: 'Business Loans',
  icon: <BuildingIcon className="h-5 w-5" />
}, {
  id: 'homeEquity',
  name: 'Home Equity',
  icon: <HomeEquityIcon className="h-5 w-5" />
}, {
  id: 'debtConsolidation',
  name: 'Debt Consolidation',
  icon: <CoinsIcon className="h-5 w-5" />
}, {
  id: 'payday',
  name: 'Payday Loans',
  icon: <BanknoteIcon className="h-5 w-5" />
}];

type LoanCategoriesProps = {
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
};

export function LoanCategories({
  activeCategory,
  setActiveCategory
}: LoanCategoriesProps) {
  return <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {categories.map(category => <button key={category.id} className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${activeCategory === category.id ? 'bg-[#0a472e] text-white shadow-lg scale-105' : 'bg-white text-gray-700 border border-gray-200 hover:border-[#f0c14b]'}`} onClick={() => setActiveCategory(category.id)}>
            <div className={`mb-2 ${activeCategory === category.id ? 'text-[#f0c14b]' : 'text-[#0a472e]'}`}>
              {category.icon}
            </div>
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </button>)}
      </div>
    </div>;
}