import test from "playwright/test";
import { loadConnectorConfig } from "../../src/connectors/configLoader";
import { runJobList } from "../../src/scraper/jobScraper";

test("Deve rodar o fluxo completo de raspagem e paginação", async () => {
  const connectors = loadConnectorConfig("src/connectors");
  const firstConnector = connectors[0]!;

  await runJobList(firstConnector.jobList);
});
