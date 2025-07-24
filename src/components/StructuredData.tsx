import Script from 'next/script';
import {
  organizationJsonLd,
  websiteJsonLd,
  financialServiceJsonLd,
  breadcrumbJsonLd,
} from '@/lib/metadata';

interface StructuredDataProps {
  data?: object;
  includeDefaults?: boolean;
}

export function StructuredData({ data, includeDefaults = true }: StructuredDataProps) {
  const defaultStructuredData = [
    organizationJsonLd,
    websiteJsonLd,
    financialServiceJsonLd,
    breadcrumbJsonLd,
  ];

  const allData = includeDefaults 
    ? (data ? [...defaultStructuredData, data] : defaultStructuredData)
    : (data ? [data] : []);

  return (
    <>
      {allData.map((jsonLd, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      ))}
    </>
  );
} 