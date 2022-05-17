import { Server } from "./Server";

const backend = new Server(["api.moczaladev.pl"], 8080, {
    hostname: "localhost:27017",
    auth: {
        dbName: "relax",
        user: "admin",
        pass: "admin",
        useNewUrlParser: false
    }
});

const frontend = new Server(["moczaladev.pl"], 7070);

backend.startWebServer();
frontend.startWebServer();

