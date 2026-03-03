import test from "playwright/test";
import { loadSingleConnectorConfig } from "../../src/connectors/configLoader";
import { runJobList } from "../../src/scraper/jobScraper";

test("Deve rodar o fluxo completo de raspagem e paginação", async () => {
  const connectors = loadSingleConnectorConfig("src/connectors/nexti.yml");
  const nextiConnector = connectors;

  await runJobList(nextiConnector.jobList);
});
