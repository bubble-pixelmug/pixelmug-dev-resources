#!/usr/bin/env node
import { access, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(here, '..');
const workspace = process.cwd();
const candidates = [
  join(workspace, 'dev-resources'),
  process.env.PIXELMUG_RESOURCES ? resolve(process.env.PIXELMUG_RESOURCES) : null,
  join(skillRoot, '..', '..'),
].filter(Boolean);

let root = null;
for (const candidate of candidates) {
  if (await isDirectory(join(candidate, 'templates')) &&
      await isDirectory(join(candidate, 'examples')) &&
      await isDirectory(join(candidate, 'getting-started'))) {
    root = resolve(candidate);
    break;
  }
}

const result = {
  resources: root ? {
    root,
    templates: join(root, 'templates'),
    examples: join(root, 'examples'),
    gettingStarted: join(root, 'getting-started'),
  } : null,
  docsBaseUrl: 'https://bubble-pixelmug.github.io/pixelmug-docs/en/',
  studioSourceRequired: false,
};
console.log(JSON.stringify(result, null, 2));
if (!root) process.exitCode = 2;

async function isDirectory(path) {
  try { return (await stat(path)).isDirectory(); } catch { return false; }
}
