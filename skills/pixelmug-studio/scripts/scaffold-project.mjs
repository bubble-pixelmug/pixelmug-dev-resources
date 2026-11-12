#!/usr/bin/env node
import { access, cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = parseArgs(process.argv.slice(2));
const template = args.template || '01-bot-only';
const rawName = args.name;
if (!rawName) usage('Missing --name');
const root = await locateResources();
const source = join(root, 'templates', template);
await ensureDirectory(source, `Unknown template: ${template}`);
const slug = slugify(rawName);
const outputBase = resolve(args.outputRoot || join(process.cwd(), 'pixelmug-apps'));
await mkdir(outputBase, { recursive: true });
const destination = await uniqueDestination(outputBase, slug);
await copyClean(source, destination);

const packagePath = join(destination, 'package.json');
const manifest = JSON.parse(await readFile(packagePath, 'utf8'));
manifest.name = `pixelmug-${slug}`;
manifest.private = true;
manifest.version ||= '1.0.0';
manifest.type ||= 'module';
await writeFile(packagePath, JSON.stringify(manifest, null, 2) + '\n');

if (!args.skipInstall) {
  await npmInstall(destination);
  const webapp = join(destination, 'webapp');
  if (await isDirectory(webapp)) await npmInstall(webapp);
}

console.log(JSON.stringify({ project: destination, template, installed: !args.skipInstall }, null, 2));

async function locateResources() {
  const candidates = [
    join(process.cwd(), 'dev-resources'),
    process.env.PIXELMUG_RESOURCES ? resolve(process.env.PIXELMUG_RESOURCES) : null,
    resolve(dirname(fileURLToPath(import.meta.url)), '../../../..', 'dev-resources'),
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (await isDirectory(join(candidate, 'templates'))) return resolve(candidate);
  }
  usage('Could not locate dev-resources. Clone the PixelMug development resources or set PIXELMUG_RESOURCES.');
}

async function copyClean(sourceDir, targetDir) {
  const ignored = new Set(['debug', 'dist', 'node_modules', '.git', '.tmp', 'coverage']);
  await mkdir(targetDir, { recursive: true });
  for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.name.endsWith('.log')) continue;
    const from = join(sourceDir, entry.name);
    const to = join(targetDir, entry.name);
    if (entry.isDirectory()) await copyClean(from, to);
    else await cp(from, to, { force: true });
  }
}

async function npmInstall(cwd) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  await new Promise((resolvePromise, reject) => {
    const child = spawn(command, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd, stdio: 'inherit', windowsHide: true });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolvePromise() : reject(new Error(`npm install failed in ${cwd} (exit ${code})`)));
  });
}

async function uniqueDestination(base, slug) {
  let i = 1;
  while (true) {
    const candidate = join(base, i === 1 ? slug : `${slug}-${i}`);
    try { await access(candidate); i += 1; } catch { return candidate; }
  }
}
async function isDirectory(path) { try { return (await stat(path)).isDirectory(); } catch { return false; } }
async function ensureDirectory(path, message) { if (!(await directory(path))) usage(message); }
async function directory(path) { return isDirectory(path); }
function slugify(value) { const slug = value.normalize('NFKD').replace(/[^\w\s-]/g, '').trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50); return slug || 'pixelmug-app'; }
function parseArgs(values) { const out = {}; for (let i = 0; i < values.length; i += 1) { const value = values[i]; if (value === '--skip-install') out.skipInstall = true; else if (value.startsWith('--')) out[value.slice(2)] = values[++i]; } return out; }
function usage(message) { if (message) console.error(message); console.error('Usage: node scaffold-project.mjs --name "idea" --template 01-bot-only [--outputRoot path] [--skip-install]'); process.exit(1); }
