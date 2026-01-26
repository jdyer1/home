
import puppeteer, { Browser, Page } from 'puppeteer';


const APP_URL = 'http://localhost:3000';

describe('Counter Page', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async (): Promise<void> => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async (): Promise<void> => {
    await browser.close();
  });

  it('increments counter and persists after reload', async (): Promise<void> => {
    await page.goto(APP_URL);
    await page.waitForSelector('#counter-button');
    await page.click('#counter-button');
    await page.waitForSelector('#counter-value');
    let value: string | null = await page.$eval('#counter-value', (el: Element) => el.textContent);
    expect(value).toBe('1');

    // Reload and check persistence
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForSelector('#counter-value');
    value = await page.$eval('#counter-value', (el: Element) => el.textContent);
    expect(value).toBe('1');

    // Click again
    await page.click('#counter-button');
    value = await page.$eval('#counter-value', (el: Element) => el.textContent);
    expect(value).toBe('2');
  });
});
