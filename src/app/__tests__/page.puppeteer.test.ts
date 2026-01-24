import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:3000';

describe('Counter Page', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('increments counter and persists after reload', async () => {
    await page.goto(APP_URL);
    await page.waitForSelector('#counter-button');
    await page.click('#counter-button');
    await page.waitForSelector('#counter-value');
    let value = await page.$eval('#counter-value', el => el.textContent);
    expect(value).toBe('1');

    // Reload and check persistence
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForSelector('#counter-value');
    value = await page.$eval('#counter-value', el => el.textContent);
    expect(value).toBe('1');

    // Click again
    await page.click('#counter-button');
    value = await page.$eval('#counter-value', el => el.textContent);
    expect(value).toBe('2');
  });
});
