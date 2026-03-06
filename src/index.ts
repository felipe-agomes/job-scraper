import { chromium } from "playwright";
import {
  loadFindJobConfig,
  loadConnectorConfig,
} from "./connectors/configLoader";
import { runJobList, runJobInfo } from "./scraper/jobScraper";
import { connectorsPlaceholderReplace } from "./utils/replacers";
import * as report from "./utils/report";
import { writeFile } from "xlsx";

const DEV_MODE = process.env.DEV === "true";
(async () => {
  const findJob = loadFindJobConfig("find_job.json");
  const connectors = loadConnectorConfig("src/connectors", findJob);
  const replaced = connectorsPlaceholderReplace(connectors, findJob);

  console.log(
    `Starting scraper for ${replaced.length} connector(s)${DEV_MODE ? " [DEV]" : ""}`,
  );

  const browser = await chromium.launch({
    headless: !DEV_MODE,
    slowMo: DEV_MODE ? 500 : 0,
  });

  try {
    const sheets: report.NewSheet[] = [];
    for (const connector of replaced) {
      console.log(`\n[${connector.id}]`);

      const links = await runJobList(connector.jobList, browser);
      const jobDetail = await runJobInfo(
        connector.id,
        connector.jobInfo,
        browser,
        links,
      );

      sheets.push({
        name: connector.id,
        data: jobDetail.data,
      });

      console.log(`  → Complete connector ${connector.id}`);
    }

    writeFile(report.createWorkBook(sheets), "reports.xlsx");
    console.log(`Saved to reports.xlsx`);

    console.log("\nDone.");
  } finally {
    await browser.close();
  }
})();
