const { chromium } = require(process.env.PW_MODULE || "playwright");
const path = require("path");

const OUT = path.resolve(__dirname, "portfolio", "projects");

async function describe(page, label) {
  console.log(`--- ${label} @ ${page.url()}`);
  const inputs = page.locator("input");
  for (let i = 0; i < (await inputs.count()); i++) {
    const el = inputs.nth(i);
    console.log("  input", i, await el.getAttribute("name"), "|", await el.getAttribute("type"), "|", await el.getAttribute("placeholder"));
  }
  const btns = page.locator("button");
  for (let i = 0; i < (await btns.count()); i++) {
    console.log("  button", i, JSON.stringify((await btns.nth(i).innerText()).slice(0, 40)));
  }
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const page = await context.newPage();
  page.on("requestfailed", (r) =>
    console.log("FAILED", r.failure() && r.failure().errorText, r.url().slice(0, 160))
  );
  page.on("response", (r) => {
    if (r.request().method() !== "GET") console.log("  RESP", r.status(), r.request().method(), r.url().slice(0, 140));
  });

  await page.goto("https://tudu-kanban.vercel.app/login", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(8000);

  const withEmail = page.getByText(/Continue with Email/i).first();
  if (await withEmail.count()) {
    await withEmail.click();
    await page.waitForTimeout(4000);
  }

  const email = `portfolio.demo.${Date.now()}@example.com`;
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill("PortfolioDemo!2026");

  await page.getByRole("button", { name: "Sign Up", exact: true }).first().click();
  await page.waitForTimeout(20000);

  console.log("URL after signup:", page.url());
  console.log("BODY:", (await page.locator("body").innerText()).slice(0, 800));
  await page.screenshot({ path: path.join(OUT, "tudu.png") });

  await browser.close();
}

main();