import puppeteer, { Browser, Page } from 'puppeteer';
import menuData from '../menu-data.json';

// These tests assume the dev server is running at http://localhost:3000

describe('Sidebar Article Navigation (Puppeteer)', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('shows rendered article directly for single-article folder', async () => {
    // Theology has one article
    await page.evaluate(() => { window.location.hash = '#/Theology'; });
    await page.waitForSelector('.asciidoc-content');
    const content = await page.$eval('.asciidoc-content', el => el.textContent || '');
    expect(content).toMatch(/Doctrinal Statement/i);
  });

  it('shows blank page for folder with no articles', async () => {
    // Simulate a folder with no articles (create one for test or mock)
    // For now, test that a non-existent folder shows blank
    await page.evaluate(() => { window.location.hash = '#/Nonexistent'; });
    await page.waitForTimeout(500);
    const content = await page.$eval('main', el => el.textContent || '');
    expect(content.trim()).toBe('');
  });

  it('shows article links for multi-article folder, sorted lexically', async () => {
    // Music folder: sort: lex
    await page.evaluate(() => { window.location.hash = '#/Music'; });
    await page.waitForSelector('ul');
    const links = await page.$$eval('ul li a', els => els.map(a => a.textContent));
    expect(links).toEqual([
      '1- AP Music Theory',
      '2- AP Muisic Theory',
    ]);
  });

  it('shows article links for multi-article folder, sorted by date', async () => {
    // Search Engines: sort: date
    await page.evaluate(() => { window.location.hash = '#/Search%20Engines'; });
    await page.waitForSelector('ul');
    const links = await page.$$eval('ul li a', els => els.map(a => a.textContent));
    // Should be sorted by mtime descending (see metadata.json)
    expect(links).toEqual([
      'Improving Relevancy with LLMs',
      'Traditional Relevancy Techniques',
    ]);
  });

  it('navigates to article when link is clicked', async () => {
    await page.evaluate(() => { window.location.hash = '#/Music'; });
    await page.waitForSelector('ul li a');
    const firstLink = await page.$('ul li a');
    await firstLink.click();
    await page.waitForSelector('.asciidoc-content');
    const content = await page.$eval('.asciidoc-content', el => el.textContent || '');
    expect(content).toMatch(/AP Music Theory/i);
  });
});
