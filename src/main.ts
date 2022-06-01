import APIServer from "./server/APIServer";
import ClientServer from "./server/ClientServer";


const backend = new APIServer(["api.moczaladev.pl"], 8080, {
    hostname: "localhost:27017",
    auth: {
        dbName: "relax",
        user: "admin",
        pass: "admin",
        useNewUrlParser: false
    }
});

const frontend = new ClientServer(["moczaladev.pl"], 7070);

backend.start();
frontend.start();

