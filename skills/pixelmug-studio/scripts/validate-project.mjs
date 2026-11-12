#!/usr/bin/env node
import { access, readFile, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const project = resolve(process.argv[2] || '.');
const shouldBuild = process.argv.includes('--build');
const errors = [];
const warnings = [];
const manifest = await readJson(join(project, 'package.json'), 'root package.json');
if (manifest && !manifest.dependencies?.['@jeejio-bubble/bot']) errors.push('root package.json must declare @jeejio-bubble/bot');
if (manifest && manifest.type !== 'module') warnings.push('root package.json should set type=module');
if (!(await isDirectory(join(project, 'bot')))) errors.push('missing bot/ directory');
const botEntry = await findBot(project);
if (!botEntry) errors.push('missing .js/.mjs/.cjs Bot entry under bot/');
else if (await runCheck('node', ['--check', botEntry], project)) errors.push(`Bot syntax check failed: ${relative(project, botEntry)}`);

const webapp = join(project, 'webapp');
if (await isDirectory(webapp)) {
  const webManifest = await readJson(join(webapp, 'package.json'), 'webapp/package.json');
  if (!await isFile(join(webapp, 'index.html'))) errors.push('webapp/index.html is required');
  if (webManifest && typeof webManifest.scripts?.build !== 'string') errors.push('webapp/package.json must define scripts.build');
  if (shouldBuild && webManifest && !(await run('npm', ['run', 'build'], webapp))) errors.push('WebApp build failed');
}

const mpy = join(project, 'mpy');
if (await isDirectory(mpy)) {
  if (!await isFile(join(mpy, '__main__.py'))) errors.push('mpy/__main__.py is required');
  const mps = await readJson(join(mpy, 'mps.json'), 'mpy/mps.json');
  if (mps) {
    if (!isNonEmptyString(mps.name)) errors.push('mps.json name is required');
    if (!isNonEmptyString(mps.version)) errors.push('mps.json version is required');
    if (!Array.isArray(mps.dependencies)) errors.push('mps.json dependencies must be an array');
  }
  if (await isFile(join(mpy, '__main__.py')) && await commandExists('python')) {
    if (await runCheck('python', ['-m', 'py_compile', join(mpy, '__main__.py')], project)) warnings.push('MPY entry did not pass host Python syntax check');
  }
}

const result = { project, valid: errors.length === 0, errors, warnings };
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;

async function findBot(root) { for (const name of ['index.js', 'index.mjs', 'index.cjs', 'main.js', 'main.mjs', 'main.cjs', 'bot.js', 'bot.mjs', 'bot.cjs']) { const path = join(root, 'bot', name); if (await isFile(path)) return path; } return null; }
async function readJson(path, label) { try { const data = JSON.parse(await readFile(path, 'utf8')); if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(); return data; } catch { if (!(await isFile(path))) errors.push(`${label} is required`); else errors.push(`${label} must be a JSON object`); return null; } }
async function isFile(path) { try { return (await stat(path)).isFile(); } catch { return false; } }
async function isDirectory(path) { try { return (await stat(path)).isDirectory(); } catch { return false; } }
function isNonEmptyString(value) { return typeof value === 'string' && value.trim(); }
async function commandExists(command) { return await run(command, ['--version'], project, true); }
async function runCheck(command, args, cwd) { return !(await run(command, args, cwd)); }
async function run(command, args, cwd, quiet = false) {
  return new Promise(resolvePromise => {
    const windowsNpm = process.platform === 'win32' && command === 'npm';
    const executable = windowsNpm ? (process.env.ComSpec || 'cmd.exe') : command;
    const commandArgs = windowsNpm ? ['/d', '/s', '/c', ['npm.cmd', ...args].join(' ')] : args;
    const child = spawn(executable, commandArgs, { cwd, windowsHide: true, stdio: quiet ? 'ignore' : 'inherit' });
    child.once('error', () => resolvePromise(false));
    child.once('exit', code => resolvePromise(code === 0));
  });
}
