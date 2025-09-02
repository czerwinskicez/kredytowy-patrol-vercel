import { getTreasuryBondOffers } from '@/lib/google-sheets';
import { TreasuryBondOffers } from '@/components/TreasuryBondOffers';
import { TreasuryBondOffer } from '@/types';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/PageWrapper';
import { Faq } from '@/components/Faq';

const title = 'Obligacje Skarbowe - Porównaj i Wybierz Najlepsze';
const description = 'Znajdź najlepsze obligacje skarbowe. Porównaj oprocentowanie OTS, ROR, DOR, TOS, COI, EDO, ROS, ROD. Interaktywny kalkulator zysków.';
const url = "/obligacje-skarbowe";

export const metadata: Metadata = {
  title,
  description,
  keywords: "obligacje skarbowe, obligacje skarbu państwa, inwestycje, OTS, ROR, DOR, TOS, COI, EDO, ROS, ROD, oprocentowanie obligacji, symulator obligacji, kalkulator obligacji, porównanie obligacji, obligacje 2024, bezpieczne inwestycje, oszczędzanie, kapitalizacja odsetek, obligacje długoterminowe, obligacje krótkoterminowe, inflacja plus, obligacje rodzinne",
  openGraph: {
    title,
    description,
    url,
    type: 'website',
  },
  alternates: {
    canonical: url,
  },
};

const faqItems = [
    { question: 'Jakie są rodzaje obligacji detalicznych i od jakiej kwoty?', answer: 'W ofercie są m.in. 3M (OTS), 1Y (ROR), 2Y (DOR), 3Y (TOS), 4Y (COI), 10Y (EDO); kupujesz zwykle od 100 zł. Sprzedaż co miesiąc.' },
    { question: 'Czym różnią się COI/EDO od TOS/DOR/ROR?', answer: 'COI/EDO są indeksowane inflacją (inflacja + marża od 2. roku), TOS ma stałe oprocentowanie, DOR/ROR — zmienne wg listu emisyjnego.' },
    { question: 'Jak działa indeksacja inflacyjna?', answer: 'Od 2. roku oprocentowanie to inflacja (CPI) + stała marża; w EDO odsetki kapitalizują się co roku.' },
    { question: 'Kiedy dostaję odsetki?', answer: 'W EDO przy wykupie (po kapitalizacji rocznej); w COI — co roku; w ROR/DOR — zwykle co miesiąc; w TOS — rocznie.' },
    { question: 'Czy mogę zakończyć inwestycję wcześniej i ile to kosztuje?', answer: 'Tak — jest opłata za przedterminowy wykup (od 0 zł dla OTS do 3 zł za EDO; COI/ROS 2 zł, DOR 0,70 zł, ROR 0,50 zł za sztukę — aktualne stawki w FAQ MF).' },
    { question: 'Gdzie i jak kupić obligacje detaliczne?', answer: 'Przez PKO BP (agent emisji) — online, telefonicznie lub w oddziale; sprzedaż prowadzona co miesiąc.' },
    { question: 'Czy podlegają podatkowi Belki?', answer: 'Tak — 19% od zysków kapitałowych. (Podatek dotyczy m.in. obligacji; pobór zgodnie z ustawą o PIT).' },
    { question: 'Czy można zamienić jedne obligacje na inne?', answer: 'Tak — zamiana starych serii na nowe jest możliwa wg zasad MF (inne dla OTS vs pozostałych).' },
    { question: 'Jaka jest minimalna jednostka i cena?', answer: 'Standardowo 100 zł za sztukę (rynek detaliczny).' },
    { question: 'Jak wybierać serię (horyzont/ryzyko/oprocentowanie)?', answer: 'Krótki horyzont → OTS/ROR/DOR/TOS; dłuższy i ochrona realnej wartości → COI/EDO (inflacja + marża, kapitalizacja). Sprawdź bieżącą ofertę MF.' },
];

