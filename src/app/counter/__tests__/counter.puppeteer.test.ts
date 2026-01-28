import puppeteer, { Browser, Page } from '../../../../jest.puppeteer-patch.js';

const APP_URL = 'http://localhost:3000/counter';

describe('Counter Component', () => {
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

    // Initial state: button shows '#'
    let btnText: string | null = await page.$eval('#counter-button', (el: Element) => el.textContent);
    expect(btnText).toBe('#');

    // Click: button shows '1'
    await page.click('#counter-button');
    btnText = await page.$eval('#counter-button', (el: Element) => el.textContent);
    expect(btnText).toBe('1');

    // Reload and check persistence
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForSelector('#counter-button');
    btnText = await page.$eval('#counter-button', (el: Element) => el.textContent);
    expect(btnText).toBe('1');

    // Click again: button shows '2'
    await page.click('#counter-button');
    btnText = await page.$eval('#counter-button', (el: Element) => el.textContent);
    expect(btnText).toBe('2');
  });
});
