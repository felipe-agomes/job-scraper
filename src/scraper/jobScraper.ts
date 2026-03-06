import type { Browser } from "playwright";
import type {
  ConnectorJobInfo,
  ConnectorJobList,
  JobDetail,
} from "../connectors/types";
import { executeStep, executeSteps } from "./engine";
import { extractAllPages } from "./pagination";

async function runJobList(
  jobList: ConnectorJobList,
  browser: Browser,
): Promise<string[]> {
  const page = await browser.newPage();

  try {
    console.log(`  → Navigating to ${jobList.mainPage}`);

    await page.goto(jobList.mainPage);
    await executeSteps(page, jobList.steps);

    const links = await extractAllPages(page, jobList.pagination);

    console.log(`  → Found ${links.length} job listings`);

    return links;
  } finally {
    await page.close();
  }
}

async function runJobInfo(
  connectorId: string,
  jobInfo: ConnectorJobInfo,
  browser: Browser,
  links: string[],
): Promise<JobDetail> {
  const page = await browser.newPage();
  const result: JobDetail = { id: connectorId, data: [] };

  try {
    for (const [index, link] of links.entries()) {
      process.stdout.write(`  → Scraping job ${index + 1}/${links.length}\r`);

      await page.goto(link);
      await executeSteps(page, jobInfo.steps);

      const jobData: Record<string, string> = {};
      for (const info of jobInfo.infos) {
        const stepResult = await executeStep(page, info);
        if (stepResult) jobData[info.name] = stepResult.join();
      }
      result.data.push(jobData);
    }
    process.stdout.write("\n");

    return result;
  } finally {
    await page.close();
  }
}

export { runJobList, runJobInfo };
