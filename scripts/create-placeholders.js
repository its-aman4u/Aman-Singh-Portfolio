import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generatePlaceholders() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to match canvas size
  await page.setViewport({ width: 1024, height: 1024 });
  
  // Load the HTML file
  await page.goto(`file:${join(__dirname, '../public/projects/placeholder.html')}`);
  
  // Wait for a moment to ensure images are generated
  await page.waitForTimeout(2000);
  
  await browser.close();
  console.log('Placeholder images have been generated!');
}

generatePlaceholders().catch(console.error);
