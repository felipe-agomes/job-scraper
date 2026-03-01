import { readFileSync } from "fs";

function tmp() {
  readFileSync("connectors/nttdata.yml");
}

export { tmp };
