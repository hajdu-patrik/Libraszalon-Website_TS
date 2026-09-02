

import { homeItem } from '@/content/nav';
import { prices, priceRange } from '@/content/prices';
import { houseRules } from '@/content/pages/house-rules';
import { site } from '@/content/site';

const BUSINESS_ID = `${site.url}/#business`;

function formatHuf(amount: number) {
  return amount.toLocaleString('hu-HU');
}

export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MassageTherapy',
    '@id': BUSINESS_ID,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/og/default.jpg`,
    logo: `${site.url}/images/logo-320.webp`,
    priceRange: `${formatHuf(priceRange.min)} Ft - ${formatHuf(priceRange.max)} Ft`,
    currenciesAccepted: 'HUF',
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
    sameAs: [site.social.facebook, site.social.googleMaps],
  };
}

export function serviceCatalogJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Masszázsszolgáltatások',
    itemListElement: prices.map((item, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: {
        '@type': 'Service',
        name: item.title,
        ...(item.note && { description: item.note.replace(/\n/g, ' ') }),
        serviceType: 'Masszázs',
        provider: { '@id': BUSINESS_ID },
        areaServed: { '@type': 'City', name: site.address.city },
      },
      price: Math.min(...item.amounts),
      priceCurrency: 'HUF',
      availability: 'https://schema.org/InStock',
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  const crumbs = [{ name: homeItem.label, path: homeItem.href }, ...trail];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

export function houseRulesFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: houseRules.rules.map((rule) => ({
      '@type': 'Question',
      name: rule.question,
      acceptedAnswer: { '@type': 'Answer', text: rule.text },
    })),
  };
}
