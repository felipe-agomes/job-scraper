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

  for (const connector of replaced) {
    await runJobList(connector.jobList);
    await runJobInfo(connector.jobInfo);
  }
})();
