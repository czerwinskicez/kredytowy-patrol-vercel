import React from 'react';

export function TrustBar() {
  // You can add content for the trust bar here later
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4 lg:max-w-6xl">
        <div className="flex justify-around items-center">
          {/* Example logos */}
          <img src="/logos/citi.png" alt="Citi Handlowy" className="h-8" />
          <img src="/logos/pekao.png" alt="Bank Pekao" className="h-8" />
          <img src="/logos/alior.png" alt="Alior Bank" className="h-8" />
          <img src="/logos/velo.png" alt="VeloBank" className="h-8" />
        </div>
      </div>
    </div>
  );
} 