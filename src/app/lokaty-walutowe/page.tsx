import { getCurrencyDepositOffers } from '@/lib/google-sheets';
import { CurrencyDepositRanking } from '@/components/CurrencyDepositRanking';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/PageWrapper';
import { Faq } from '@/components/Faq';

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

const faqItems = [
    { question: 'Czym jest lokata walutowa i dla kogo ma sens?', answer: 'To lokata prowadzona w walucie (np. EUR/USD) — dobra do dywersyfikacji walutowej, choć oprocentowanie bywa niższe niż w PLN.' },
    { question: 'Jakie jest ryzyko kursowe?', answer: 'Zysk/strata po przewalutowaniu na PLN zależy od kursu waluty w dniu wymiany; ruchy EUR/USD mogą zniwelować odsetki.' },
    { question: 'Czy BFG chroni konta/lokaty walutowe? W jakiej walucie wypłata?', answer: 'Tak — walutowe też są objęte. Wypłata gwarancji zawsze w PLN, po kursie NBP z dnia spełnienia warunku gwarancji.' },
    { question: 'Jaki jest limit gwarancji?', answer: 'Do 100 000 EUR na deponenta w danym banku (tak samo jak dla PLN).' },
    { question: 'Kto pobiera podatek od odsetek w walucie?', answer: 'Nadal 19% i nadal bank rozlicza go z automatu (z polskiego rezydenta).' },
    { question: 'Czy warunki zerwania są takie same jak w PLN?', answer: 'Co do zasady tak — wcześniejsze zerwanie zwykle oznacza utratę odsetek. Sprawdź regulamin konkretnej lokaty walutowej.' },
    { question: 'Jaki wpływ ma spread walutowy?', answer: 'Wynik w PLN zależy też od spreadu przy zakupie/sprzedaży waluty — to koszt poza oprocentowaniem.' },
    { question: 'Czy muszę mieć konto w tej walucie?', answer: 'Najczęściej tak (aby zasilić lokatę i otrzymać odsetki w danej walucie), choć banki oferują przewalutowanie — z kosztem spreadu.' },
    { question: 'Jak porównywać lokaty walutowe?', answer: 'Sprawdź oprocentowanie, okres, minimalną kwotę, ewentualne opłaty i warunki przewalutowania; pomocne są rankingi.' },
    { question: 'Alternatywy dla lokat walutowych?', answer: 'Konta oszczędnościowe walutowe (elastyczny dostęp, zwykle niższe oprocentowanie) lub fundusze/ETF-y walutowe (wyższe ryzyko).' },
];


export default async function CurrencyDepositsPage() {
  const currencyDepositOffers = await getCurrencyDepositOffers();

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ranking Lokat Walutowych</h1>
        <p className="text-lg text-gray-600 mb-8">
          Znajdź najlepszą lokatę walutową. Porównaj oprocentowanie lokat w EUR, USD, GBP i CHF, aby zmaksymalizować swoje zyski.
        </p>
        <CurrencyDepositRanking 
          initialDepositOffers={currencyDepositOffers} 
          title="Porównaj lokaty walutowe"
        />
      </div>
      <Faq title="Najczęściej zadawane pytania o lokaty walutowe" items={faqItems} />
    </PageWrapper>
  );
}
