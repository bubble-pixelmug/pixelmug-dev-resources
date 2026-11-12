# PixelMug development resources

This repository contains complete, runnable PixelMug application projects and the resources used to create new ones. Each application can be opened as a project in the installed [PixelMug Studio](https://github.com/bubble-pixelmug/pixelmug-studio).

The resources are organized by purpose:

| Directory | Contents |
| --- | --- |
| [`templates/`](./templates/) | Four minimal application structures for choosing a Bot, WebApp, MPY, and BLE architecture. |
| [`getting-started/`](./getting-started/) | A guided sequence that introduces chat, WebApp control, BLE, and additional MPY applications. |
| [`examples/`](./examples/) | Focused, complete examples for Bot SDK, WebApp SDK, BLE, device events, media, networking, and MPY. |
| [`skills/`](./skills/) | Coding-agent instructions and helpers for generating complete PixelMug Studio applications. |

## Requirements

To run these projects, install PixelMug Studio and have:

- a Bubble account;
- a Bubble Bot token;
- a PixelMug associated with the account;
- Node.js 20.6 or later when installing or building project dependencies.

The `tools/studio` source tree is not required. Studio is normally installed as an application; these resources provide projects for Studio to open.

## Choose a starting point

Every PixelMug application has a Bot. Select the smallest structure that matches the idea:

| Template | Components | Use it for |
| --- | --- | --- |
| [`01-bot-only`](./templates/01-bot-only/) | Bot | Chat commands and built-in device APIs. |
| [`02-bot-webapp`](./templates/02-bot-webapp/) | Bot + WebApp | A custom page or richer user interaction. |
| [`03-bot-webapp-mpy`](./templates/03-bot-webapp-mpy/) | Bot + WebApp + MPY | A WebApp that communicates with device-side code, including BLE applications. |
| [`04-bot-mpy`](./templates/04-bot-mpy/) | Bot + MPY | A device-side application that runs independently after deployment. |

Use the [template guide](./templates/README.md) for the component details and the [English PixelMug documentation](https://bubble-pixelmug.github.io/pixelmug-docs/en/getting-started/choose-template) for the corresponding SDK guidance.

## Run a project in Studio

1. Open the project directory itself in PixelMug Studio. For example, open `getting-started/01-chat`, not the parent `getting-started/` directory and not its `bot/` directory.
2. Sign in to the Bubble account that owns the test device and Bot.
3. Set the Bot token in **My Bubble**, then select the Bot in the project settings.
4. For a project with a WebApp, select a LAN address that the Bubble App on the phone can reach.
5. For a project with `mpy/`, enable **Run device code automatically on start** when you want Studio to upload and run the device application after a compatible device is linked.
6. Start the agent, bind the PixelMug in the Bot chat or Studio device panel, and follow the project README.

Keep the computer, phone, and PixelMug on the same local network when the project uses a WebApp or automatic MPY deployment. Stop the current run before changing its project, Bot, token, or WebApp address.

## Recommended learning path

Work through these projects in order:

1. [`01-chat`](./getting-started/01-chat/) - receive a chat message and display it with a built-in device API.
2. [`02-pixel-text`](./getting-started/02-pixel-text/) - control text, color, and scrolling from a WebApp.
3. [`03-ble-play`](./getting-started/03-ble-play/) - control device-side MPY code from a WebApp over BLE.
4. [`04-more-mpy`](./getting-started/04-more-mpy/) - switch among independent MPY applications for graphics, motion, audio, and networking.

## Browse focused examples

The examples are complete projects grouped by their main capability:

- **Bot:** `bot-first-bot`, `bot-messages`, `bot-commands-and-groups`, `bot-device-binding`, `bot-device-rpc`, `bot-device-events`, `bot-media-messages`, and `bot-i18n`.
- **WebApp:** `webapp-hello-bot`, `webapp-bot-push`, `webapp-device-rpc`, `webapp-device-events`, `webapp-word-by`, and `webapp-pixel-text-share`.
- **BLE:** `ble-minimal`, `ble-config`, `ble-event-state`, `ble-simple-control`, `ble-simple-motion`, `ble-simple-text`, `ble-custom-client-raw`, and `ble-custom-client-lib`.
- **MPY:** `mpy-tutorial`, which contains runnable device-side examples and their supporting assets.

Start with an example README, then read the matching section of the [English SDK documentation](https://bubble-pixelmug.github.io/pixelmug-docs/en/). The examples show application behavior; the documentation defines the supported APIs and runtime rules.

## Project layout

```text
my-app/
|-- package.json          # root Bot project
|-- bot/
|   `-- index.js          # required Bot entry point
|-- webapp/               # optional WebApp
|   |-- index.html
|   |-- package.json
|   `-- ...
`-- mpy/                  # optional device-side MicroPython application
    |-- __main__.py
    |-- mps.json
    `-- ...
```

Studio injects runtime values such as `BOT_TOKEN` and `STUDIO_WEBAPP_URL`; do not commit tokens or other secrets. Runtime logs and build output are local generated files and are ignored by this repository.

## Generate an application with the PixelMug Skill

The [`skills/pixelmug-studio`](./skills/pixelmug-studio/) package lets a coding agent turn an application idea into a complete project. It reads templates, examples, and getting-started projects from this repository, reads the online English documentation when SDK details are needed, installs npm dependencies, and validates the generated project.

The generated project is written to the coding agent's current workspace under:

```text
pixelmug-apps/<generated-project-name>/
```

The Skill does not depend on a local Studio source checkout. After generation, open the resulting directory in the installed PixelMug Studio.
