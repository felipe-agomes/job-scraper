import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import type { Connector, FindJob } from "./types";

function loadConnectorConfig(
  basePath: string,
  findJobs: FindJob[],
): Connector[] {
  const findJobsId = findJobs.map((job) => job.id);

  const configs = readdirSync(basePath).filter((conf) => conf.endsWith(".yml"));

  const connectors = configs
    .map(
      (conf) =>
        parse(
          readFileSync(join(basePath, conf), { encoding: "utf8" }),
        ) as Connector,
    )
    .filter((conn) => findJobsId.includes(conn.id));

  return connectors;
}

function loadSingleConnectorConfig(path: string): Connector {
  return parse(readFileSync(path, { encoding: "utf8" }));
}

function loadFindJobConfig(path: string = "find_job.json"): FindJob[] {
  return JSON.parse(readFileSync(path, { encoding: "utf8" }));
}

export { loadConnectorConfig, loadSingleConnectorConfig, loadFindJobConfig };
