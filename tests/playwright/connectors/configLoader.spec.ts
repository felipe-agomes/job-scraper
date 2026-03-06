import { test, expect } from "@playwright/test";
import {
  loadConnectorConfig,
  loadFindJobConfig,
  loadSingleConnectorConfig,
} from "../../../src/connectors/configLoader";

test("should bring all connectors config", () => {
  const findJob = loadFindJobConfig("tests/playwright/find_job.json");
  const configs = loadConnectorConfig("./tests/playwright/connectors", findJob);

  expect(configs.length).toBe(1);
});

test("should bring one connector config", () => {
  const config = loadSingleConnectorConfig(
    "./tests/playwright/connectors/example.yml",
  );

  expect(config.id).toBe("example");
});

test("should bring one jobConfig", () => {
  const config = loadFindJobConfig("tests/playwright/find_job.json");

  expect(config.length).toBe(1);
});
