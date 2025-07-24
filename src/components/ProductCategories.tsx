import React from 'react';
import { FaLandmark, FaMoneyBillWave, FaHome, FaPiggyBank, FaFileInvoiceDollar, FaChartLine, FaCoins, FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';

const categories = [{
  id: 'savings',
  name: 'Konta oszczędnościowe',
  icon: <FaPiggyBank />,
  href: '#'
}, {
  id: 'cash',
  name: 'Kredyty gotówkowe',
  icon: <FaMoneyBillWave />,
  href: '/kredyty/gotowkowy'
}, {
  id: 'mortgage',
  name: 'Kredyty hipoteczne',
  icon: <FaHome />,
  href: '/kredyty/hipoteczny'
}, {
  id: 'loans',
  name: 'Pożyczki',
  icon: <FaFileInvoiceDollar />,
  href: '#'
},{
  id: 'consolidation',
  name: 'Kredyty konsolidacyjne',
  icon: <FaLandmark />,
  href: '/kredyty/konsolidacyjny'
}, {
  id: 'properties',
  name: 'Lokaty',
  icon: <FaChartLine />,
  href: '#'
}, {
  id: 'currency',
  name: 'Lokaty walutowe',
  icon: <FaCoins />,
  href: '#'
}, {
  id: 'bonds',
  name: 'Obligacje skarbowe',
  icon: <FaFileAlt />,
  href: '#'
}, ];
export function ProductCategories() {
  return <div className="py-16 relative z-10">
      <div className="container mx-auto px-4 lg:max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <Link href={category.href} key={category.id}>
              <div className="group bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-[#f0c14b] hover:scale-105 h-full">
                <div className="text-5xl mb-3 text-[#0a472e] group-hover:text-white">{category.icon}</div>
                <h3 className="text-lg font-medium text-[#0a472e] group-hover:text-white">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>;
}