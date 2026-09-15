// Manual smoke for both entry points against `next start -p 3102`:
//   node e2e/lead-flow.smoke.mjs <screenshot-dir> "<street, city ST zip>" [public|rep]
// Submits a clearly-labelled test lead ("Smoke Test"), prints the request number, and screenshots each step.
import { chromium } from "@playwright/test";

const [out, address, mode = "rep"] = process.argv.slice(2);
const entry = mode === "rep" ? "/r/oscar-salas?utm_source=test&utm_campaign=smoke" : "/check-availability?utm_source=test&utm_campaign=smoke";
const submitLabel = mode === "rep" ? /Send to closer/ : /Get my best offer|Put me on the list/;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("console", (message) => {
  if (message.type() === "error") console.log("console.error:", message.text().slice(0, 300));
});

await page.goto(`http://localhost:3102${entry}`);
await page.getByLabel("Street address").fill(address);
await page.getByRole("button", { name: "Check address" }).click();
await page.getByText("Change address").waitFor({ timeout: 30000 });
console.log("result:", await page.locator("h3").first().innerText());
console.log("pre-selected:", await page.locator('button[aria-pressed="true"]').allInnerTexts());
await page.screenshot({ path: `${out}/${mode}-result.png`, fullPage: true });

const preselected = await page.locator('button[aria-pressed="true"]').count();
if (preselected === 0) await page.getByRole("button", { name: "Find me the best option" }).click();
await page.getByRole("button", { name: "1 Gig", exact: true }).click();
await page.getByLabel("First name").fill("Smoke");
await page.getByLabel("Last name").fill("Test");
await page.getByLabel("Mobile number").fill("(469) 555-0100");
await page.getByLabel("Email", { exact: true }).fill("smoke-test@fiberfastusa.com");
await page.getByLabel("Date of birth (optional)").fill("1990-01-15");
await page.getByRole("checkbox").check();
await page.screenshot({ path: `${out}/${mode}-filled.png`, fullPage: true });
await page.getByRole("button", { name: submitLabel }).click();
await page.getByText(/Request number/i).waitFor({ timeout: 30000 });
console.log("after submit:", (await page.locator("main").innerText()).slice(0, 320).replace(/\n+/g, " | "));
await page.screenshot({ path: `${out}/${mode}-submit.png`, fullPage: true });
await browser.close();
