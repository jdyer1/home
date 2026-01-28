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

function convertAllAdoc() {
  ensureDir(OUT_DIR);
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.adoc'));
  files.forEach(file => {
    const srcPath = path.join(SRC_DIR, file);
    const outPath = path.join(OUT_DIR, file.replace(/\.adoc$/, '.html'));
    const adoc = fs.readFileSync(srcPath, 'utf8');
    const html = asciidoctor.convert(adoc, { safe: 'safe', header_footer: true });
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`Converted ${file} -> ${outPath}`);
  });
}

convertAllAdoc();
