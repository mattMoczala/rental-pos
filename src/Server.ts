import * as express from "express";
import * as https from "https";
import * as fs from "fs";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as createError from "http-errors";
import * as path from "path";
import * as vhost from "vhost";
import * as session from "express-session";
import { logAction } from "./logger";
let passport = require("passport");
let bodyParser = require("body-parser");
import ConnectionConstrustor from "./db/ConnectionConstructor";
import * as index from './routes/index';
import * as rent from './routes/rent';
import * as client from './routes/client';
import * as item from './routes/item';
import Auth from "./types/Auth";
import TypedRequestBody from "./types/RequestType";


export class Server {
  private app: express.Application = express();
  private server: https.Server;
  private port = process.env.PORT || 443;
  private dbConnection: ConnectionConstrustor;
  private dbAuth: Auth; 
  private dbHostname: string;
  private servableDomainList: Array<string>;

  constructor(dbHostname:string, auth: Auth, domain:Array<string>) {
    this.dbHostname = dbHostname;
    this.dbAuth = auth;
    this.dbAuth.useNewUrlParser = true;
    this.servableDomainList = domain;
    
    this.dbConnection = new ConnectionConstrustor(this.dbAuth, this.dbHostname);
  }

  private _setUpExpressConfig() {
    // this.app.set("view engine", "pug");
    // this.app.set("views", path.join(__dirname + "/views"));

    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction)=> {
      if (!this.servableDomainList.includes(req.headers.host)) {
        logAction(`${req.method} ${req.headers.host}${req.originalUrl} user requested unserved domain`,"error")
        res.send(`<div style="margin-left:auto;margin-right:auto"><b>404</b></div>`);
      } else {
        next();
      }
    })

    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(logger("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "static")));

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

    // const indexRouter = require("./routes/index");
    this.app.use("/", index.router);
    this.app.use("/client", client.router);
    this.app.use("/rent", rent.router);
    this.app.use("/item", item.router);
    // this.app.use(subdomain('api', index.router));

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