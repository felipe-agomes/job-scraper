import { writeFileSync } from "fs";
import { chromium } from "playwright";
import type { ConnectorJobInfo, ConnectorJobList } from "../connectors/types";
import { executeSteps } from "./engine";
import { extractAllPages } from "./pagination";

async function runJobList(jobList: ConnectorJobList) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(jobList.mainPage);
    await executeSteps(page, jobList.steps);

    const links = await extractAllPages(page, jobList.pagination);

    writeFileSync(jobList.outdir, JSON.stringify(links, null, 2));
  } finally {
    await browser.close();
  }
}

export { runJobScraper };
