// Strict TypeScript, scans src/asciidoc for subfolders, reads metadata.yml, outputs menu data
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

interface MenuItem {
  name: string;
  icon: string;
  order: number;
  folder: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASCIIDOC_PATH = path.join(__dirname, '../src/asciidoc');
const OUTPUT_PATH = path.join(__dirname, '../src/app/menu-data.json');

function getMenuItems(): MenuItem[] {
  const items: MenuItem[] = [];
  const folders = fs.readdirSync(ASCIIDOC_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of folders) {
    const metaPath = path.join(ASCIIDOC_PATH, folder, 'metadata.yml');
    if (!fs.existsSync(metaPath)) continue;
    try {
      const meta = yaml.load(fs.readFileSync(metaPath, 'utf8')) as any;
      if (!meta || typeof meta !== 'object') continue;
      items.push({
        name: meta.name || folder,
        icon: meta.icon || 'question',
        order: typeof meta['menu order'] === 'number' ? meta['menu order'] : 999,
        folder,
      });
    } catch (e) {
      // skip invalid yaml
      continue;
    }
  }
  return items.sort((a, b) => a.order - b.order);
}

function main() {
  const items = getMenuItems();
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(items, null, 2));
}

main();
