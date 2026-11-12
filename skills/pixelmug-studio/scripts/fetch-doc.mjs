#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const input = process.argv[2];
if (!input) { console.error('Usage: node fetch-doc.mjs /en/webapp/device-rpc'); process.exit(1); }
const requested = /^https?:\/\//.test(input) ? input : `https://bubble-pixelmug.github.io/pixelmug-docs${input.startsWith('/') ? input : `/${input}`}`;
const urls = requested.endsWith('.html') ? [requested] : [requested, `${requested}.html`];
let url = null;
let html = null;
for (const candidate of urls) {
  try {
    const response = await fetch(candidate);
    if (response.ok) { url = candidate; html = await response.text(); break; }
  } catch (error) {
    if (candidate === urls.at(-1)) throw error;
  }
}
if (!html) throw new Error(`Documentation request failed: ${urls.join(' or ')}`);
const body = extractArticle(html);
const cacheDir = join(tmpdir(), 'pixelmug-skill-docs');
await mkdir(cacheDir, { recursive: true });
const cachePath = join(cacheDir, `${createHash('sha256').update(url).digest('hex')}.html`);
await writeFile(cachePath, body);
console.log(JSON.stringify({ url, cachePath, content: body }, null, 2));

function extractArticle(source) {
  const match = source.match(/<div class="(?:vp-doc|vp-doc-content)[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  const selected = match?.[1] || source;
  return selected
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
