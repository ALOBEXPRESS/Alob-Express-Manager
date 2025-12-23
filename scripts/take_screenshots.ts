
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function captureScreenshots() {
  console.log('Starting screenshot capture...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const baseUrl = 'http://localhost:3000/pt-br';
  const routes = [
    { path: '/', name: 'dashboard' },
    { path: '/index-2', name: 'dashboard-2' },
    { path: '/index-4', name: 'dashboard-4' }
  ];

  const screenshotDir = path.resolve(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  for (const route of routes) {
    const fullUrl = `${baseUrl}${route.path}`;
    console.log(`Navigating to ${fullUrl}...`);
    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle' });
      // Wait a bit for animations/charts
      await page.waitForTimeout(2000);
      
      const filePath = path.join(screenshotDir, `${route.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Saved screenshot to ${filePath}`);
    } catch (error) {
      console.error(`Failed to capture ${fullUrl}:`, error);
    }
  }

  await browser.close();
  console.log('Screenshot capture complete.');
}

captureScreenshots().catch(console.error);
