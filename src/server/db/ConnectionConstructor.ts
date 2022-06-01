import * as mongoose from "mongoose";
import { logAction } from "../logger";
import {Auth} from "../../types/Auth";

export default class ConnectionConstrustor {

  hostname:string;
  authInfo: Auth;

  constructor(authData: Auth, hostname:string) {
    this.authInfo = authData;
    this.hostname = hostname;
    this._connect();
  }

  public renew() {
    this.close();
    this._connect();
  }

  public close() {
    mongoose.disconnect(() => {
      logAction(`Disconnected from database.`, "info");
    });
  }

  private _connect() {
    mongoose
      .connect(`mongodb://${this.hostname}`, this.authInfo)
      .then(() => {
        let dbName = this.authInfo.dbName;
        let user = this.authInfo.user;
        logAction(`Connected to mongoDB ${dbName}, as user ${user}`, "info");
      })
      .catch((err) => {
        logAction(`DB connection error`, "error");
        console.log(err);
        process.exit(1);
      });
  }
}
