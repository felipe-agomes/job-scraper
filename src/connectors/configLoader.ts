import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import type { Connector } from "./types";

function loadConnectorConfig(basePath: string): Connector[] {
  const configs = readdirSync(basePath).filter((conf) => conf.endsWith(".yml"));

  return configs.map((conf) =>
    parse(readFileSync(join(basePath, conf), { encoding: "utf8" })),
  );
}

function loadSingleConnectorConfig(path: string): Connector {
  return parse(readFileSync(path, { encoding: "utf8" }));
}

export { loadConnectorConfig, loadSingleConnectorConfig };
