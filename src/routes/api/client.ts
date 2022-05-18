import * as express from "express";
import ClientModel from "../../models/client";
import Client from "../../types/Client";
import mongoose, { Mongoose } from "mongoose";
import TypedRequestBody from "../../types/RequestType";
import { logAction } from "../../logger";

export const router = express.Router();

router.get(
  "/",
  async function (
    req: TypedRequestBody<null>,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      await ClientModel.find().exec(
        (err: mongoose.MongooseError, clients: Array<Client>) => {
          if (err) {
            console.log(err);

            const response = {
              status: "err",
              data: {
                message: `Server error occured.`,
              },
            };
            res.status(500);
            res.set({ "content-type": "application/json" });
            res.send(JSON.stringify(response));
          } else {
            const response = {
              status: "succ",
              data: clients,
            };
            res.status(200);
            res.set({ "content-type": "application/json" });
            res.send(JSON.stringify(response));
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/",
  async function (
    req: TypedRequestBody<Client>,
    res: express.Response,
    next: express.NextFunction
  ) {
    const data = new ClientModel({
      name: req.body.name,
      surname: req.body.surname,
      pesel: req.body.pesel,
      nip: req.body.nip,
      phoneNumber: req.body.phoneNumber,
    });

    data.save().then((savedData: typeof data) => {
      let response = {
        status: "succ",
        data: {
          message: `Succesfully created client.`,
          data: savedData,
        },
      };
      logAction(response.data.message,"info");
      res.status(201);
      res.set({ "content-type": "application/json" });
      res.send(JSON.stringify(response));
    });
  }
);

router.delete(
  "/",
  async function (
    req: TypedRequestBody<Client>,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.query.id.toString().match(/^[0-9a-fA-F]{24}$/)) {
    ClientModel.findByIdAndDelete(
      req.query.id,
      (err: typeof mongoose.Error) => {
        if (err) {
          let response = {
            status: "err",
            data: {
              message: `An server error occured while deleting client ${req.query.id}.`,
            },
          };
          res.status(500);
          res.set({ "content-type": "application/json" });
          res.send(JSON.stringify(response));
          logAction(response.data.message, "error");
        } else {
          let response = {
            status: "succ",
            data: {
              message: `Deleted client with id ${req.query.id}.`,
            },
          };
          res.status(200);
          res.set({ "content-type": "application/json" });
          res.send(JSON.stringify(response));
          logAction(response.data.message, "info");
        }
      }
    );
  } else {
    let response = {
      status: "err",
      data: {
        message: `not valid object id: "${req.query.id}".`,
      },
    };
    res.status(400);
    res.set({ "content-type": "application/json" });
    res.send(JSON.stringify(response));
    logAction(response.data.message, "error");
  }
}
);
