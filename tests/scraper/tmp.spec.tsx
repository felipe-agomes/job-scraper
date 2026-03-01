import { parse } from "yaml";
import { readdirSync, readFileSync } from "fs";
import test, { expect, type Locator, type Page } from "playwright/test";
import type {
  Connector,
  ConnectorActions,
  ConnectorLocator,
  ConnectorStrategies,
} from "../connectors/types";
import { join } from "path";

function loadConnectorConfig(basePath: string): Connector[] {
  const configs = readdirSync(basePath).filter((conf) => conf.endsWith(".yml"));

  return configs.map((conf) =>
    parse(readFileSync(join(basePath, conf), { encoding: "utf8" })),
  );
}

function getLocator(page: Page, locator: ConnectorLocator): Locator {
  const strategyMap: Record<ConnectorStrategies, () => Locator> = {
    css: () => {
      if (!locator.value)
        throw new Error("value can not be null with strategy css");

      return page.locator(locator.value);
    },
    placeholder: () => {
      if (!locator.value)
        throw new Error("value can not be null with strategy placeholder");

      return page.getByPlaceholder(locator.value);
    },
    role: () => {
      if (!locator.role || !locator.options || !locator.options.name)
        throw new Error(
          "values role, options and name can not be null with strategy role",
        );

      return page.getByRole(locator.role, { name: locator.options.name });
    },
  };

  return strategyMap[locator.strategy]();
}

async function executeAction(
  locator: Locator,
  action: ConnectorActions,
  value?: string,
) {
  const actions = {
    click: async () => {
      locator.click();
    },
    fill: async () => {
      if (!value) throw new Error("value can not be null with action fill.");

      locator.fill(value);
    },
    attribute: async () => {
      if (!value)
        throw new Error("value can not be null with action attribute.");

      locator.getAttribute(value);
    },
  };

  return await actions[action]();
}

test("should bring all connectors config", () => {
  const configs = loadConnectorConfig("./tests/connectors");

  expect(configs.length).toBe(1);
});

test("should get correct locator by strategy", ({ page }) => {
  const roleLocatorStrategy: ConnectorLocator = {
    strategy: "role",
    role: "button",
    options: {
      name: "Submit",
    },
  };
  const cssLocatorStrategy: ConnectorLocator = {
    strategy: "css",
    value: "#ifrmCookieBanner",
  };
  const placeholderLocatorStrategy: ConnectorLocator = {
    strategy: "placeholder",
    value: "Encontre a oportunidade que está procurando",
  };

  expect(getLocator(page, roleLocatorStrategy).toString()).toBe(
    "getByRole('button', { name: 'Submit' })",
  );
  expect(getLocator(page, cssLocatorStrategy).toString()).toBe(
    "locator('#ifrmCookieBanner')",
  );
  expect(getLocator(page, placeholderLocatorStrategy).toString()).toBe(
    "getByPlaceholder('Encontre a oportunidade que está procurando')",
  );
});

test("", ({ page }) => {
  executeAction();
});

export { loadConnectorConfig };
