// scripts/build-asciidoc.js
// Converts all .adoc files in src/asciidoc to HTML in public/asciidoc
// Usage: node scripts/build-asciidoc.js

const fs = require('fs');
const path = require('path');
const asciidoctor = require('asciidoctor')();

const SRC_DIR = path.join(__dirname, '../src/asciidoc');
const OUT_DIR = path.join(__dirname, '../public/asciidoc');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}


function getAdocFiles(dir) {
  // Returns array of { file, fullPath, stat }
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.adoc'))
    .map(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      return { file, fullPath, stat };
    });
}

function getSortType(dir) {
  // Looks for metadata.yml and returns 'lex' or 'date' (default lex)
  const metaPath = path.join(dir, 'metadata.yml');
  if (fs.existsSync(metaPath)) {
    const content = fs.readFileSync(metaPath, 'utf8');
    const match = content.match(/sort:\s*(lex|date)/);
    if (match) return match[1];
  }
  return 'lex';
}

function convertAdocInFolder(srcFolder, outFolder) {
  ensureDir(outFolder);
  const adocFiles = getAdocFiles(srcFolder);
  const articles = adocFiles.map(({ file, fullPath, stat }) => {
    const adoc = fs.readFileSync(fullPath, 'utf8');
    const html = asciidoctor.convert(adoc, { safe: 'safe', header_footer: true });
    const outFile = file.replace(/\.adoc$/, '.html');
    const outPath = path.join(outFolder, outFile);
    fs.writeFileSync(outPath, html, 'utf8');
    return {
      file,
      htmlFile: outFile,
      title: file.replace(/\.adoc$/, ''),
      mtime: stat.mtime.getTime(),
    };
  });
  // Sort articles
  const sortType = getSortType(srcFolder);
  if (sortType === 'lex') {
    articles.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortType === 'date') {
    articles.sort((a, b) => b.mtime - a.mtime);
  }
  // Write metadata.json
  fs.writeFileSync(path.join(outFolder, 'metadata.json'), JSON.stringify({ articles, sort: sortType }, null, 2), 'utf8');
  return articles;
}

function walkAndConvert(srcDir, outDir) {
  ensureDir(outDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  // Convert .adoc files in this folder
  convertAdocInFolder(srcDir, outDir);
  // Recurse into subfolders
  for (const entry of entries) {
    if (entry.isDirectory()) {
      walkAndConvert(path.join(srcDir, entry.name), path.join(outDir, entry.name));
    }
  }
}

walkAndConvert(SRC_DIR, OUT_DIR);
