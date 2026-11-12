---
name: pixelmug-studio
description: Build complete PixelMug Studio applications from a user's idea by selecting a local template, implementing Bot/WebApp/MPY code, reading the online English SDK documentation, and validating the generated project.
metadata:
  short-description: Generate complete PixelMug Studio apps
---

# PixelMug Studio application generation

Use this skill when a user wants a complete PixelMug application generated in the current coding-agent workspace. The deliverable is an editable project directory that the user can open in an installed PixelMug Studio. Do not return only snippets or a partial prototype.

## Resource policy

Resolve these local resources from the current workspace or from an explicitly configured PixelMug resource root:

- `dev-resources/templates` (required)
- `dev-resources/examples` (required)
- `dev-resources/getting-started` (required)

Do not require or search for a local `tools/studio` checkout. Users normally install Studio rather than clone its source.

Read SDK details from the deployed English documentation:

`https://bubble-pixelmug.github.io/pixelmug-docs/en/`

Use `scripts/fetch-doc.mjs` when the agent has no web-page reader. Do not copy the documentation into the skill or generated project.

Read the relevant references before implementation:

- [capability-matrix.md](references/capability-matrix.md) for template selection.
- [project-contract.md](references/project-contract.md) for the Studio project shape and validation rules.
- [resource-resolution.md](references/resource-resolution.md) for locating local resources and online docs.

## Required workflow

1. Inspect the current workspace and resolve the three required local resource trees.
2. Translate the user's idea into capabilities: chat/Bot, WebApp UI, built-in device RPC, device-side MPY, BLE, audio, graphics, sensors, networking, assets, and persistence.
3. Select exactly one of the four templates using the capability matrix. Every project includes a Bot. Add WebApp, MPY, and BLE only when the request needs them.
4. Create a new project under `./pixelmug-apps/<generated-name>/`. Derive a short lowercase hyphenated name from the idea; never overwrite an existing directory.
5. Copy only source files and configuration from the chosen template. Exclude `debug/`, `dist/`, `node_modules/`, logs, caches, and other generated output.
6. Read the relevant online English documentation and the closest complete example before writing SDK calls. Prefer adapting a complete example over inventing an API.
7. Implement all requested behavior across the selected components. Keep configuration and secrets out of source files; Studio injects `BOT_TOKEN`, `BOT_API_BASE_URL`, and `STUDIO_WEBAPP_URL` at runtime.
8. If BLE is used, choose one application ID and use it identically in the WebApp and `BleAppService` MPY code.
9. Install dependencies with npm. For a WebApp, install and build from `webapp/` as well as installing the project root.
10. Run the project validator. Fix every structural, manifest, syntax, build, and cross-component error before delivery.
11. Report the generated absolute path, selected template, components, checks run, and the remaining Studio actions (Bot token, device binding, WebApp opening, and MPY auto-run when applicable).

## Project rules

- Root `package.json` must be valid JSON, contain a non-empty `name`, use ES modules, and explicitly depend on `@jeejio-bubble/bot`.
- `bot/` and a `.js`, `.mjs`, or `.cjs` Bot entry under it are required.
- A `webapp/` directory must contain `index.html`, `package.json`, and a `build` script. Its build output must be `dist/`, `build/`, or the directory configured by `pixelmug.outputDir`.
- An `mpy/` directory must contain `__main__.py` and a JSON-object `mps.json` with `name`, `version`, and `dependencies`.
- MPY code targets MicroPython firmware. Do not import desktop-only Python packages or assume CPython behavior.
- MPY uploads the contents of `mpy/`; use device-relative asset paths such as `assets/image.png`.
- Keep the generated project self-contained and runnable; do not leave unresolved TODOs in the requested behavior.

## Scripts

From the skill directory:

```sh
node scripts/resolve-resources.mjs
node scripts/scaffold-project.mjs --name "my idea" --template 02-bot-webapp
node scripts/validate-project.mjs ./pixelmug-apps/my-idea --build
node scripts/fetch-doc.mjs /en/webapp/device-rpc
```

Use `--skip-install` with the scaffold script only when working offline; run npm installation before delivery.
