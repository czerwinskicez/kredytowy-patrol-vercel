'use client';

import React, { useState } from 'react';
import { useConsent } from '@/contexts/ConsentContext';

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, hideBanner } = useConsent();
  const [showDetails, setShowDetails] = useState(false);

  if (!showBanner) {
    return null;
  }

  if (showDetails) {
    return <CookiePreferences onBack={() => setShowDetails(false)} />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-4xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🍪 Ta strona używa cookies
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Używamy cookies do analizy ruchu, personalizacji treści i reklam oraz 
              zapewnienia funkcji mediów społecznościowych. Informacje o korzystaniu 
              z naszej witryny przekazujemy również naszym partnerom zajmującym się 
              analizą internetową, reklamą i mediami społecznościowymi.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Zgodnie z GDPR i Rozporządzeniem ePrivacy masz pełną kontrolę nad cookies.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
            <button
              onClick={() => setShowDetails(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Ustawienia
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Odrzuć wszystkie
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2 text-sm font-medium text-white bg-[#0a472e] hover:bg-[#0a472e]/90 rounded-lg transition-colors duration-200"
            >
              Akceptuj wszystkie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CookiePreferencesProps {
  onBack: () => void;
}

function CookiePreferences({ onBack }: CookiePreferencesProps) {
  const { consent, updateConsent, acceptAll, rejectAll, hideBanner } = useConsent();
  const [tempConsent, setTempConsent] = useState(consent);

  const handleSave = () => {
    updateConsent(tempConsent);
  };

  const toggleConsent = (key: keyof typeof consent) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    
    setTempConsent(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cookieCategories = [
    {
      key: 'necessary' as const,
      title: 'Niezbędne',
      description: 'Te cookies są niezbędne do działania strony i nie mogą być wyłączone.',
      details: 'Obejmują cookies sesji, bezpieczeństwa i podstawowej funkcjonalności.',
      required: true,
    },
    {
      key: 'analytics' as const,
      title: 'Analityczne',
      description: 'Pomagają nam analizować ruch na stronie i poprawiać jej działanie.',
      details: 'Google Analytics 4, Cloudflare Web Analytics, Vercel Analytics.',
      required: false,
    },
    {
      key: 'marketing' as const,
      title: 'Marketingowe',
      description: 'Używane do wyświetlania spersonalizowanych reklam i śledzenia konwersji.',
      details: 'Facebook Pixel, Google Ads, remarketing i personalizacja reklam.',
      required: false,
    },
    {
      key: 'preferences' as const,
      title: 'Preferencje',
      description: 'Zapamiętują Twoje ustawienia i personalizują doświadczenie.',
      details: 'Język, region, preferowany motyw i inne ustawienia użytkownika.',
      required: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Ustawienia prywatności
            </h2>
            <button
              onClick={hideBanner}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Zarządzaj swoimi preferencjami dotyczącymi cookies. Możesz zmienić te ustawienia w każdej chwili.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {cookieCategories.map((category) => (
            <div key={category.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {category.title}
                    {category.required && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Wymagane
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {category.description}
                  </p>
                </div>
                <div className="ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempConsent[category.key]}
                      onChange={() => toggleConsent(category.key)}
                      disabled={category.required}
                      className="sr-only peer"
                    />
                    <div className={`
                      relative w-11 h-6 rounded-full peer 
                      ${category.required ? 'bg-gray-300' : 'bg-gray-200'} 
                      peer-checked:bg-[#0a472e] 
                      peer-focus:outline-none 
                      peer-focus:ring-4 
                      peer-focus:ring-[#0a472e]/20
                      ${!category.required ? 'peer-checked:after:translate-x-full' : ''}
                      after:content-[''] 
                      after:absolute 
                      after:top-[2px] 
                      after:left-[2px] 
                      after:bg-white 
                      after:rounded-full 
                      after:h-5 
                      after:w-5 
                      after:transition-all
                      ${tempConsent[category.key] && !category.required ? 'after:translate-x-full' : ''}
                    `}></div>
                  </label>
                </div>
              </div>
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <strong>Szczegóły:</strong> {category.details}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Powrót
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Odrzuć wszystkie
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Akceptuj wszystkie
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium text-white bg-[#0a472e] hover:bg-[#0a472e]/90 rounded-lg transition-colors duration-200"
            >
              Zapisz ustawienia
            </button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border-t border-blue-200 text-xs text-blue-800">
          <p>
            <strong>Twoje prawa GDPR:</strong> Masz prawo do dostępu, sprostowania, usunięcia i przenoszenia swoich danych. 
            Możesz w każdej chwili wycofać zgodę. Skontaktuj się z nami: kontakt@kredytowy-patrol.pl
          </p>
        </div>
      </div>
    </div>
  );
} 