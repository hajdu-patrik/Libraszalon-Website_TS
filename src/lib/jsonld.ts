import { prices, priceRange, type PriceItem } from '@/content/prices';
import { houseRules } from '@/content/pages/house-rules';
import { pageSeo, type PageKey } from '@/content/seo';
import { site } from '@/content/site';
import { OG_IMAGE, absoluteUrl } from '@/lib/seo';

export type JsonLdObject = {
  '@context'?: 'https://schema.org';
  '@type': string | string[];
  '@id'?: string;
  [property: string]: unknown;
};

const SCHEMA_CONTEXT = 'https://schema.org';
const BUSINESS_ID = `${site.url}/#business`;
const WEBSITE_ID = `${site.url}/#website`;
const CATALOG_ID = `${absoluteUrl(pageSeo.prices.path)}#arlista`;
const CURRENCY = 'HUF';

function formatHuf(amount: number) {
  return amount.toLocaleString('hu-HU');
}

export function businessJsonLd(): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'HealthAndBeautyBusiness',
    '@id': BUSINESS_ID,
    name: site.legalName,
    alternateName: site.name,
    description: pageSeo.home.description,
    url: absoluteUrl('/'),
    telephone: site.phone,
    email: site.email,
    image: OG_IMAGE.url,
    logo: `${site.url}/images/logo-320.webp`,
    priceRange: `${formatHuf(priceRange.min)} Ft - ${formatHuf(priceRange.max)} Ft`,
    currenciesAccepted: CURRENCY,
    paymentAccepted: 'Készpénz, OTP SZÉP Kártya, átutalás',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: site.social.googleMaps,
    areaServed: { '@type': 'City', name: site.address.city },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.openingHours.days,
        opens: site.openingHours.opens,
        closes: site.openingHours.closes,
      },
    ],
    founder: {
      '@type': 'Person',
      name: site.owner,
      jobTitle: site.ownerTitle,
    },
    hasOfferCatalog: { '@id': CATALOG_ID },
    sameAs: [site.social.facebook],
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: site.name,
    alternateName: site.legalName,
    description: pageSeo.home.description,
    inLanguage: 'hu-HU',
    publisher: { '@id': BUSINESS_ID },
  };
}

function offerFor(item: PriceItem) {
  const low = Math.min(...item.amounts);
  const high = Math.max(...item.amounts);

  const itemOffered = {
    '@type': 'Service',
    name: item.title,
    ...(item.note && { description: item.note.replace(/\n/g, ' ') }),
    serviceType: 'Masszázs',
    provider: { '@id': BUSINESS_ID },
    areaServed: { '@type': 'City', name: site.address.city },
  };

  if (low === high) {
    return { '@type': 'Offer', itemOffered, price: low, priceCurrency: CURRENCY };
  }

  return {
    '@type': 'AggregateOffer',
    itemOffered,
    lowPrice: low,
    highPrice: high,
    priceCurrency: CURRENCY,
    offerCount: item.amounts.length,
  };
}

export function serviceCatalogJsonLd(): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'OfferCatalog',
    '@id': CATALOG_ID,
    name: 'Masszázsszolgáltatások',
    url: absoluteUrl(pageSeo.prices.path),
    provider: { '@id': BUSINESS_ID },
    itemListElement: prices.map(offerFor),
  };
}

/** The trail below Főoldal, as page keys: `breadcrumbJsonLd('prices', 'firstMassage')`. */
export function breadcrumbJsonLd(...keys: PageKey[]): JsonLdObject {
  const crumbs = [pageSeo.home, ...keys.map((key) => pageSeo[key])];

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.title,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function houseRulesFaqJsonLd(): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    mainEntity: houseRules.rules.map((rule) => ({
      '@type': 'Question',
      name: rule.question,
      acceptedAnswer: { '@type': 'Answer', text: rule.text },
    })),
  };
}
