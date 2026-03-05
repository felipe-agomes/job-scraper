import { chromium } from "playwright";
import {
  loadFindJobConfig,
  loadConnectorConfig,
} from "./connectors/configLoader";
import { runJobList, runJobInfo } from "./scraper/jobScraper";
import { connectorsPlaceholderReplace } from "./utils/replacers";

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
    for (const connector of replaced) {
      console.log(`\n[${connector.id}]`);

      const links = await runJobList(connector.jobList, browser);
      await runJobInfo(connector.jobInfo, browser, links);
    }

    console.log("\nDone.");
  } finally {
    await browser.close();
  }
})();
