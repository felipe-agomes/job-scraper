import { chromium } from "playwright";
import {
  loadFindJobConfig,
  loadConnectorConfig,
} from "./connectors/configLoader";
import { runJobList, runJobInfo } from "./scraper/jobScraper";
import { connectorsPlaceholderReplace } from "./utils/replacers";

(async () => {
  const findJob = loadFindJobConfig("find_job.json");
  const connectors = loadConnectorConfig("src/connectors", findJob);
  const replaced = connectorsPlaceholderReplace(connectors, findJob);

  const browser = await chromium.launch({ headless: false });

  try {
    for (const connector of replaced) {
      const links = await runJobList(connector.jobList, browser);
      await runJobInfo(connector.jobInfo, browser, links);
    }
  } finally {
    await browser.close();
  }
})();
