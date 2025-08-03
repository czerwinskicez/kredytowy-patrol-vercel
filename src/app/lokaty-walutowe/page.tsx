import { getCurrencyDepositOffers } from '@/lib/google-sheets';
import { CurrencyDepositRanking } from '@/components/CurrencyDepositRanking';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { baseMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

const title = 'Ranking Lokat Walutowych - Porównaj Najlepsze Oferty';
const description = 'Znajdź najlepszą lokatę walutową. Porównaj oprocentowanie lokat w EUR, USD, GBP i CHF. Aktualne dane i ranking.';

export const metadata: Metadata = {
  ...baseMetadata,
  title,
  description,
  openGraph: {
    ...baseMetadata.openGraph,
    title,
    description,
    url: '/lokaty-walutowe',
  },
  alternates: {
    ...baseMetadata.alternates,
    canonical: '/lokaty-walutowe',
  },
};

export default async function CurrencyDepositsPage() {
  const currencyDepositOffers = await getCurrencyDepositOffers();

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Ranking Lokat Walutowych</h1>
        <CurrencyDepositRanking 
          initialDepositOffers={currencyDepositOffers} 
          title="Porównaj lokaty walutowe"
        />
      </main>
      <Footer />
    </div>
  );
}
