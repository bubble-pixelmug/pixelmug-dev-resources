# Bot + WebApp + device-side MPY template

Use this template when an application needs device-side MPY together with a rich WebApp experience or direct BLE communication with the device.

The sample MPY app displays a 2×2 square at the center of the PixelMug screen. The WebApp installs the MPS, connects to BLE, and sends `up`, `down`, `left`, and `right` commands to move the square within the screen boundaries.

Keep the same application ID in `mpy/__main__.py` and `webapp/main.js`. Enable **Run device code automatically on start** in Studio, or use **Install MPY to device** in the WebApp. Direction buttons remain disabled until BLE is connected.
