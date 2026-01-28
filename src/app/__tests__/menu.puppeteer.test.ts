import puppeteer, { Browser, Page } from 'puppeteer';
import menuData from '../menu-data.json';

describe('Menu (Puppeteer)', () => {
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

  it('renders all menu icons in order', async () => {
    for (const item of menuData) {
      const icon = await page.$(`nav [title='${item.name}']`);
      expect(icon).not.toBeNull();
    }
  });

  it('expands menu item on hover and collapses after 1s', async () => {
    const firstItem = menuData[0];
    const iconSelector = `nav [title='${firstItem.name}']`;
    const icon = await page.$(iconSelector);
    const parent = await icon.evaluateHandle(el => el.parentElement);
    await parent.hover();
    await page.waitForSelector(`nav span`, { visible: true });
    const label = await page.$eval(`nav span`, el => el.textContent);
    expect(label).toContain(firstItem.name);
    await parent.evaluate(el => el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))); 
    await page.waitForTimeout(1100);
    const labelAfter = await page.$(`nav span`);
    expect(labelAfter).toBeNull();
  });
});
