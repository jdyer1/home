// Patch Puppeteer to use --no-sandbox in CI
require('./jest.puppeteer-patch.js');

jest.setTimeout(30000); // 30 seconds for Puppeteer tests
