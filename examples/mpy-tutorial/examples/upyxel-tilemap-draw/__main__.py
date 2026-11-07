# MicroPyxel Tilemap drawing example: outline a centered rectangle in tile space.
# The display shows a 4x2 tile window from the global tilemap.

import micropyxel as upyxel


FPS = 20
TILE_SIZE = 8
VIEW_WIDTH = 4
VIEW_HEIGHT = 2


def main():
    upyxel.init(start_audio=False)
    try:
        image_bank = upyxel.images(0)
        image_bank.load_from_png(0, 0, "tilemap.png", True)

        tilemap = upyxel.tilemaps(0)

        # Tile values use (vertical << 8) | horizontal coordinates.
        empty_tile = (0 << 8) | 6
        border_tile = (1 << 8) | 1

        # The PNG has six tile columns, so u=6 is outside the source image.
        # Use it as an invisible background for the global tilemap.
        tilemap.cls(empty_tile)

        # Draw a centered 2x2 tile rectangle on the 4x2 tile display.
        tilemap.rectb(1, 0, 2, 2, border_tile)

        def update(rt):
            if rt.frame_count >= FPS * 5:
                rt.quit()

        def draw(rt):
            rt.cls(0)

            # bltm uses tile coordinates for the source position and pixel
            # dimensions for width and height in the current runtime.
            upyxel.bltm(
                0,
                0,
                0,
                0,
                0,
                VIEW_WIDTH * TILE_SIZE,
                VIEW_HEIGHT * TILE_SIZE,
            )

        print("Tilemap drawing demo started")
        upyxel.run(update, draw, fps=FPS)
        print("Tilemap drawing demo finished")
    finally:
        upyxel.destroy()


main()
