import { ComparisonSection } from '@/components/ComparisonSection';
import { getLoanOffers } from '@/lib/google-sheets';
import type { LoanOffer } from '@/types';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/PageWrapper';

const loanTypeDetails: { [key: string]: { name: string; description: string, title: string } } = {
  'gotowkowy': {
    name: 'Kredyt Gotówkowy',
    title: 'Najlepsze Kredyty Gotówkowe - Porównywarka i Ranking',
    description: 'Znajdź najlepszy kredyt gotówkowy na dowolny cel. Porównaj oferty banków, sprawdź RRSO i wybierz najtańszy kredyt gotówkowy. Nasza porównywarka pomoże Ci podjąć właściwą decyzję.'
  },
  'hipoteczny': {
    name: 'Kredyt Hipoteczny',
    title: 'Kredyty Hipoteczne - Porównywarka i Kalkulator Zdolności',
    description: 'Porównaj kredyty hipoteczne z różnych banków. Sprawdź warunki, oprocentowanie i RRSO. Znajdź najkorzystniejszy kredyt na mieszkanie lub dom. Oferujemy również kredyt bez wkładu własnego.'
  },
  'konsolidacyjny': {
    name: 'Kredyt Konsolidacyjny',
    title: 'Kredyty Konsolidacyjne - Porównaj i Oblicz Ratę',
    description: 'Połącz swoje dotychczasowe zobowiązania w jeden tańszy kredyt konsolidacyjny. Obniż miesięczne raty i uporządkuj swoje finanse. Sprawdź ranking kredytów konsolidacyjnych.'
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const details = loanTypeDetails[slug] || { name: 'Ranking Kredytów', description: 'Porównaj oferty kredytowe.', title: 'Ranking Kredytów' };

  return {
    title: details.title,
    description: details.description,
  };
}

export default async function KredytPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const loanOffers = await getLoanOffers(slug);
  const details = loanTypeDetails[slug] || { name: 'Ranking Kredytów', description: 'Porównaj oferty kredytowe.' };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{details.name}</h1>
        <p className="text-lg text-gray-600 mb-8">{details.description}</p>
        <ComparisonSection
          initialLoanOffers={loanOffers}
          title={`Porównaj ${details.name.toLowerCase()}`}
        />
      </div>
    </PageWrapper>
  );
}

export async function generateStaticParams() {
  return Object.keys(loanTypeDetails).map((slug) => ({
    slug,
  }));
} 