import { Server } from "./Server";

const app = new Server("localhost:27017", {
    dbName: "relax",
    user: "admin",
    pass: "admin",
    useNewUrlParser: false
});

app.startWebServer();

