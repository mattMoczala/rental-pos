import * as SimpleNodeLogger from "simple-node-logger";

export let filename = "default.log";

const opts = {
  logFilePath: `logs/${filename}`,
  timestampFormat: "DD-MM-YYYY HH:mm:ss",
};
const log = SimpleNodeLogger.createSimpleLogger(opts);

log.info(`----------- relax -----------`);
log.info(`Log file: /logs/${filename}`);

export function logAction(message: string, level: "info" | "error") {
  if (level === "info") {
    log.info(message);
  } else {
    log.error(message);
  }
}
