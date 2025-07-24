import { AboutSection } from '@/components/AboutSection';
import { ComparisonSection } from '@/components/ComparisonSection';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
// import { TrustBar } from '@/components/TrustBar';
import { getLoanOffers } from '@/lib/google-sheets';

export default async function Home() {
  const loanOffers = await getLoanOffers('gotowkowy');

  return (
    <main>
      <Header />
      <HeroSection />
      <AboutSection />
      <div className="bg-gray-50/50 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <ComparisonSection initialLoanOffers={loanOffers} />
        </div>
      </div>
      <TestimonialsSection />
      {/* <TrustBar /> */}
      <Footer />
    </main>
  );
}