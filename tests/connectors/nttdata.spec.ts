import test from "playwright/test";
import { loadSingleConnectorConfig } from "../../src/connectors/configLoader";
import { runJobScraper } from "../../src/scraper/jobScraper";

test("Deve rodar o fluxo completo de raspagem e paginação", async () => {
  const connectors = loadSingleConnectorConfig("src/connectors/nttdata.yml");
  const nextiConnector = connectors;

  await runJobScraper(nextiConnector.jobList);
});
