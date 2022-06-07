import * as express from "express";
import * as https from "https";
import * as fs from "fs";
import * as cookieParser from "cookie-parser";
import * as createError from "http-errors";
import * as session from "express-session";
import { logAction, loggerMiddleware } from "./logger";
let passport = require("passport");
let bodyParser = require("body-parser");
import ConnectionConstrustor from "./db/ConnectionConstructor";
import { DBAuth, Auth } from "../types/Auth";
import TypedRequestBody from "../types/RequestType";
import * as cors from "cors";

export abstract class Server {
  protected app: express.Application = express();
  protected server: https.Server;
  protected port: number;
  protected dbConnection: ConnectionConstrustor;
  protected dbAuth: Auth;
  protected dbHostname: string;
  protected servableDomainList: Array<string>;
  protected useClientRoutes: boolean;
  protected useAPIroutes: boolean;

  constructor(domain: Array<string>, port: number, db?: DBAuth) {
    this.servableDomainList = domain;
    this.port = port;
  }

  /**
   * Sends 404 on requests with unserved domain
   */
  protected setUpDomainRedirectorMiddleware() {
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (!this.servableDomainList.includes(req.hostname)) {
          logAction(
            `${req.method} ${req.hostname}${req.originalUrl} user requested unserved domain`,
            "error"
          );
          res.send(
            `<div style="margin-left:auto;margin-right:auto"><b>404</b></div>`
          );
        } else {
          next();
        }
      }
    );
  }

  protected setUpCORSPolicyMiddleware() {
    this.app.use(cors());

    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(loggerMiddleware);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }

  protected setUpSessionWithPassportMiddleware() {
    this.app.use(
      session({
        secret: "sessionSecret",
        cookie: { maxAge: 15 * 60 * 60 * 1000 }, // session timeout set to 15 hours
        saveUninitialized: true,
        resave: true,
      })
    );

    this.app.use(express.json());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(require("connect-flash")());
  }

  protected optimalizeForSEO() {
    this.app.use(
      "/robots.txt",
      function (
        req: TypedRequestBody<null>,
        res: express.Response,
        next: express.NextFunction
      ) {
        res.type("text/plain");
        res.send("User-agent: *\nDisallow: /img");
      }
    );
  }

  protected setUpErroPagesrMiddleware() {
    this.app.use(function (
      req: TypedRequestBody<null>,
      res: express.Response,
      next: express.NextFunction
    ) {
      next(createError(404));
    });

    this.app.use(function (
      err: any,
      req: TypedRequestBody<null>,
      res: express.Response,
      next: express.NextFunction
    ) {
      res.locals.message = err.message;
      res.locals.error = err;

      res.status(err.status || 500);
      res.send(
        `<div style="margin-left:auto;margin-right:auto;width:40px"><b>${
          err.status || 500
        }</b></div>`
      );
    });
  }

  protected startWebServer() {

    this.server = https.createServer(
      {
        cert: fs.readFileSync(__dirname + "/config/keys/certificate.pem"),
        key: fs.readFileSync(__dirname + "/config/keys/key.pem"),
      },
      this.app
    );

    this.server.listen(this.port, () => {
      logAction(
        `server started on ${this.servableDomainList}:${this.port}...`,
        "info"
      );
    });
  }
}

export interface IServerChild extends Server {
  start(): void
}