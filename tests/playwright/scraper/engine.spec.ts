import { test, expect } from "@playwright/test";
import {
  getLocator,
  executeAction,
  executeStep,
  executeSteps,
} from "../../../src/scraper/engine";
import type {
  ConnectorLocator,
  ConnectorActions,
  ConnectorStep,
} from "../../../src/connectors/types";

// HTML local que replica os elementos usados nos testes originais
const MOCK_HTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Engine Mock</title></head>
<body>
  <iframe id="ifrmCookieBanner" srcdoc="<body><button>Decline</button></body>"></iframe>

  <label for="text-input">Text input</label>
  <input id="text-input" type="text" placeholder="Encontre a oportunidade que está procurando" />

  <label for="readonly-input">Readonly input</label>
  <input id="readonly-input" type="text" value="Readonly input" readonly />

  <button id="submit-btn" onclick="globalThis.__submitted = true; document.title = 'submitted'">Submit</button>
</body>
</html>
`;

test.beforeEach(async ({ page }) => {
  await page.setContent(MOCK_HTML);
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
  const locatorFill = page.getByRole("textbox", { name: "Text input" });
  const locatorGetValue = page.getByRole("textbox", { name: "Text input" });
  const locatorAttribute = page.getByRole("textbox", {
    name: "Readonly input",
  });
  const locatorClick = page.getByRole("button", { name: "Submit" });

  const actionFill: ConnectorActions = { type: "fill", value: "Teste" };
  const actionGetValue: ConnectorActions = { type: "get_value" };
  const actionAttribute: ConnectorActions = {
    type: "attribute",
    value: "value",
  };
  const actionClick: ConnectorActions = { type: "click" };

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

  // Verifica que o clique foi executado pela mudança no estado da página
  const submitted = await page.evaluate(() => (globalThis as any).__submitted);
  expect(submitted).toBe(true);
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

  const submitted = await page.evaluate(() => (globalThis as any).__submitted);
  expect(submitted).toBe(true);
});

test("should execute all steps and return accumulated value", async ({
  page,
}) => {
  const steps: ConnectorStep[] = [
    {
      name: "Test Fill 1",
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
      name: "get input value 1",
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
      name: "Test Fill 2",
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
      name: "get input value 2",
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
      name: "Click submit",
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