export default async function TreasuryBondsPage() {
  const treasuryBondOffers: TreasuryBondOffer[] = await getTreasuryBondOffers();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": "https://www.kredytowypatrol.pl/obligacje-skarbowe",
    "mainEntity": {
      "@type": "FinancialProduct",
      "name": "Obligacje Skarbowe",
      "description": "Porównanie wszystkich dostępnych obligacji skarbowych",
      "provider": {
        "@type": "Government",
        "name": "Skarb Państwa"
      },
      "offers": treasuryBondOffers.map(bond => ({
        "@type": "Offer",
        "name": bond.interestDescription,
        "description": bond.interestDescriptionV3,
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": bond.baseInterestRate,
          "priceCurrency": "PLN"
        }
      }))
    }
  };

  return (
    <PageWrapper>
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="container mx-auto px-4 py-12 lg:max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Obligacje Skarbowe - wrzesień 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Porównaj wszystkie dostępne obligacje Skarbu Państwa. Sprawdź oprocentowanie, 
              oblicz zyski i wybierz najlepszą opcję inwestycyjną dla siebie.
            </p>
          </div>

          {/* Zunifikowany komponent obligacji z kalkulatorem i przełączaniem widoku */}
          <section>
            <TreasuryBondOffers 
              initialBondOffers={treasuryBondOffers}
              title="Kalkulator Obligacji Skarbowych"
            />
          </section>

          {/* Dodatkowe informacje SEO */}
          <section className="mt-16 bg-gray-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informacje o obligacjach skarbowych</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Co to są obligacje skarbowe?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Obligacje skarbowe to dłużne papiery wartościowe emitowane przez Skarb Państwa. 
                  To jedna z najbezpieczniejszych form inwestowania pieniędzy, gwarantowana przez państwo polskie. 
                  Możesz wybierać spośród różnych typów obligacji o różnych okresach zapadalności i oprocentowaniu.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Ochrona przed inflacją</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Obligacje COI, EDO, ROS i ROD to obligacje inflacyjne - ich oprocentowanie jest powiązane z inflacją. 
                  W naszym kalkulatorze możesz ustawić oczekiwaną inflację, aby zobaczyć jak wpłynie ona na rzeczywistą rentowność tych inwestycji.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Dlaczego warto inwestować?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Obligacje skarbowe oferują stabilny zwrot z inwestycji przy minimalnym ryzyku. 
                  Niektóre obligacje są chronione przed inflacją, a inne oferują kapitalizację odsetek. 
                  To idealne rozwiązanie dla osób poszukujących bezpiecznego sposobu na pomnażanie oszczędności.
                </p>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-[#0a472e]">{treasuryBondOffers.length}</div>
                <div className="text-sm text-gray-600">Dostępnych obligacji</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-[#0a472e]">100%</div>
                <div className="text-sm text-gray-600">Gwarancji państwa</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-[#0a472e]">24/7</div>
                <div className="text-sm text-gray-600">Dostępność online</div>
              </div>
            </div>
          </section>

          {/* Sekcja o obligacjach rodzinnych ROS i ROD */}
          <section className="mt-12 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Obligacje Rodzinne ROS i ROD - dla beneficjentów programu Rodzina 800+</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Obligacje ROS (6-letnie) oraz ROD (12-letnie) to specjalne obligacje skarbowe przeznaczone wyłącznie dla rodzin korzystających z programu <strong>Rodzina 800+</strong> (wcześniej Rodzina 500+). Są one dedykowane osobom, które otrzymują świadczenie wychowawcze na dziecko do ukończenia 18. roku życia.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Te obligacje oferują oprocentowanie powiązane z inflacją, co zapewnia ochronę wartości oszczędności przed wzrostem cen. To atrakcyjna forma inwestowania dla rodzin, które chcą zabezpieczyć przyszłość swoich dzieci.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Limit wpłat:</strong> Kwota, którą można przeznaczyć na zakup obligacji rodzinnych, jest ograniczona do wysokości świadczenia otrzymywanego w ramach programu Rodzina 800+. Oznacza to, że maksymalna kwota inwestycji w obligacje ROS i ROD odpowiada sumie świadczeń wychowawczych otrzymanych na wszystkie dzieci w danym okresie (np. 800 zł miesięcznie na jedno dziecko).
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Więcej informacji o programie Rodzina 800+ i zasadach zakupu obligacji rodzinnych znajdziesz na stronie <a href="https://www.gov.pl/web/rodzina/rodzina-800-plus" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ministerstwa Rodziny i Polityki Społecznej</a> oraz na stronie <a href="https://www.gov.pl/web/finanse/oferta-oszczednosciowych-obligacji-skarbowych--czerwiec-2025-r" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ministerstwa Finansów</a>.
            </p>
          </section>
        </div>
        <Faq title="Najczęściej zadawane pytania o obligacje skarbowe" items={faqItems} />
      </>
    </PageWrapper>
  );
}
