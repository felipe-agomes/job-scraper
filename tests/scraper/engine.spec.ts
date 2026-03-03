import test, { expect } from "playwright/test";
import {
  getLocator,
  executeAction,
  executeStep,
  executeSteps,
} from "../../src/scraper/engine";
import type {
  ConnectorLocator,
  ConnectorActions,
  ConnectorStep,
} from "../../src/connectors/types";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.selenium.dev/selenium/web/web-form.html");
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
    "getByRole('button', { name: 'Submit', exact: true })",
  );
  expect(getLocator(page, cssLocatorStrategy).toString()).toBe(
    "locator('#ifrmCookieBanner')",
  );
  expect(getLocator(page, placeholderLocatorStrategy).toString()).toBe(
    "getByPlaceholder('Encontre a oportunidade que está procurando')",
  );
});

test("must correctly execute the actions of filling in the data, extracting the attribute, and clicking using the engine.", async ({
  page,
}) => {
  const locatorClick = page.getByRole("button", { name: "Submit" });
  const locatorFill = page.getByRole("textbox", { name: "Text input" });
  const locatorGetValue = page.getByRole("textbox", { name: "Text input" });
  const locatorAttribute = page.getByRole("textbox", {
    name: "Readonly input",
  });
  const actionClick: ConnectorActions = { type: "click" };
  const actionFill: ConnectorActions = { type: "fill", value: "Teste" };
  const actionGetValue: ConnectorActions = { type: "get_value" };
  const actionAttribute: ConnectorActions = {
    type: "attribute",
    value: "value",
  };

  await executeAction(locatorFill, actionFill);
  await expect(locatorFill).toHaveValue("Teste");

  expect(await executeAction(locatorGetValue, actionGetValue)).toEqual([
    "Teste",
  ]);

  const attributeResult = await executeAction(
    locatorAttribute,
    actionAttribute,
  );
  expect(attributeResult).toEqual(["Readonly input"]);

  await expect(locatorClick).toBeEnabled();
  await executeAction(locatorClick, actionClick);
  await expect(page).toHaveURL(/.*submitted-form.html/);
});

test("should execute all step", async ({ page }) => {
  const step: ConnectorStep = {
    name: "Teste step",
    action: {
      type: "click",
    },
    locator: {
      strategy: "role",
      role: "button",
      options: {
        name: "Submit",
      },
    },
  };

  await executeStep(page, step);
  await expect(page).toHaveURL(/.*submitted-form.html/);
});

test("should execute all steps and return accumulated value", async ({
  page,
}) => {
  const steps: ConnectorStep[] = [
    {
      name: "Test Fill",
      action: {
        type: "fill",
        value: "Teste 1",
      },
      locator: {
        strategy: "role",
        role: "textbox",
        options: {
          name: "Text input",
        },
      },
    },
    {
      name: "get input value",
      action: {
        type: "get_value",
      },
      locator: {
        strategy: "role",
        role: "textbox",
        options: {
          name: "Text input",
        },
      },
    },
    {
      name: "Test Fill",
      action: {
        type: "fill",
        value: "Teste 2",
      },
      locator: {
        strategy: "role",
        role: "textbox",
        options: {
          name: "Text input",
        },
      },
    },
    {
      name: "get input value",
      action: {
        type: "get_value",
      },
      locator: {
        strategy: "role",
        role: "textbox",
        options: {
          name: "Text input",
        },
      },
    },
    {
      name: "Teste step",
      action: {
        type: "click",
      },
      locator: {
        strategy: "role",
        role: "button",
        options: {
          name: "Submit",
        },
      },
    },
  ];

  const result = await executeSteps(page, steps);
  expect(result).toEqual(["Teste 1", "Teste 2"]);
});
