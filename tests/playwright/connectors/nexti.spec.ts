import { test } from "@playwright/test";
import { loadSingleConnectorConfig } from "../../../src/connectors/configLoader";
import { runJobInfo, runJobList } from "../../../src/scraper/jobScraper";

test.skip("Deve rodar o fluxo completo de raspagem e paginação", async ({
  browser,
}) => {
  const connector = loadSingleConnectorConfig("src/connectors/nexti.yml");

  const jobList = await runJobList(connector.jobList, browser);

  const result = await runJobInfo(
    connector.id,
    connector.jobInfo,
    browser,
    jobList,
  );
});
