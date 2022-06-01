import * as index from "./routes/index"
import * as client from "./routes/api/client"
import * as rent from "./routes/api/rent"
import * as item from "./routes/api/item"
import ConnectionConstrustor from "./db/ConnectionConstructor";
import { IServerChild, Server } from "./Server";
import { DBAuth } from "../types/Auth";


export default class APIServer extends Server implements IServerChild{
  constructor(domain: Array<string>, port: number, db?: DBAuth) {
    super(domain, port, db ? db : undefined);

      this.dbHostname = db.hostname;
      this.dbAuth = db.auth;
      this.dbAuth.useNewUrlParser = true;
      this.dbConnection = new ConnectionConstrustor(this.dbAuth, this.dbHostname);
      this.useClientRoutes = false;
      this.useAPIroutes = true;
  }

  private _setUpCustomRoutes() {
    this.app.use("/", index.router);
    this.app.use("/client", client.router);
    this.app.use("/rent", rent.router);
    this.app.use("/item", item.router);
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
