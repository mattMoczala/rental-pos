import * as express from "express";
import * as https from "https";
import * as fs from "fs";
import * as cookieParser from "cookie-parser";
import * as createError from "http-errors";
import * as path from "path";
import * as session from "express-session";
import { logAction, loggerMiddleware } from "./logger";
let passport = require("passport");
let bodyParser = require("body-parser");
import ConnectionConstrustor from "./db/ConnectionConstructor";
import * as index from './routes/index';
import * as rent from './routes/api/rent';
import * as client from './routes/api/client';
import * as item from './routes/api/item';
import {DBAuth, Auth} from "./types/Auth";
import TypedRequestBody from "./types/RequestType";


export class Server {
  private app: express.Application = express();
  private server: https.Server;
  private port: number;
  private dbConnection: ConnectionConstrustor;
  private dbAuth: Auth; 
  private dbHostname: string;
  private servableDomainList: Array<string>;
  private useClientRoutes: boolean;
  private useAPIroutes: boolean;

  constructor(domain:Array<string>, port: number, db?: DBAuth) {
    this.servableDomainList = domain;
    this.port = port
    
    if (db) {
      this.dbHostname = db.hostname;
      this.dbAuth = db.auth;
      this.dbAuth.useNewUrlParser = true;
      this.dbConnection = new ConnectionConstrustor(this.dbAuth, this.dbHostname);
      this.useClientRoutes = false;
      this.useAPIroutes = true;
    } else {
      this.useClientRoutes = true;
      this.useAPIroutes = false;
    }
    
  }

  private _setUpExpressConfig() {
    // this.app.set("view engine", "pug");
    // this.app.set("views", path.join(__dirname + "/views"));

    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction)=> {
      if (!this.servableDomainList.includes(req.hostname)) {
        logAction(`${req.method} ${req.hostname}${req.originalUrl} user requested unserved domain`,"error")
        res.send(`<div style="margin-left:auto;margin-right:auto"><b>404</b></div>`);
      } else {
        next();
      }
    })

    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(loggerMiddleware);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    // Handle sessions
    this.app.use(
      session({
        secret: "sessionSecret",
        cookie: { maxAge: 15 * 60 * 60 * 1000 }, // session timeout set to 15 hours
        saveUninitialized: true,
        resave: true,
      })
    );

    // Passport middleware
    this.app.use(express.json());
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.app.use(require("connect-flash")());

    if (this.useClientRoutes) {
      this.app.use(express.static(path.join(__dirname, "static")));
    } if (this.useAPIroutes) {
    this.app.use("/", index.router);
    this.app.use("/client", client.router);
    this.app.use("/rent", rent.router);
    this.app.use("/item", item.router);
    }

    this.app.use("/robots.txt", function (req: TypedRequestBody<null>, res: express.Response, next: express.NextFunction) {
      res.type("text/plain");
      res.send("User-agent: *\nDisallow: /img");
    });

    this.app.use(function (req: TypedRequestBody<null>, res: express.Response, next: express.NextFunction) {
      next(createError(404));
    });

    this.app.use(function (err: any, req: TypedRequestBody<null>, res: express.Response, next: express.NextFunction) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = err;

      // render the error page
      res.status(err.status || 500);
      res.send(`<div style="margin-left:auto;margin-right:auto;width:40px"><b>${err.status || 500}</b></div>`);
    });

  }

  public startWebServer() {
    
    this._setUpExpressConfig();

    this.server = https.createServer(
      {
        cert: fs.readFileSync(__dirname + "/keys/https/certificate.pem"),
        key: fs.readFileSync(__dirname + "/keys/https/key.pem"),
      },
      this.app
    );

    this.server.listen(this.port, () => {
      logAction(`server started on ${this.servableDomainList}:${this.port}...`, "info");
    });
  }
}
