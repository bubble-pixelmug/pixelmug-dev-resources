# Bot + device-side MPY template

Use this template when the device should run its own display, audio, network, or sensor logic without a WebApp.

The Bot handles device binding and provides `/installMPY` to deploy and start the current device code. The `mpy/` directory contains the code deployed to PixelMug; its entry point must remain `mpy/__main__.py`.

Enable **Run device code automatically on start** in Studio for automatic deployment when the Agent starts and the device is connected, or use `/installMPY` after binding a device. The sample MPY app displays `PixelMug` and cycles its text color through the 16-color palette. Replace `mpy/__main__.py` with the device behavior required by your application.
