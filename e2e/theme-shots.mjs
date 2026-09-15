import { chromium } from "@playwright/test";
const out = process.argv[2];
const pages = ["/", "/check-availability", "/why-fiber", "/about", "/faq", "/contact", "/rep/oscar-salas", "/door/oscar-salas"];
const browser = await chromium.launch();
for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["phone", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport });
  for (const path of pages) {
    await page.goto(`http://localhost:3102${path}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${out}/${name}${path.replace(/\//g, "_") || "_home"}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
