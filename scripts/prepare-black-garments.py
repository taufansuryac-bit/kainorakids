"""Prepare web textures from the owner's artwork without modifying originals.

Run from the repository root with Python + Pillow. Crops only transparent margins,
keeps aspect/alpha, and writes web-sized copies plus source provenance.
"""
from hashlib import sha256
from pathlib import Path
import json
from PIL import Image

SOURCE = Path('public/Design Png Depan Belakang')
OUTPUT = Path('public/models/kainora')
ARTWORK = [
    ('DINOREX/All Pages-15.png', 'dinorex-back', 1536),
    ('DINOREX/All Pages-15 - Copy.png', 'dinorex-front', 512),
    ('KAINORAFRESH/All Pages-6.png', 'kainora-fresh-back', 1536),
    ('KAINORAFRESH/All Pages-6 - Copy.png', 'kainora-fresh-front', 512),
    ('KEY/All Pages-2.png', 'key-back', 1536),
    ('KEY/All Pages-2 - Copy.png', 'key-front', 512),
    ('EGG/All Pages-4.png', 'egg-artwork', 1536),
    ('CANDY FRONT ONLY/All Pages-16.png', 'candy-front', 1536),
    ('ICECREAM/All Pages-7.png', 'icecream-front', 1536),
]

OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = []
for relative, name, limit in ARTWORK:
    source = SOURCE / relative
    with Image.open(source) as original:
        image = original.convert('RGBA')
        bounds = image.getchannel('A').getbbox()
        if not bounds:
            raise ValueError(f'Empty artwork: {source}')
        image = image.crop(bounds)
        image.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        target = OUTPUT / f'{name}.webp'
        image.save(target, 'WEBP', quality=92, method=6, alpha_quality=100)
        manifest.append({'source': source.as_posix(), 'sourceSHA256': sha256(source.read_bytes()).hexdigest(),
                         'sourceSize': list(original.size), 'alphaBounds': list(bounds),
                         'texture': '/' + target.relative_to('public').as_posix(), 'size': list(image.size),
                         'bytes': target.stat().st_size})
        print(f'{name}: {image.width}x{image.height}, {target.stat().st_size:,} bytes')
Path('docs/kainora-v2/black-garment-assets.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
