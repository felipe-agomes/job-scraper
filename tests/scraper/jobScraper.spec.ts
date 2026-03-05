import test, { expect } from "playwright/test";
import { loadSingleConnectorConfig } from "../../src/connectors/configLoader";
import { runJobInfo, runJobList } from "../../src/scraper/jobScraper";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "node:fs";

test("Deve rodar o fluxo completo de raspagem e paginação", async ({
  browser,
}) => {
  const connector = loadSingleConnectorConfig("tests/connectors/example.yml");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const mockHtmlPath = path.resolve(__dirname, connector.jobList.mainPage);
  connector.jobList.mainPage = `file://${mockHtmlPath}`;

  const jobList = (await runJobList(connector.jobList, browser)).map(
    () => `file://${path.resolve(__dirname, "html_mocks/detail.html")}`,
  );

  await runJobInfo(connector.jobInfo, browser, jobList);

  expect(
    JSON.parse(
      readFileSync("tests/reports/mock_job_info.json", { encoding: "utf8" }),
    ).length,
  ).toBe(4);
});
