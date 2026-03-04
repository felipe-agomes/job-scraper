import test, { expect } from "playwright/test";
import { loadSingleConnectorConfig } from "../../src/connectors/configLoader";
import { runJobInfo, runJobList } from "../../src/scraper/jobScraper";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

test("Deve rodar o fluxo completo de raspagem e paginação", async () => {
  const connector = loadSingleConnectorConfig("tests/connectors/example.yml");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const mockHtmlPath = path.resolve(__dirname, connector.jobList.mainPage);
  connector.jobList.mainPage = `file://${mockHtmlPath}`;

  await runJobList(connector.jobList);

  const mockDetailPath = path.resolve(__dirname, "html_mocks/detail.html");
  const jobList = readFileSync("mock_job_list.json", {
    encoding: "utf8",
  }).replaceAll("detail.html", `file://${mockDetailPath}`);

  writeFileSync("mock_job_list.json", jobList);

  await runJobInfo(connector.jobInfo);

  expect(
    JSON.parse(readFileSync("mock_job_list.json", { encoding: "utf8" })).length,
  ).toBe(4);
  expect(
    JSON.parse(readFileSync("mock_job_info.json", { encoding: "utf8" })).length,
  ).toBe(4);
});
