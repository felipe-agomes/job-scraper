import type { Connector, FindJob } from "../connectors/types";

function connectorsPlaceholderReplace(
  connectors: Connector[],
  findJobs: FindJob[],
) {
  const connectorsReplaced: Connector[] = [];
  for (const connector of connectors) {
    const findJob = findJobs.find((job) => job.id === connector.id)!;
    const connectorJson = JSON.stringify(connector);

    for (const [key, value] of Object.entries(findJob)) {
      if (key !== "id") {
        connectorsReplaced.push(
          JSON.parse(connectorJson.replaceAll(`{{${key}}}`, value)),
        );
      }
    }
  }

  return connectorsReplaced;
}

export { connectorsPlaceholderReplace };
