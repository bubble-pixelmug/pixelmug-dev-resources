# Capability matrix

| User need | Template | Components and implementation notes |
| --- | --- | --- |
| Chat commands and built-in device calls only | `01-bot-only` | Bot; declare compatible PixelMug devices and call device RPCs from Bot handlers. |
| A custom page, forms, buttons, or richer interaction | `02-bot-webapp` | Bot + WebApp; Bot opens the page and WebApp uses `BubbleWebApp`. |
| WebApp interaction with device-side code or direct phone-to-device BLE | `03-bot-webapp-mpy` | Bot + WebApp + MPY + BLE; share an exact `appId`. |
| Device-side app that runs independently after deployment | `04-bot-mpy` | Bot + MPY; use Studio automatic MPY run or an explicit install command. |

Use a simpler template when it satisfies the request. Built-in TAL/RPC capabilities do not require MPY. BLE requires both a WebApp BLE client and a matching `maopaoBleApp.BleAppService` on the device.

For API details, use the matching online documentation sections:

- Bot: `/en/bot/`
- WebApp: `/en/webapp/`
- BLE: `/en/ble/app/`
- MPY runtime: `/en/device/runtime/`
- MicroPyxel: `/en/device/micropyxel/`
