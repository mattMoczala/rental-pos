import * as express from "express";
import client from "../models/client";
import Client from "../types/Client";
import mongoose from "mongoose";
import TypedRequestBody from "../types/RequestType";

export const router = express.Router();

router.get(
  "/",
  async function (
    req: TypedRequestBody<null>,
    res: express.Response,
    next: express.NextFunction
  ) {
    try{
    await client
      .find()
      .exec(
        (
          err: mongoose.MongooseError,
          clients: Array<Client>
        ) => {
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
    } catch(error){
      console.log(error)
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
      const data = new client({
        name: req.body.name,
        surname: req.body.surname,
        pesel: req.body.pesel,
        nip: req.body.nip,
        phoneNumber: req.body.phoneNumber
      });
  
      data.save().then((savedData: typeof data) => {
        let response = {
          status: "succ",
          data: {
            message: `Succesfully created client.`,
            data: savedData,
          },
        };
        res.status(201);
        res.set({ "contnet-type": "application/json" });
        res.send(JSON.stringify(response));
      });
    }
  );
  
