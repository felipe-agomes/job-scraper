import type { Page } from "playwright";
import type { ConnectorPagination } from "../connectors/types";
import { executeStep, getLocator, executeAction } from "./engine";

async function extractAllPages(
  page: Page,
  pagination: ConnectorPagination,
): Promise<string[]> {
  const { extractStep, startPage, nextPageStep } = pagination;
  let currentPage = startPage;
  const allLinks: string[] = [];

  while (true) {
    const stepResult = await executeStep(page, extractStep);
    if (stepResult) allLinks.push(...stepResult);

    currentPage++;
    const nextStepString = JSON.stringify(nextPageStep).replaceAll(
      "{{next_page}}",
      `${currentPage}`,
    );
    const nextStep = JSON.parse(nextStepString);

    const locator = getLocator(page, nextStep.locator);
    if ((await locator.count()) === 0) break;

    await executeAction(locator, nextStep.action);
  }

  return allLinks;
}

export { extractAllPages };
