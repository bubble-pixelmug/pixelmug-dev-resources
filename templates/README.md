# PixelMug application templates

These templates are minimal starting points for PixelMug applications. Every template includes a Bot; add the other components only when the application needs them.

| Template | Components | Use it when |
| --- | --- | --- |
| `01-bot-only` | Bot | The application is driven by chat commands and built-in device APIs, without a WebApp or device-side MPY code. |
| `02-bot-webapp` | Bot + WebApp | The application needs richer interaction or a custom page, with device calls handled through the WebApp and Bubble platform. |
| `03-bot-webapp-mpy` | Bot + WebApp + device-side MPY | The application needs device-side MPY together with a rich WebApp experience or direct BLE communication with the device. |
| `04-bot-mpy` | Bot + device-side MPY | The device-side application must run independently after deployment, without WebApp interaction. |

Open the selected directory as a Studio project. Configure the Bot token, build the WebApp when present, and enable **Run device code automatically on start** for templates that contain `mpy/`.
