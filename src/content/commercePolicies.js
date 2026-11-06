// Confirmed by the store owner on 23 October 2026; no fixed shipping fee or handling promise was supplied.
export const COMMERCE_POLICY = {
  origin: 'Bandung', carrier: 'J&T Express', country: 'ID',
  shippingPath: '/pengiriman/', returnPath: '/retur/',
  rateUrl: 'https://www.jet.co.id/rates', trackingUrl: 'https://www.jet.co.id/track',
  carrierFaq: 'https://www.jet.co.id/information/faq', returnDays: 2,
  shippingSummary: 'Dikirim dari Bandung melalui J&T Express. Ongkir mengikuti tujuan dan berat atau volume paket. Tim Kainora mengonfirmasi total dan jadwal penyerahan paket sebelum pesanan diproses.',
  transitSummary: 'FAQ resmi J&T menyebut estimasi umum layanan Regular/EZ 2–3 hari kerja, bergantung tujuan. Waktu dihitung setelah paket diserahkan kepada kurir, belum termasuk proses toko. Rute tertentu dapat berbeda; periksa estimasi aktual sebelum memesan.',
  returnSummary: 'Ajukan retur maksimal 2×24 jam setelah paket diterima. Sertakan video unboxing utuh sejak paket belum dibuka. Produk belum dicuci atau dipakai dan hangtag tetap utuh. Ongkir retur akibat salah ukuran atau kelalaian pembeli ditanggung pembeli; jika ada cacat atau kesalahan penjual, ditanggung Kainora.',
};
export function merchantReturnPolicy(site = 'https://kainorakids.com') {
  return { '@type': 'MerchantReturnPolicy', '@id': `${site}/retur/#policy`, applicableCountry: 'ID',
    returnPolicyCountry: 'ID', returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: COMMERCE_POLICY.returnDays, merchantReturnLink: `${site}/retur/`,
    returnMethod: 'https://schema.org/ReturnByMail', itemDefectReturnFees: 'https://schema.org/FreeReturn',
    returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility', customerRemorseReturnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    description: COMMERCE_POLICY.returnSummary };
}
export function storeOrganization(site = 'https://kainorakids.com') {
  return { '@context': 'https://schema.org', '@type': 'OnlineStore', '@id': `${site}/#organization`, name: 'Kainora Kids',
    url: `${site}/`, logo: `${site}/website-logo.png`, areaServed: 'ID',
    description: 'Kainora Kids menyediakan graphic tee oversize anak dan fashion anak.',
    sameAs: ['https://www.instagram.com/kainorakids/', 'https://www.tiktok.com/@kainorastore.id'],
    hasMerchantReturnPolicy: merchantReturnPolicy(site),
    hasShippingService: { '@type': 'ShippingService', name: 'J&T Express — dari Bandung',
      description: `${COMMERCE_POLICY.shippingSummary} ${COMMERCE_POLICY.transitSummary}`,
      shippingConditions: { '@type': 'ShippingConditions', shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'ID' } } } };
}
