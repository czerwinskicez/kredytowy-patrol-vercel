
import { Metadata } from 'next';
import { Facebook, Instagram, Linkedin, Globe } from 'lucide-react';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import Link from 'next/link';
import { PageWrapper } from '@/components/PageWrapper';
import { NewsletterSection } from '@/components/NewsletterSection';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Kontakt - Kredytowy Patrol',
  description: 'Skontaktuj się z nami. Znajdziesz tutaj nasze dane firmowe oraz odnośniki do naszych mediów społecznościowych.',
  openGraph: {
    title: 'Kontakt - Kredytowy Patrol',
    description: 'Skontaktuj się z nami. Znajdziesz tutaj nasze dane firmowe oraz odnośniki do naszych mediów społecznościowych.',
    url: '/kontakt',
  },
  alternates: { canonical: '/kontakt' },
};

export default function KontaktPage() {
  return (
    <PageWrapper>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Skontaktuj się z nami</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              Masz pytania lub sugestie? Jesteśmy tutaj, aby pomóc. Poniżej znajdziesz nasze profile w mediach społecznościowych oraz formularz kontaktowy.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Karta z mediami społecznościowymi */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Globe className="mr-3 text-[#0a472e]" size={26} />
                Znajdź nas w sieci
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <a href="https://www.facebook.com/kredytowypatrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="Facebook Kredytowy Patrol" title="Facebook">
                  <Facebook size={24} />
                  <span>Facebook</span>
                </a>
                <a href="https://www.instagram.com/kredytowy_patrol/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="Instagram Kredytowy Patrol" title="Instagram">
                  <Instagram size={24} />
                  <span>Instagram</span>
                </a>
                <a href="https://x.com/kredytowypatrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="Profil X (Twitter)" title="X">
                  <FaXTwitter size={22} />
                  <span>X</span>
                </a>
                <a href="https://www.linkedin.com/company/kredytowy-patrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="LinkedIn Kredytowy Patrol" title="LinkedIn">
                  <Linkedin size={24} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://www.tiktok.com/@kredytowypatrol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#f0c14b] transition-colors" aria-label="TikTok Kredytowy Patrol" title="TikTok">
                  <FaTiktok size={22} />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Formularz kontaktowy */}
          <ContactForm />
        </div>
      </div>
      <NewsletterSection />
    </PageWrapper>
  );
}
