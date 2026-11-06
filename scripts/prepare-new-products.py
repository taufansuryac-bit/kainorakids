"""Import the owner's November 2026 catalogue; preserve all original photographs."""
import hashlib
import json
import re
from pathlib import Path
from PIL import Image, ImageOps

source = Path('public/PRODUCT/PRODUCT NEW')
target = Path('public/images/products/2026-11')
target.mkdir(parents=True, exist_ok=True)
backup = Path('.cache/catalog-import/store-before.json')
backup.parent.mkdir(parents=True, exist_ok=True)
store_path = Path('src/content/store.json')
if not backup.exists():
    backup.write_bytes(store_path.read_bytes())
store = json.loads(store_path.read_text(encoding='utf-8'))
manifest_path = Path('src/content/productImages.json')
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
folders = sorted(path for path in source.iterdir() if path.is_dir())
assert len(folders) == 33, 'Expected exactly the 33 owner-provided product folders.'

def prepare(path, stem):
    image = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:10]
    variants = []
    for width in (320, 640, 1000, 1600):
        relative = f'/images/products/2026-11/{stem}-{digest}-{width}.webp'
        output = Path('public' + relative)
        if not output.exists():
            photo = ImageOps.contain(image, (width, width), Image.Resampling.LANCZOS)
            photo.save(output, quality=86, method=6)
        variants.append((width, relative))
    original = variants[-1][1]
    manifest[original] = {'src': variants[1][1], 'srcSet': ', '.join(f'{url} {width}w' for width, url in variants), 'thumbnail': variants[0][1], 'width': image.width, 'height': image.height}
    return original

products, audit = [], []
for order, folder in enumerate(folders, 1):
    slug = re.sub('[^a-z0-9]+', '-', folder.name.lower()).strip('-')
    files = sorted(path for path in folder.iterdir() if path.is_file())
    white = [path for path in files if 'PUTIH' in path.name.upper()]
    poster = [path for path in files if path.suffix.lower() == '.png' or 'OVERSIZE TEE' in path.name.upper()]
    black = [path for path in files if path not in white + poster]
    assert len(black) == 1 and len(white) <= 1 and len(poster) == 1, folder.name
    black_image = prepare(black[0], slug + '-hitam')
    photos = [black_image]
    variants = [{'name': 'Hitam', 'hex': '#111111', 'image': black_image}]
    if white:
        white_image = prepare(white[0], slug + '-putih')
        photos.append(white_image)
        variants.append({'name': 'Putih', 'hex': '#FFFFFF', 'image': white_image})
    photos.append(prepare(poster[0], slug + '-pemakaian'))
    products.append({'id': 'new-' + slug, 'name': folder.name, 'type': 'Graphic tee', 'gender': 'Unisex', 'label': '', 'warna': ' / '.join(item['name'] for item in variants), 'model': 'Oversize', 'bahan': 'Soft 20S Organic Cotton', 'jahitan': '', 'alt': f'Graphic tee oversize anak Kainora Kids motif {folder.name}, warna hitam', 'desc': f'Graphic tee anak motif {folder.name}, berbahan Soft 20S Organic Cotton dengan potongan oversize. Tersedia dalam ukuran S, M, L, XL, dan XXL. Bandingkan ukuran kaos dengan size chart sebelum memesan.', 'img': black_image, 'images': photos, 'sizes': ['S', 'M', 'L', 'XL', 'XXL'], 'sizePrices': {'S': 89000, 'M': 89000, 'L': 89000, 'XL': 94000, 'XXL': 94000}, 'colors': [item['hex'] for item in variants], 'colorVariants': variants, 'ages': [], 'price': 89000, 'order': order, 'photoOnly': False, 'catalogPreview': False, 'availability': 'InStock'})
    audit.append({'name': folder.name, 'id': products[-1]['id'], 'colors': [item['name'] for item in variants], 'sources': [str(path.relative_to(source)) for path in black + white + poster]})

store['products'] = products
store['highlights'] = [item['id'] for item in products[:12]]
current_ids = {item['id'] for item in products}
for field in ['garments', 'arrivals']:
    for item in store.get(field, []):
        if item.get('productId') and item['productId'] not in current_ids:
            item['productId'] = ''
store_path.write_text(json.dumps(store, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
chart = ImageOps.exif_transpose(Image.open(source / 'SIZECHART.jpg')).convert('RGB')
chart.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
chart.save(target / 'size-chart.webp', quality=92, method=6)
Path('docs/catalog-import-2026-11-06.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(products)} products: {sum(len(item["colorVariants"]) == 2 for item in products)} black/white, {sum(len(item["colorVariants"]) == 1 for item in products)} black only.')
