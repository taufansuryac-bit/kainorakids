import variants from '../content/productImages.json' with { type: 'json' };

export const CARD_IMAGE_SIZES = '(max-width: 767px) calc((100vw - 58px) / 2), (max-width: 1100px) 29vw, 22vw';
export function productImageProps(original, sizes = CARD_IMAGE_SIZES) {
  const image = variants[original];
  return image ? { src: image.src, srcSet: image.srcSet, sizes } : { src: original };
}
export const productThumbnail = original => variants[original]?.thumbnail || original;
