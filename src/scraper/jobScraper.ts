import { chromium } from "playwright";
import type { ConnectorJobInfo, ConnectorJobList } from "../connectors/types";
import { executeStep, executeSteps } from "./engine";
import { extractAllPages } from "./pagination";
import { readFileSync, writeFileSync } from "node:fs";

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

async function runJobInfo(jobInfo: ConnectorJobInfo) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const links = JSON.parse(readFileSync(jobInfo.indir, { encoding: "utf8" }));
  const result: Record<string, string>[] = [];
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
}

export { runJobList, runJobInfo };
