import { test } from "@playwright/test";
import { loadSingleConnectorConfig } from "../../../src/connectors/configLoader";
import { runJobInfo, runJobList } from "../../../src/scraper/jobScraper";

test("Deve rodar o fluxo completo de raspagem e paginação", async ({
  browser,
}) => {
  const connector = loadSingleConnectorConfig("src/connectors/nttdata.yml");

  const jobList = await runJobList(connector.jobList, browser);

  const jobDetail = await runJobInfo(connector.id, connector.jobInfo, browser, jobList);
});
