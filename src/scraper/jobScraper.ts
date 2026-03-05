import type { Browser } from "playwright";
import type { ConnectorJobInfo, ConnectorJobList } from "../connectors/types";
import { executeStep, executeSteps } from "./engine";
import { extractAllPages } from "./pagination";
import { writeFileSync } from "node:fs";

async function runJobList(
  jobList: ConnectorJobList,
  browser: Browser,
): Promise<string[]> {
  const page = await browser.newPage();

  try {
    await page.goto(jobList.mainPage);
    await executeSteps(page, jobList.steps);

    const links = await extractAllPages(page, jobList.pagination);

    return links;
  } finally {
    await page.close();
  }
}

async function runJobInfo(
  jobInfo: ConnectorJobInfo,
  browser: Browser,
  links: string[],
): Promise<void> {
  const page = await browser.newPage();
  const result: Record<string, string>[] = [];

  try {
    for (const link of links) {
      await page.goto(link);
      await executeSteps(page, jobInfo.steps);

      for (const info of jobInfo.infos) {
        const stepResult = await executeStep(page, info);

        if (stepResult)
          result.push({ [info.action?.value ?? ""]: stepResult.join() });
      }
    }

    writeFileSync(jobInfo.outdir, JSON.stringify(result, null, 2));
  } finally {
    await page.close();
  }
}

export { runJobList, runJobInfo };
