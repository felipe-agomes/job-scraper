import test, { expect } from "playwright/test";
import { loadConnectorConfig } from "../../src/connectors/configLoader";

test("should bring all connectors config", () => {
  const configs = loadConnectorConfig("./tests/connectors");

  expect(configs.length).toBe(1);
});
