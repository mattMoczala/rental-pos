"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Server_1=require("./Server"),backend=new Server_1.Server(["api.moczaladev.pl"],8080,{hostname:"localhost:27017",auth:{dbName:"relax",user:"admin",pass:"admin",useNewUrlParser:!1}}),frontend=new Server_1.Server(["moczaladev.pl"],443);backend.startWebServer(),frontend.startWebServer();