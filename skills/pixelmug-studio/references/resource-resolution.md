# Resource resolution

The skill requires local development resources but never requires the PixelMug Studio source checkout.

Required local directories:

```text
<resource-root>/templates
<resource-root>/examples
<resource-root>/getting-started
```

Resolution order:

1. `<current-workspace>/pixelmug-dev-resources`.
2. `PIXELMUG_RESOURCES` if set.
3. A user-supplied resource root in the request.

If none exists, stop and tell the user to clone the repository with its expected directory name:

```sh
git clone https://github.com/bubble-pixelmug/pixelmug-dev-resources.git pixelmug-dev-resources
```

Do not silently generate a generic project.

SDK documentation is remote and English-only:

```text
https://bubble-pixelmug.github.io/pixelmug-docs/en/
```

Use a web reader when available. Otherwise use `scripts/fetch-doc.mjs`; it fetches one page, extracts the VitePress article body, and stores only a temporary cache copy. The documentation site is authoritative for SDK signatures, limits, and device APIs.
