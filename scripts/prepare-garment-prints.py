"""Prepare web textures from supplied transparent artwork; preserve source files."""
from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/Design Png Depan Belakang/KAINORAPARK'
OUTPUT = ROOT / 'public/models/kainora'
OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = []
for original, name, maximum in [('Depan.png', 'kainora-park-front.webp', 768), ('Belakang.png', 'kainora-park-back.webp', 1536)]:
    image = Image.open(SOURCE / original).convert('RGBA')
    bounds = image.getchannel('A').getbbox()
    # Remove transparent margins only, keeping every visible part of the artwork.
    image = image.crop(bounds)
    image.thumbnail((maximum, maximum), Image.Resampling.LANCZOS)
    destination = OUTPUT / name
    image.save(destination, 'WEBP', lossless=True, method=6)
    manifest.append({'source': f'Design Png Depan Belakang/KAINORAPARK/{original}', 'url': f'/models/kainora/{name}', 'transparentBounds': bounds, 'width': image.width, 'height': image.height, 'bytes': destination.stat().st_size})
    print(manifest[-1])
(ROOT / 'docs/kainora-v2/3d-print-assets.json').write_text(json.dumps(manifest, indent=2) + '\n')
