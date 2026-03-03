import type { Page, Locator, FrameLocator } from "playwright";
import type {
  ConnectorLocator,
  ConnectorStrategies,
  ConnectorActions,
  ConnectorStep,
} from "../connectors/types";

function getLocator(page: Page, locator: ConnectorLocator): Locator {
  const base: Page | FrameLocator = locator.frame
    ? page.frameLocator(locator.frame.value)
    : page;

  const strategyMap: Record<ConnectorStrategies, () => Locator> = {
    css: () => {
      if (!locator.value)
        throw new Error("value can not be null with strategy css");

      return base.locator(locator.value);
    },
    placeholder: () => {
      if (!locator.value)
        throw new Error("value can not be null with strategy placeholder");

      return base.getByPlaceholder(locator.value);
    },
    text: () => {
      if (!locator.value)
        throw new Error("value can not be null with strategy text");

      return base.getByText(locator.value, { exact: true });
    },
    role: () => {
      if (!locator.role || !locator.options || !locator.options.name)
        throw new Error(
          "values role, options and name can not be null with strategy role",
        );

      return base.getByRole(locator.role, {
        name: locator.options.name,
        exact: true,
      });
    },
  };

  return strategyMap[locator.strategy]();
}

async function executeAction(
  locator: Locator,
  action: ConnectorActions,
): Promise<string[] | void> {
  switch (action.type) {
    case "click":
      if (await locator.isVisible()) {
        await locator.click();
      }
      break;
    case "fill":
      await locator.fill(action.value);
      break;
    case "get_value":
      return await locator.evaluateAll((elements) =>
        elements.map((el) => el.value).filter(Boolean),
      );
    case "inner_text":
      return await locator.allInnerTexts();
    case "attribute":
      return await locator.evaluateAll(
        (elements, attrName) =>
          elements.map((el) => el.getAttribute(attrName)).filter(Boolean),
        action.value,
      );
  }
}

async function executeStep(page: Page, step: ConnectorStep) {
  const locator = getLocator(page, step.locator);

  return await executeAction(locator, step.action);
}

async function executeSteps(page: Page, steps: ConnectorStep[]) {
  const resultSteps: string[] = [];

  for (const step of steps) {
    const resultStep = await executeStep(page, step);

    if (resultStep) resultSteps.push(...resultStep);
  }

  return resultSteps;
}

export { getLocator, executeAction, executeStep, executeSteps };
