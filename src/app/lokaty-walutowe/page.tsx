import { getCurrencyDepositOffers } from '@/lib/google-sheets';
import { CurrencyDepositRanking } from '@/components/CurrencyDepositRanking';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';

const title = 'Lokaty Walutowe - Ranking i Porównywarka Ofert (EUR, USD, GBP, CHF)';
const description = 'Szukasz najlepszej lokaty walutowej? Porównaj oprocentowanie lokat w euro, dolarach, funtach i frankach. Nasz aktualny ranking pomoże Ci wybrać najkorzystniejszą ofertę.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: '/lokaty-walutowe',
  },
  alternates: {
    canonical: '/lokaty-walutowe',
  },
};

export default async function CurrencyDepositsPage() {
  const currencyDepositOffers = await getCurrencyDepositOffers();

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ranking Lokat Walutowych</h1>
        <p className="text-lg text-gray-600 mb-8">
          Znajdź najlepszą lokatę walutową. Porównaj oprocentowanie lokat w EUR, USD, GBP i CHF, aby zmaksymalizować swoje zyski.
        </p>
        <CurrencyDepositRanking 
          initialDepositOffers={currencyDepositOffers} 
          title="Porównaj lokaty walutowe"
        />
      </main>
      <Footer />
    </div>
  );
}
