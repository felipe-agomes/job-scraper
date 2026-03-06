import { test, expect } from "@playwright/test";
import { loadSingleConnectorConfig } from "../../../src/connectors/configLoader";
import { runJobInfo, runJobList } from "../../../src/scraper/jobScraper";
import path from "path";
import { fileURLToPath } from "url";

test("Deve rodar o fluxo completo de raspagem e paginação", async ({
  browser,
}) => {
  const connector = loadSingleConnectorConfig(
    "tests/playwright/connectors/example.yml",
  );

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const mockHtmlPath = path.resolve(__dirname, connector.jobList.mainPage);
  connector.jobList.mainPage = `file://${mockHtmlPath}`;

  const jobList = (await runJobList(connector.jobList, browser)).map(
    () => `file://${path.resolve(__dirname, "html_mocks/detail.html")}`,
  );

  const jobDetail = await runJobInfo(
    connector.id,
    connector.jobInfo,
    browser,
    jobList,
  );

  expect(jobDetail.id).toBe(connector.id);
  expect(jobDetail.data.length).toBe(4);
});
