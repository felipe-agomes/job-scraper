import { writeFileSync } from "fs";
import { chromium } from "playwright";
import type { Connector } from "../connectors/types";
import { executeSteps } from "./engine";
import { extractAllPages } from "./pagination";

async function runJobScraper(connector: Connector) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(connector.jobList.mainPage);
    await executeSteps(page, connector.jobList.steps);

    const links = await extractAllPages(page, connector.jobList.pagination);

    writeFileSync(connector.jobList.outdir, JSON.stringify(links, null, 2));
  } finally {
    await browser.close();
  }
}

export { runJobScraper };
