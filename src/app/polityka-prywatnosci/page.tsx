import { NextPage } from 'next';
import MarkdownContent from '@/components/MarkdownContent';
import { PageWrapper } from '@/components/PageWrapper';

const PrivacyPolicyPage: NextPage = () => {
  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <MarkdownContent filePath="docs/POLITYKA PRYWATNOŚCI.md" />
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default PrivacyPolicyPage;
