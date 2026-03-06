import { expect, test } from "bun:test";
import {
  loadFindJobConfig,
  loadConnectorConfig,
} from "../../../src/connectors/configLoader";
import { connectorsPlaceholderReplace } from "../../../src/utils/replacers";

test("should return connectors with replaced placeholders", () => {
  const findJobs = loadFindJobConfig("tests/playwright/find_job.json");
  const connectors = loadConnectorConfig(
    "tests/playwright/connectors",
    findJobs,
  );

  const result = JSON.stringify(
    connectorsPlaceholderReplace(connectors, findJobs),
  );
  expect(result.includes("{{term}}")).toBe(false);
});
