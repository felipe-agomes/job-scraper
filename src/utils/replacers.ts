import type { Connector, FindJob } from "../connectors/types";

function connectorsPlaceholderReplace(
  connectors: Connector[],
  findJobs: FindJob[],
) {
  const connectorsReplaced: Connector[] = [];
  for (const connector of connectors) {
    const findJob = findJobs.find((job) => job.id === connector.id)!;

    let connectorJson = JSON.stringify(connector);

    for (const [key, value] of Object.entries(findJob)) {
      if (key !== "id") {
        connectorJson = connectorJson.replaceAll(`{{${key}}}`, value);
      }
    }

    connectorsReplaced.push(JSON.parse(connectorJson));
  }

  return connectorsReplaced;
}

export { connectorsPlaceholderReplace };
