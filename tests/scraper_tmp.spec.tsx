import { test, expect } from "@playwright/test";
import assert from "node:assert";

test("open Jobs page", async ({ page }) => {
  await page.goto("https://careers.emeal.nttdata.com/s/?language=pt_BR");

  assert((await page.title()) === "Jobs");
});

test("Decline cookie button is visible", async ({ page }) => {
  await page.goto("https://careers.emeal.nttdata.com/s/?language=pt_BR");

  await expect(
    page
      .frameLocator("#ifrmCookieBanner")
      .getByRole("button", { name: "Decline" }),
  ).toBeVisible();
});

test("fill job input with term", async ({ page }) => {
  await page.goto("https://careers.emeal.nttdata.com/s/?language=pt_BR");

  await page
    .frameLocator("#ifrmCookieBanner")
    .getByRole("button", { name: "Decline" })
    .click();

  const input = page.getByPlaceholder(
    "Encontre a oportunidade que está procurando",
  );
  await input.fill("Desenvolvedor");

  await expect(input).toHaveValue("Desenvolvedor");
});

test("list jobs", async ({ page }) => {
  await page.goto("https://careers.emeal.nttdata.com/s/?language=pt_BR");

  await page
    .frameLocator("#ifrmCookieBanner")
    .getByRole("button", { name: "Decline" })
    .click();

  await page
    .getByPlaceholder("Encontre a oportunidade que está procurando")
    .fill("Desenvolvedor");

  await page.getByRole("button", { name: "Pesquisar" }).click();

  await expect(page.locator(".views-row").first()).toBeVisible();
});

test("get all job links", async ({ page }) => {
  await page.goto("https://careers.emeal.nttdata.com/s/?language=pt_BR");

  await page
    .frameLocator("#ifrmCookieBanner")
    .getByRole("button", { name: "Decline" })
    .click();

  await page
    .getByPlaceholder("Encontre a oportunidade que está procurando")
    .fill("Desenvolvedor");

  await page.getByRole("button", { name: "Pesquisar" }).click();

  let current = 1;
  const links = [];
  while (true) {
    const jobs = page.locator(".views-row");
    const count = await jobs.count();

    for (let i = 0; i < count; i++) {
      const job = jobs.nth(i);
      const href = await job
        .getByRole("link", { name: "Ver mais" })
        .getAttribute("href");
      links.push(href);
    }

    const nextButton = page.getByText(String(current + 1), { exact: true });

    if ((await nextButton.count()) === 0) break;

    await nextButton.click();
    current++;
  }

  expect(links.length > 0);
});

test("access all jobs", async ({ page }) => {
  await page.goto("https://careers.emeal.nttdata.com/s/?language=pt_BR");

  await page
    .frameLocator("#ifrmCookieBanner")
    .getByRole("button", { name: "Decline" })
    .click();

  await page
    .getByPlaceholder("Encontre a oportunidade que está procurando")
    .fill("Desenvolvedor");

  await page.getByRole("button", { name: "Pesquisar" }).click();

  let current = 1;
  const links: string[] = [];
  while (true) {
    const jobs = page.locator(".views-row");
    const count = await jobs.count();

    for (let i = 0; i < count; i++) {
      const job = jobs.nth(i);
      const href = await job
        .getByRole("link", { name: "Ver mais" })
        .getAttribute("href");
      if (href) {
        links.push(href);
      }
    }

    const nextButton = page.getByText(String(current + 1), { exact: true });

    if ((await nextButton.count()) === 0) break;

    await nextButton.click();
    current++;
  }

  for (let i = 0; i < Math.min(links.length, 3); i++) {
    if (i >= 3) break;

    const link: string = links[i]!;
    await page.goto(link);
    await expect(page.getByRole("heading")).toBeVisible();
  }
});
