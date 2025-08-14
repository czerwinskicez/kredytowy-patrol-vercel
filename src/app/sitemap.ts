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
    {
      url: `${siteUrl}/konto-oszczednosciowe`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/karty-kredytowe`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/lokaty-walutowe`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/obligacje-skarbowe`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/regulamin`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  const loanTypes = Object.keys(sheetNameMapping);

  const loanCategoryRoutes = loanTypes.map(type => ({
    url: `${siteUrl}/kredyty/${type}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

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

  const dynamicRoutes = [...loanCategoryRoutes, ...loanRoutes, ...depositRoutes];

  const routes = [...staticRoutes, ...dynamicRoutes];

  return routes;
}
