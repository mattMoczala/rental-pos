"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Server_1=require("./Server"),app=new Server_1.Server("localhost:27017",{dbName:"relax",user:"admin",pass:"admin",useNewUrlParser:!1});app.startWebServer();