// scripts/watch-asciidoc.js
// Watches src/asciidoc for changes and converts .adoc files to HTML in public/asciidoc

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const SRC_DIR = path.join(__dirname, '../src/asciidoc');

console.log('Watching for changes in', SRC_DIR);

fs.watch(SRC_DIR, { recursive: false }, (eventType, filename) => {
  if (filename && filename.endsWith('.adoc')) {
    console.log(`Detected change in ${filename}, rebuilding...`);
    exec('node scripts/build-asciidoc.js', (err, stdout, stderr) => {
      if (err) {
        console.error('AsciiDoc build error:', stderr);
      } else {
        console.log(stdout);
      }
    });
  }
});
