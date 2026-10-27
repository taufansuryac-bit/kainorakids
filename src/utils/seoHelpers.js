import { journalSchema } from './journalRoutes';
import { WA_PHONE_E164 } from '../config/shop';

/**
 * KAINORA KIDS - SEO HELPERS
 * Generate JSON-LD schemas untuk product, blog, review, dll
 */

export const SITE_URL = 'https://kainorakids.com';
export const SITE_NAME = 'Kainora Kids';
export const DEFAULT_IMAGE = `${SITE_URL}/link-logo.jpg`;

/**
 * Generate Product schema
 */
export { productSchema } from './productSeo.js';

/**
 * Generate BlogPosting schema
 */
export const blogPostSchema = post => !post || post.preview ? null : journalSchema(post);

/**
 * Generate Review schema
 */
export const reviewSchema = (review) => {
  if (!review) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author || 'Bunda Pelanggan'
    },
    datePublished: review.date || '2026-01-01',
    reviewBody: review.text,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating || 5,
      bestRating: '5',
      worstRating: '1'
    },
    itemReviewed: {
      '@type': 'Product',
      name: review.productName || 'Produk Kainora Kids',
      brand: { '@type': 'Brand', name: SITE_NAME }
    }
  };
};

/**
 * Generate ItemList schema untuk product listing
 */
export { productListSchema } from './productSeo.js';

/**
 * Generate HowTo schema untuk tutorial
 */
export const howToSchema = (steps) => {
  if (!steps || steps.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cara Memesan di Kainora Kids',
    description: 'Panduan langkah demi langkah memesan baju anak di Kainora Kids',
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text
    }))
  };
};

/**
 * Generate LocalBusiness schema dengan multi-location
 */
export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  '@id': `${SITE_URL}#store`,
  name: SITE_NAME,
  image: DEFAULT_IMAGE,
  url: SITE_URL,
  telephone: WA_PHONE_E164,
  priceRange: 'Rp69.000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Meranti I No.5, Rancaekek Wetan, Kec. Rancaekek',
    addressLocality: 'Kabupaten Bandung',
    addressRegion: 'Jawa Barat',
    postalCode: '40394',
    addressCountry: 'ID'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -6.9175,
    longitude: 107.6191
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens: '00:00',
    closes: '23:59'
  },
  sameAs: [
    'https://www.tiktok.com/@kainorastore.id',
    'https://www.instagram.com/kainorakids',
    'https://shopee.co.id/kainorakids'
  ]
});
