"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.logAction=exports.filename=void 0;var SimpleNodeLogger=require("simple-node-logger"),opts=(exports.filename="default.log",{logFilePath:"logs/".concat(exports.filename),timestampFormat:"DD-MM-YYYY HH:mm:ss"}),log=SimpleNodeLogger.createSimpleLogger(opts);function logAction(o,e){"info"===e?log.info(o):log.error(o)}log.info("----------- relax -----------"),log.info("Log file: /logs/".concat(exports.filename)),exports.logAction=logAction;