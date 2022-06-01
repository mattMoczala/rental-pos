import * as SimpleNodeLogger from "simple-node-logger";
import * as express from 'express';

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

export function loggerMiddleware(req: express.Request, res: express.Response, next: express.NextFunction){
  res.on('finish', ()=>{
    const message = `[${req.subdomains} client ${req.ip}] | ${req.method} ${req.originalUrl} ${res.statusCode}`;
    (res.statusCode >= 400) ? log.error(message) : log.info(message);
  })

  next();
}