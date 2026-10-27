"""Prepare responsive derivatives; keep original product photos and banners unchanged.
Run manually with Python + Pillow when local PRODUCT/banner photos change.
"""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json

public = Path('public')
target = public / 'images/shop'
target.mkdir(parents=True, exist_ok=True)
manifest = {}
for source in sorted((public / 'PRODUCT').glob('*.jpg')):
    digest = hashlib.sha256(source.read_bytes()).hexdigest()[:10]
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    variants = []
    for width in (320, 640, 800, 1000):
        photo = ImageOps.contain(image, (width, width))
        name = f'{source.stem}-{digest}-{width}.webp'
        photo.save(target / name, quality=83, method=6)
        variants.append((photo.width, '/images/shop/' + name))
    manifest['/PRODUCT/' + source.name] = {
        'src': variants[1][1], 'srcSet': ', '.join(f'{url} {width}w' for width, url in variants),
        'thumbnail': variants[0][1], 'width': image.width, 'height': image.height,
    }
Path('src/content/productImages.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')

for original, name in [('banner-hero-1.jpg', 'camp'), ('banner-hero-2.jpg', 'blue'), ('banner-hero-3.jpg', 'yellow'), ('banner-hero-slider-1.jpg', 'garden')]:
    image = ImageOps.exif_transpose(Image.open(public / original)).convert('RGB')
    for width in (480, 800):
        photo = ImageOps.fit(image, (width, round(width * 1.25)), centering=(.52, .5), method=Image.Resampling.LANCZOS)
        photo.save(public / f'images/kainora-owned/hero-{name}-portrait-{width}.webp', quality=83, method=6)
print(f'Prepared {len(manifest)} product photos and eight portrait hero variants.')
