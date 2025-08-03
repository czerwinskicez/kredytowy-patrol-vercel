import { NextPage } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import MarkdownContent from '@/components/MarkdownContent';

const TermsOfServicePage: NextPage = () => {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <MarkdownContent filePath="docs/REGULAMIN SERWISU.md" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
