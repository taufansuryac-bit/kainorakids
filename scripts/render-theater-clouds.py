"""Render supplied VDB volumes in neutral studio light, for web layers.

Run in Blender, not system Python. Originals remain untouched.
blender -b ../ASSET3D/AWAN/Example/Cumulonimbus_Field_12_ExampleFile.blend --python scripts/render-theater-clouds.py
"""
import bpy
import sys
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '.cache/cloud-renders'
OUTPUT.mkdir(parents=True, exist_ok=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.resolution_x = 2048
scene.render.resolution_y = 1536
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.view_transform = 'AgX'
scene.view_settings.exposure = .8
cloud = bpy.data.objects['Cloud']
# Neutral studio daylight, rather than the blue sky from the example scene.
world_nodes = scene.world.node_tree.nodes
background = world_nodes.get('Background')
for link in list(background.inputs['Color'].links):
    scene.world.node_tree.links.remove(link)
background.inputs['Color'].default_value = (.86, .84, .79, 1)
background.inputs['Strength'].default_value = .35
sun_data = bpy.data.lights.new('Cloud studio sun', 'SUN')
sun_data.energy = 3
sun_data.angle = .4
sun = bpy.data.objects.new('Cloud studio sun', sun_data)
scene.collection.objects.link(sun)
sun.rotation_euler = (.45, -.5, -.4)
material = bpy.data.materials.new('Kainora neutral cloud volume')
material.use_nodes = True
nodes = material.node_tree.nodes
nodes.clear()
output = nodes.new('ShaderNodeOutputMaterial')
volume = nodes.new('ShaderNodeVolumePrincipled')
volume.inputs['Color'].default_value = (.94, .93, .90, 1)
volume.inputs['Density'].default_value = .035
volume.inputs['Anisotropy'].default_value = .25
volume.inputs['Density Attribute'].default_value = 'density'
material.node_tree.links.new(volume.outputs['Volume'], output.inputs['Volume'])
cloud.data.materials.clear()
cloud.data.materials.append(material)

variants = [
    ('cloud-01', 'Example/Cumulonimbus_Field_1.f165.eighth.vdb', -12),
    ('cloud-02', 'Cumulonimbus_Field_12/f135/Cumulonimbus_Field_12.f135.eighth.vdb', 12),
]
if '--' in sys.argv:
    variants = variants[:1]
    scene.render.resolution_percentage = 50
    scene.cycles.samples = 16
for name, relative, angle in variants:
    cloud.data.filepath = str(ROOT.parent / 'ASSET3D/AWAN' / relative)
    cloud.data.is_sequence = False
    cloud.data.grids.load()
    bpy.context.view_layer.update()
    bounds = [cloud.matrix_world @ Vector(corner) for corner in cloud.bound_box]
    low = Vector(tuple(min(p[i] for p in bounds) for i in range(3)))
    high = Vector(tuple(max(p[i] for p in bounds) for i in range(3)))
    center = (low + high) / 2
    size = high - low
    camera = scene.camera
    camera.data.type = 'ORTHO'
    camera.data.ortho_scale = max(size.x, size.z * 4 / 3) * 1.14
    camera.location = center + Vector((size.x * angle / 90, -max(size) * 2.5, max(size) * 1.45))
    camera.rotation_euler = (center - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.data.clip_end = max(size) * 10
    scene.render.use_border = True
    scene.render.use_crop_to_border = True
    crop = (.04, .30, .26, .57) if name == 'cloud-01' else (.16, .77, .35, .83)
    scene.render.border_min_x, scene.render.border_max_x, scene.render.border_min_y, scene.render.border_max_y = crop
    scene.render.filepath = str(OUTPUT / f'{name}.png')
    print('CLOUD_RENDER', name, tuple(low), tuple(high), flush=True)
    bpy.ops.render.render(write_still=True)
