import { expect, test } from "@playwright/test";
import { loadSingleConnectorConfig } from "../../../src/connectors/configLoader";
import { runJobInfo, runJobList } from "../../../src/scraper/jobScraper";

test.skip("Deve rodar o fluxo completo de raspagem e paginação", async ({
  browser,
}) => {
  const connector = loadSingleConnectorConfig("src/connectors/nttdata.yml");

  const jobList = await runJobList(connector.jobList, browser);
  console.log(jobList);

  const jobDetail = await runJobInfo(
    connector.id,
    connector.jobInfo,
    browser,
    jobList,
  );
  console.log(jobDetail);

  expect(jobDetail.id).toBe("nttdata");
  expect(jobDetail.data.length).toBeGreaterThan(0);
  expect(jobDetail.data[0]).toHaveProperty("Description");
});
