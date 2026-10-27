"""Compress actual VDB renders; no generated replacement artwork."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / 'public/models/kainora/clouds'
DESTINATION.mkdir(parents=True, exist_ok=True)
sources = [
    'Example/Cumulonimbus_Field_1.f165.eighth.vdb',
    'Cumulonimbus_Field_12/f135/Cumulonimbus_Field_12.f135.eighth.vdb',
]
assets = []
for index, source in enumerate(sources, 1):
    name = f'cloud-{index:02}'
    original = ROOT.parent / 'ASSET3D/AWAN' / source
    image = Image.open(ROOT / '.cache/cloud-renders' / f'{name}.png').convert('RGBA')
    bounds = image.getchannel('A').getbbox()
    image = image.crop(bounds)
    # Padding prevents hard clipping at the plane edge and leaves soft cloud edges.
    padded = Image.new('RGBA', (image.width + 24, image.height + 24))
    padded.paste(image, (12, 12))
    padded.thumbnail((960, 768), Image.Resampling.LANCZOS)
    padded.putalpha(padded.getchannel('A').filter(ImageFilter.GaussianBlur(.5)))
    destination = DESTINATION / f'{name}.webp'
    padded.save(destination, 'WEBP', quality=90, method=6)
    assets.append({'url': f'/models/kainora/clouds/{name}.webp', 'source': f'ASSET3D/AWAN/{source}', 'sourceSha256': hashlib.sha256(original.read_bytes()).hexdigest(), 'bytes': destination.stat().st_size, 'width': padded.width, 'height': padded.height})
manifest = {'pipeline': 'Blender 4.5.9 LTS / Cycles CPU / 32 samples / neutral Principled Volume / transparent render / cropped cloud region / WebP', 'runtime': 'Four transparent planes at different depths, not live VDB raymarching. Two textures reused. Original source volumes unchanged.', 'assets': assets}
(ROOT / 'docs/kainora-v2/3d-cloud-assets.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(json.dumps(assets, indent=2))
