import { MetadataRoute } from 'next';
import { getLoanOffers, getDepositOffers } from '@/lib/google-sheets';
import { sheetNameMapping } from '@/lib/google-sheets';

const siteUrl = 'https://www.kredytowypatrol.pl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/lokata`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  const loanTypes = Object.keys(sheetNameMapping);
  const loanOffersPromises = loanTypes.map(type => getLoanOffers(type));
  const allLoanOffers = await Promise.all(loanOffersPromises);

  const loanRoutes = allLoanOffers.flat().map(offer => ({
    url: `${siteUrl}/kredyty/${offer.provider.toLowerCase().replace(/ /g, '-')}/${offer.name.toLowerCase().replace(/ /g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const depositOffers = await getDepositOffers();
  const depositRoutes = depositOffers.map(offer => ({
    url: `${siteUrl}/lokata/${offer.provider.toLowerCase().replace(/ /g, '-')}/${offer.name.toLowerCase().replace(/ /g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const dynamicRoutes = [...loanRoutes, ...depositRoutes];

  const routes = [...staticRoutes, ...dynamicRoutes];

  return routes;
} 