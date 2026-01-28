// This file monkey-patches Puppeteer to always use --no-sandbox in GitHub Actions
const puppeteer = require('puppeteer');

const originalLaunch = puppeteer.launch;
puppeteer.launch = function (options = {}) {
  const isCI = !!process.env.GITHUB_ACTIONS;
  if (isCI) {
    options.args = Array.isArray(options.args) ? options.args : [];
    if (!options.args.includes('--no-sandbox')) {
      options.args.push('--no-sandbox');
    }
  }
  return originalLaunch.call(this, options);
};

module.exports = puppeteer;
