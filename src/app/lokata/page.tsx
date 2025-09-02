import { DepositComparisonSection } from '@/components/DepositComparisonSection';
import { getDepositOffers } from '@/lib/google-sheets';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/PageWrapper';
import { Faq } from '@/components/Faq';

export const metadata: Metadata = {
  title: 'Najlepsze Lokaty Bankowe - Porównywarka i Ranking Lokat',
  description: 'Znajdź najlepsze lokaty bankowe. Porównaj oprocentowanie lokat terminowych i online. Nasz ranking lokat pomoże Ci wybrać najkorzystniejszą ofertę i zmaksymalizować zyski.'
};

const faqItems = [
    { question: 'Czym jest lokata terminowa i jak działa kapitalizacja?', answer: 'Lokata to depozyt na określony czas; bank dopisuje odsetki zwykle na koniec okresu (rzadziej częściej). Częstotliwość kapitalizacji wpływa na zysk.' },
    { question: 'Czy mogę zerwać lokatę przed terminem i co tracę?', answer: 'Zazwyczaj tak, ale konsekwencją jest utrata części lub wszystkich odsetek (kapitał wraca w całości). Dokładne zasady są w regulaminie danej lokaty.' },
    { question: 'Jaki jest poziom gwarancji BFG dla lokat?', answer: 'Depozyty są chronione do równowartości 100 000 EUR na jednego deponenta w jednym banku.' },
    { question: 'Czy gwarancja obejmuje odsetki?', answer: 'Tak — BFG obejmuje także należne odsetki naliczone do dnia spełnienia warunku gwarancji.' },
    { question: 'Kto pobiera „podatek Belki” od lokaty i ile wynosi?', answer: 'To 19% zryczałtowanego podatku od zysków kapitałowych; bank pobiera go automatycznie jako płatnik — nie rozliczasz tego w PIT.' },
    { question: 'Co najbardziej wpływa na zysk z lokaty?', answer: 'Oprocentowanie (w skali roku), okres, kapitalizacja i podatek. W kalkulatorach sprawdzisz to na przykładach.' },
    { question: 'Lokata stałoprocentowa czy zmiennoprocentowa — co częstsze?', answer: 'Na rynku detalicznym dominują lokaty stałoprocentowe (oprocentowanie nie zmienia się w trakcie umowy); warianty „progresywne” lub indeksowane to wyjątki.' },
    { question: 'Czy lokatę założę online?', answer: 'Tak — większość banków udostępnia zakładanie lokat przez bankowość internetową/apkę. Warunki i kapitalizacja są opisane przy ofercie.' },
    { question: 'Czy lokaty różnią się kapitalizacją?', answer: 'Tak. Najczęściej kapitalizacja na koniec okresu, ale zdarzają się częstsze (miesięczna/kwartalna). Im częstsza kapitalizacja, tym wyższy efektywny zysk.' },
    { question: 'Lokata vs konto oszczędnościowe — co wybrać?', answer: 'Lokata „zamyka” środki na termin (zwykle wyższe, stałe oprocentowanie). Konto oszczędnościowe daje swobodny dostęp i z reguły zmienne oprocentowanie.' },
];

export default async function LokataPage() {
  const depositOffers = await getDepositOffers();

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 lg:max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Ranking Lokat Bankowych</h1>
        <p className="text-lg text-gray-600 mb-8">
          Skorzystaj z naszej porównywarki, aby znaleźć najwyżej oprocentowane lokaty terminowe i online. Wybierz najlepszą ofertę i zacznij oszczędzać!
        </p>
        <DepositComparisonSection
          initialDepositOffers={depositOffers}
          title="Porównaj lokaty"
        />
      </div>
      <Faq title="Najczęściej zadawane pytania o lokaty" items={faqItems} />
    </PageWrapper>
  );
} 