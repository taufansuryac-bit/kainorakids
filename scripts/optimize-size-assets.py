"""Encode original generated garment assets as WebP, preserving originals."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'public/images/size-guide'
for source in sorted(root.glob('*.png')):
    destination = source.with_suffix('.webp')
    if destination.exists() and destination.stat().st_mtime >= source.stat().st_mtime:
        continue
    with Image.open(source) as image:
        image.save(destination, 'WEBP', quality=88, method=6)
    print(f'{destination.name}: {destination.stat().st_size // 1024} KB')
