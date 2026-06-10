import { Helmet } from 'react-helmet-async';
import { organizationSchema, localBusinessSchema, websiteSchema } from './schemas';

const BASE_URL = 'https://www.swastikainterlocking.live';
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`;
const SITE_NAME = 'Swastika Interlocking';

/**
 * SEOHead — drop this on every page with per-page props
 */
export default function SEOHead({
  title,
  description,
  keywords = '',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  schema = null,          // additional page-level JSON-LD
  noindex = false,
  breadcrumb = null,
  language = 'en',
}) {
  const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  // Always inject org + local business + website on every page
  const baseSchemas = [organizationSchema, localBusinessSchema, websiteSchema];
  const allSchemas = schema ? [...baseSchemas, ...(Array.isArray(schema) ? schema : [schema])] : baseSchemas;
  if (breadcrumb) allSchemas.push(breadcrumb);

  return (
    <Helmet>
      {/* ── Primary ── */}
      <html lang={language === 'hi' ? 'hi-IN' : 'en-IN'} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}

      {/* ── Geo tags for local SEO ── */}
      <meta name="geo.region" content="IN-GJ" />
      <meta name="geo.placename" content="Deesa, Banaskantha, Gujarat" />
      <meta name="geo.position" content="24.2580;72.1987" />
      <meta name="ICBM" content="24.2580, 72.1987" />

      {/* ── Open Graph ── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={language === 'hi' ? 'hi_IN' : 'en_IN'} />
      <meta property="og:locale:alternate" content={language === 'hi' ? 'en_IN' : 'hi_IN'} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ── hreflang ── */}
      <link rel="alternate" hrefLang="en-IN" href={canonicalUrl} />
      <link rel="alternate" hrefLang="hi-IN" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* ── JSON-LD schemas ── */}
      {allSchemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
