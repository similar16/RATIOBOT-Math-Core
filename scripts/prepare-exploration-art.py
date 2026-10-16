"""Export the approved review sheets as transparent, label-free web sprites.
Usage: python scripts/prepare-exploration-art.py OCEAN_SHEET FOREST_SHEET
"""
from pathlib import Path
from PIL import Image
import sys
for base, source, rows in [(4,sys.argv[1],[(65,359),(438,720),(770,1140)]),(5,sys.argv[2],[(75,365),(450,737),(796,1137)])]:
    sheet=Image.open(source).convert('RGBA')
    assert sheet.size==(1312,1199),sheet.size
    for row,(top,bottom) in enumerate(rows):
        for col,(left,right) in enumerate([(0,440),(440,875),(875,1312)]):
            # Keep neighbouring light beams and labels outside each sprite.
            if base==4:
                bounds=[(100,65,360,359),(500,65,810,359),(865,65,1250,359),
                        (0,438,438,720),(450,438,869,720),(875,438,1312,720),
                        (0,770,442,1140),(447,770,865,1139),(868,770,1312,1140)]
                left,top,right,bottom=bounds[row*3+col]
            sprite=sheet.crop((left,top,right,bottom))
            if base==5:
                from PIL import ImageDraw
                # The review labels sit between feet or directly below the grass.
                boxes=[(170,369,280,420),(600,369,710,420),(1040,369,1150,420),
                       (170,734,280,780),(600,733,710,780),(1040,734,1150,780),
                       (172,1127,275,1180),(604,1127,710,1180),(1040,1127,1145,1180)]
                x0,y0,x1,y1=boxes[row*3+col]
                ImageDraw.Draw(sprite).rectangle((x0-left,y0-top,x1-left,y1-top),fill=(0,0,0,0))
            bbox=sprite.getchannel('A').point(lambda a:255 if a>25 else 0).getbbox()
            assert bbox
            sprite=sprite.crop(bbox)
            sprite.thumbnail((396,396),Image.Resampling.LANCZOS)
            canvas=Image.new('RGBA',(420,420))
            canvas.alpha_composite(sprite,((420-sprite.width)//2,408-sprite.height))
            target=Path(f'site/assets/base{base}-{row*3+col+1}.webp')
            canvas.save(target,quality=90,method=6)
            print(target,target.stat().st_size)
