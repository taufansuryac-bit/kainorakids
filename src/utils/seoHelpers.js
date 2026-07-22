/**
 * KAINORA KIDS - SEO HELPERS
 * Generate JSON-LD schemas untuk product, blog, review, dll
 */

const SITE_URL = 'https://kainorakids.com';
const SITE_NAME = 'Kainora Kids';
const DEFAULT_IMAGE = `${SITE_URL}/link-logo.jpg`;

/**
 * Generate Product schema
 */
export const productSchema = (product) => {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - ${product.category || 'Baju anak'} premium dari Kainora Kids.`,
    image: product.images || product.img || [DEFAULT_IMAGE],
    sku: product.sku || `KK-${product.id || '000'}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'CV Marbella Utama Mandiri'
    },
    category: product.category || 'Baju Anak',
    material: product.bahan || '100% Premium Cotton',
    color: product.warna || 'Various',
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/?view=productDetail&id=${product.id}`,
      priceCurrency: 'IDR',
      price: product.price || 0,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'ID'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 5, unitCode: 'DAY' }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '854',
      bestRating: '5',
      worstRating: '1'
    }
  };
};

/**
 * Generate BlogPosting schema
 */
export const blogPostSchema = (post) => {
  if (!post) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content?.substring(0, 160),
    image: post.img || DEFAULT_IMAGE,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.png`
      }
    },
    datePublished: post.datePublished || '2026-01-01T00:00:00+07:00',
    dateModified: post.dateModified || post.datePublished || '2026-01-01T00:00:00+07:00',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/?view=blog&id=${post.id}`
    },
    articleSection: post.category || 'Parenting',
    keywords: post.tags || ['parenting', 'anak', 'kainora kids']
  };
};

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
export const productListSchema = (products) => {
  if (!products || products.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Koleksi Baju Anak Premium Kainora Kids',
    description: 'Daftar koleksi baju anak premium dari Kainora Kids',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.img || DEFAULT_IMAGE,
        url: `${SITE_URL}/?view=productDetail&id=${product.id}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'IDR',
          price: product.price || 0,
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  };
};

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
  telephone: '+6285822222430',
  priceRange: 'Rp89.000 - Rp200.000',
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
