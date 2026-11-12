# Project contract

The generated directory is opened as a project root in PixelMug Studio.

```text
project/
├─ package.json
├─ package-lock.json
├─ bot/
│  └─ index.js              # required Bot entry
├─ webapp/                  # optional
│  ├─ index.html
│  ├─ package.json
│  └─ ...
└─ mpy/                     # optional
   ├─ __main__.py
   ├─ mps.json
   └─ ...
```

The root package must explicitly declare `@jeejio-bubble/bot`. Studio supplies runtime environment variables and does not save the Bot token into the project.

For WebApp projects, `webapp/package.json` must define `scripts.build`; Vite projects normally emit `webapp/dist/`.

For MPY projects, `mps.json` must be a JSON object containing:

```json
{
  "name": "my-pixelmug-app",
  "version": "1.0.0",
  "description": "...",
  "dependencies": [{ "name": "micropyxel", "version": ">=1.0.0" }]
}
```

Do not include `debug/`, `dist/`, `node_modules/`, `.env`, tokens, or generated logs in a new project. Studio creates runtime records under `debug/` later.
