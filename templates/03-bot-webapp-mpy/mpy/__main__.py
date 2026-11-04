import micropyxel as pyxel
from maopaoBleApp import BleAppService, DATA_TYPE_RAW

# Keep this app ID in sync with the WebApp BLE client.
ble = BleAppService("PixelMugTemplate3")
x, y = 15, 7
COLOR = 10


def receive(data_type, data, context):
    global x, y
    if data_type != DATA_TYPE_RAW or len(data) != 1:
        return
    direction = data[0]
    if direction == 0:  # up
        y = max(0, y - 1)
    elif direction == 1:  # down
        y = min(14, y + 1)
    elif direction == 2:  # left
        x = max(0, x - 1)
    elif direction == 3:  # right
        x = min(30, x + 1)


def update(rt):
    ble.poll()


def draw(rt):
    pyxel.cls(0)
    pyxel.rect(x, y, 2, 2, COLOR)


def close(rt, reason, error):
    ble.deinit()
    pyxel.destroy()


ble.on_simple(receive)
ble.start()
pyxel.init(start_audio=False)
pyxel.run(update, draw, fps=30, on_exit=close)

