import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const ASSETS_BASE = 'https://vudoan1708-cyber.github.io/logos/portfolio';

async function loadDataFile(filename) {
  const src = await fs.readFile(path.join(DATA_DIR, filename), 'utf-8');
  const exports = [];
  const transformed = src.replace(/export\s+const\s+(\w+)/g, (_, name) => {
    exports.push(name);
    return `var ${name}`;
  });
  const wrapped = `${transformed}\nreturn { ${exports.join(', ')} };`;
  return new Function(wrapped)();
}

function stripBase(value) {
  if (typeof value !== 'string') return value;
  if (value.startsWith(ASSETS_BASE)) return value.slice(ASSETS_BASE.length) || '/';
  return value;
}

const ASSET_KEYS = new Set(['img', 'img-lg', 'logo', 'src', 'cover']);

function deepStrip(node) {
  if (Array.isArray(node)) return node.map(deepStrip);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string' && ASSET_KEYS.has(key)) {
        out[key] = stripBase(value);
      } else {
        out[key] = deepStrip(value);
      }
    }
    return out;
  }
  return node;
}

async function writeJson(filename, payload) {
  const filepath = path.join(DATA_DIR, filename);
  await fs.writeFile(filepath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`  → ${path.relative(ROOT, filepath)}`);
}

console.log('Reading data files…');
const projectsModule = await loadDataFile('projects.js');
const experiencesModule = await loadDataFile('experiences.js');
const musicModule = await loadDataFile('music.js');

console.log('Writing JSON snapshots with relative asset paths…');
await writeJson('projects.json', {
  projects: deepStrip(projectsModule.projects),
  projectCollections: deepStrip(projectsModule.projectCollections),
});
await writeJson('experiences.json', {
  experiences: deepStrip(experiencesModule.experiences),
});
await writeJson('music.json', {
  tracks: deepStrip(musicModule.tracks),
});

console.log('Done. Review the JSON files, then delete the .js originals if happy.');
