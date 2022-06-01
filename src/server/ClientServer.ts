import express = require("express");
import * as path from "path";
import { IServerChild, Server } from "./Server";
import { DBAuth } from "../types/Auth";


export default class ClientServer extends Server implements IServerChild{
  constructor(domain: Array<string>, port: number, db?: DBAuth) {
    super(domain, port, db ? db : undefined);

    this.useClientRoutes = true;
    this.useAPIroutes = false;
  }

  private _setUpCustomRoutes() {
    console.log(__dirname+ "/server/static")
    this.app.use(express.static(path.join(__dirname, "static")));
  }

  public start() {
      this.setUpDomainRedirectorMiddleware();
      this.setUpCORSPolicyMiddleware();
      this.setUpSessionWithPassportMiddleware();
      this._setUpCustomRoutes();
      this.optimalizeForSEO();
      this.setUpErroPagesrMiddleware();
      this.startWebServer();
  }
}
