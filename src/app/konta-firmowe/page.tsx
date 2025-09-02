import { BusinessAccountComparisonSection } from '@/components/BusinessAccountComparisonSection';
import { getBusinessAccountOffers } from '@/lib/google-sheets';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/PageWrapper';

export const metadata: Metadata = {
  title: 'Najlepsze Konta Firmowe - Ranking i Porównywarka 2024',
  description: 'Znajdź najlepsze konto firmowe dla swojego biznesu. Porównaj opłaty, bonusy i warunki prowadzenia rachunku firmowego. Nasz ranking kont firmowych pomoże Ci wybrać najkorzystniejszą ofertę.',
  openGraph: {
    title: 'Konta Firmowe - Ranking i Porównywarka Ofert Bankowych',
    description: 'Porównaj konta firmowe z różnych banków. Sprawdź opłaty za prowadzenie, karty płatnicze i wypłaty z bankomatów. Znajdź najlepsze konto dla swojej firmy.',
    url: '/konta-firmowe',
  },
  alternates: {
    canonical: '/konta-firmowe',
  },
};

export default async function BusinessAccountsPage() {
  const businessAccountOffers = await getBusinessAccountOffers();

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ranking Kont Firmowych</h1>
        <p className="text-lg text-gray-600 mb-8">
          Prowadzisz firmę i szukasz odpowiedniego konta bankowego? Porównaj opłaty, bonusy i warunki prowadzenia rachunku firmowego w najlepszych bankach w Polsce.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Wskazówka:</strong> Przy wyborze konta firmowego zwróć uwagę nie tylko na miesięczne opłaty, ale głównie na koszty transakcji.
              </p>
            </div>
          </div>
        </div>

        <BusinessAccountComparisonSection
          initialOffers={businessAccountOffers}
          title="Porównaj konta firmowe"
        />

        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Co warto wiedzieć o kontach firmowych?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Wymagane dokumenty</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Wypis z CEIDG lub KRS</li>
                <li>• Dokument tożsamości</li>
                <li>• Umowa spółki (dla spółek)</li>
                <li>• Pełnomocnictwo (jeśli dotyczy)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">💡 Na co zwrócić uwagę</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Miesięczne opłaty za prowadzenie</li>
                <li>• Koszty kart płatniczych</li>
                <li>• Opłaty za wypłaty z bankomatów</li>
                <li>• Bonusy za założenie konta</li>
                <li>• Dostępność bankowości internetowej</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
