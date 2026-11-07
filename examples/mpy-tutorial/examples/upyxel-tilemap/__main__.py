# MicroPyxel tilemap example: populate a tilemap with pset() and render it.
# tilemap.png is a 6x4 tileset. Each 8x8 tile has a different colored outline
# and an increasing number of white pixels, making tile coordinates easy to see.

import micropyxel as upyxel
import time


FPS = 20
MAP_WIDTH = 6
MAP_HEIGHT = 4
TILE_SIZE = 8
VIEW_WIDTH = 4
VIEW_HEIGHT = 2
PAGE_DURATION_MS = 3000
PAGES = ((0, 0), (2, 0), (0, 2), (2, 2))


def build_map(tilemap):
    # pset() stores a tile coordinate as (vertical << 8) | horizontal.
    for y in range(MAP_HEIGHT):
        for x in range(MAP_WIDTH):
            tilemap.pset(x, y, (y << 8) | x)


def main():
    upyxel.init(start_audio=False)
    try:
        image_bank = upyxel.images(0)
        image_bank.load_from_png(0, 0, "tilemap.png", True)

        # The runtime exposes the global tilemap bank through tilemaps(index).
        tilemap = upyxel.tilemaps(0)
        build_map(tilemap)
        print("Tilemap source size:", MAP_WIDTH, "x", MAP_HEIGHT)

        page = 0
        page_started_ms = time.ticks_ms()

        def update(rt):
            nonlocal page, page_started_ms
            now_ms = time.ticks_ms()
            if time.ticks_diff(now_ms, page_started_ms) >= PAGE_DURATION_MS:
                page_started_ms = now_ms
                if page == len(PAGES) - 1:
                    rt.quit()
                else:
                    page += 1

        def draw(rt):
            rt.cls(0)

            source_x, source_y = PAGES[page]

            # bltm uses tile coordinates for the source position, but width and
            # height are pixel dimensions in the current MicroPyxel runtime.
            # The 32x16 display shows a 4x2 tile window at a time.
            upyxel.bltm(
                0,
                0,
                0,
                source_x,
                source_y,
                VIEW_WIDTH * TILE_SIZE,
                VIEW_HEIGHT * TILE_SIZE,
            )

        print("Tilemap demo started")
        upyxel.run(update, draw, fps=FPS)
        print("Tilemap demo finished")
    finally:
        upyxel.destroy()


main()
