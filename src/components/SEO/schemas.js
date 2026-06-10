// ============================================================
// JSON-LD Structured Data Schemas — Swastika Interlocking
// ============================================================

const BASE_URL = 'https://www.swastikainterlocking.live';
const PHONE = '+91-8400936290';
const WHATSAPP = '+91-7905978260';
const EMAIL = 'info@swastikainterlocking.live';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Swastika Interlocking',
  alternateName: 'स्वस्तिका इंटरलॉकिंग',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.svg`,
  description: 'Manufacturer of interlocking paver blocks, shuttering materials rental, and RCC road construction in Deesa, Gujarat, India.',
  foundingDate: '2010',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Girdharpur Uncher, Kauriram',
    addressLocality: 'Deesa',
    addressRegion: 'Gujarat',
    postalCode: '385535',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: PHONE,
      contactType: 'sales',
      availableLanguage: ['Hindi', 'Gujarati', 'English'],
    },
    {
      '@type': 'ContactPoint',
      telephone: WHATSAPP,
      contactType: 'customer support',
      contactOption: 'WhatsApp',
    },
  ],
  sameAs: [
    `https://wa.me/917905978260`,
  ],
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'Store'],
  name: 'Swastika Interlocking',
  alternateName: 'स्वस्तिका इंटरलॉकिंग',
  image: [
    `${BASE_URL}/logo.svg`,
    `${BASE_URL}/interlocking-street-image-3x.jpg`,
    `${BASE_URL}/Business-division-Bulding-Material.png`,
  ],
  priceRange: '₹₹',
  telephone: PHONE,
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Girdharpur Uncher, Kauriram',
    addressLocality: 'Deesa',
    addressRegion: 'Gujarat',
    postalCode: '385535',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.2580,
    longitude: 72.1987,
  },
  url: BASE_URL,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, UPI, Bank Transfer',
  areaServed: [
    { '@type': 'City', name: 'Deesa' },
    { '@type': 'AdministrativeArea', name: 'Banaskantha' },
    { '@type': 'City', name: 'Palanpur' },
    { '@type': 'City', name: 'Patan' },
    { '@type': 'City', name: 'Mehsana' },
    { '@type': 'State', name: 'Gujarat' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Construction Materials',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Interlocking Paver Blocks' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Shuttering Materials' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'RCC Road Construction' } },
    ],
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Swastika Interlocking',
  url: BASE_URL,
  description: 'Paver blocks manufacturer and building materials supplier in Deesa, Gujarat',
  inLanguage: ['en-IN', 'hi-IN'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/products?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Paver blocks price in Deesa Gujarat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Interlocking paver block prices in Deesa range from ₹16 to ₹32 per piece depending on type and grade. Zigzag blocks start at ₹18/piece, Hexagonal at ₹22/piece. Contact Swastika Interlocking at +91-8400936290 for bulk pricing.',
      },
    },
    {
      '@type': 'Question',
      name: 'RCC road construction cost per meter in Gujarat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RCC road construction cost in Gujarat depends on road width, length, concrete grade (M20/M25/M30) and site conditions. Contact Swastika Interlocking for a free site survey and accurate quote for Deesa, Banaskantha areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Shuttering plates on rent in Deesa Gujarat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Swastika Interlocking offers steel shuttering plates, adjustable props, H-frames and beam clamps on rent in Deesa, Gujarat. Steel plates from ₹45/day, props from ₹15/day. Call +91-8400936290.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which interlocking blocks are best for driveway?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For driveways, 80mm thick Zigzag or Hexagonal interlocking paver blocks (M30-M50 grade) are recommended. They withstand heavy vehicle loads. Swastika Interlocking manufactures heavy-duty paver blocks in Deesa, Gujarat.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does an RCC road last?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A properly constructed RCC road lasts 20-30 years with minimal maintenance. Swastika Interlocking builds roads using M20-M30 grade concrete following IRC guidelines. We have completed 25+ roads in Banaskantha district.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is delivery available in Banaskantha district?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Swastika Interlocking delivers interlocking blocks, sand, gravel, cement and pipes across Deesa, Banaskantha, Patan, Mehsana and nearby Gujarat areas. Delivery takes 3-5 working days after order confirmation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is minimum order for paver blocks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Minimum order for interlocking paver blocks is 100 pieces. For bulk orders of 1000+ pieces, special wholesale pricing is available. Contact Swastika Interlocking at +91-8400936290 for bulk quotes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide shuttering for residential construction?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Swastika Interlocking provides shuttering materials for residential slab casting, beams, columns and more. Available for rent and sale in Deesa, Gujarat. Steel plates, props, H-frames and accessories available.',
      },
    },
  ],
};

export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: `${BASE_URL}${item.path}`,
  })),
});

export const getProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.nameEn,
  description: product.descEn,
  image: product.images?.[0] || `${BASE_URL}/logo.svg`,
  brand: {
    '@type': 'Brand',
    name: 'Swastika Interlocking',
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'Swastika Interlocking',
    address: 'Deesa, Gujarat, India',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    price: product.priceMin || 0,
    priceValidUntil: '2026-12-31',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'Swastika Interlocking',
    },
    areaServed: 'Gujarat, India',
  },
});
