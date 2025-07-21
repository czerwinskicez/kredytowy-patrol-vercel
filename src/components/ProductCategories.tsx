import React from 'react';
const categories = [{
  id: 'savings',
  name: 'Konta oszczędnościowe',
  icon: '💹'
}, {
  id: 'cash',
  name: 'Kredyty gotówkowe',
  icon: '💵'
}, {
  id: 'mortgage',
  name: 'Kredyty hipoteczne',
  icon: '🏠'
}, {
  id: 'loans',
  name: 'Pożyczki',
  icon: '💰'
},{
  id: 'consolidation',
  name: 'Kredyty konsolidacyjne',
  icon: '💸'
}, {
  id: 'properties',
  name: 'Lokaty',
  icon: '🏛️'
}, {
  id: 'currency',
  name: 'Lokaty walutowe',
  icon: '💱'
}, {
  id: 'bonds',
  name: 'Obligacje skarbowe',
  icon: '📝'
}, ];
export function ProductCategories() {
  return <section className="bg-[#0a472e] py-16">
      <div className="container mx-auto px-4 lg:max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => <div key={category.id} className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-[#f0c14b] hover:scale-105">
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-medium text-[#0a472e]">
                {category.name}
              </h3>
            </div>)}
        </div>
      </div>
    </section>;
}