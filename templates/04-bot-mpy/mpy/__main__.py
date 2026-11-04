import micropyxel as pyxel

color_index = 0

def update(rt):
    global color_index
    color_index = (color_index + 1) % 16

def draw(rt):
    pyxel.cls(0)
    pyxel.text(2, 7, "PixelMug", color_index)

def close(rt, reason, error):
    pyxel.destroy()

pyxel.init(start_audio=False)
pyxel.run(update, draw, fps=30, on_exit=close)
