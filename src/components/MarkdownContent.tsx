
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'server-only';

interface MarkdownContentProps {
  filePath: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ filePath }) => {
  const content = fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');

  // Normalize headers from "### §X" and "### Title" on separate lines to a single "## §X Title"
  const processedContent = content.replace(
    /### \*\*(§\d+)\*\*\s*\n\s*### \*\*(.*?)\*\*/g,
    '## **$1 $2**'
  );

  return (
    <div className="prose prose-lg max-w-none prose-p:my-4 prose-li:my-0 prose-li:p:my-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            h1: ({...props}) => <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center" {...props} />,
            h2: ({...props}) => <h2 className="text-3xl font-bold text-gray-800 my-6 border-b-2 border-[#f0c14b] pb-3" {...props} />,
            h3: ({...props}) => <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-4" {...props} />,
            strong: ({...props}) => <strong className="font-semibold" {...props} />,
            ol: ({...props}) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
            ul: ({...props}) => <ul className="list-disc pl-6 space-y-2" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
