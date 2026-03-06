import { test } from "@playwright/test";
import { loadSingleConnectorConfig } from "../../../src/connectors/configLoader";
import { runJobInfo, runJobList } from "../../../src/scraper/jobScraper";

test.skip("Deve rodar o fluxo completo de raspagem e paginação", async ({
  browser,
}) => {
  const connectors = loadSingleConnectorConfig("src/connectors/nexti.yml");
  const nextiConnector = connectors;

  const jobList = await runJobList(nextiConnector.jobList, browser);

  await runJobInfo(nextiConnector.jobInfo, browser, jobList);
});
