import * as express from "express";
import rental from "../models/rental";
import mongoose from "mongoose";
import TypedRequestBody from "../types/RequestType";
import { RentalNotPopulated, RentalPopulatedWithData } from "../types/Rental";

export const router = express.Router();

router.get(
  "/",
  async function (
    req: TypedRequestBody<null>,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.query.getOnlyOngoing) {
        await rental
        .find({ongoing: true})
        .populate("client")
        .populate("rented")
        .exec(
          (
            err: mongoose.MongooseError,
            rentals: Array<RentalPopulatedWithData>
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
              res.set({ "content-type": "application/json charset=utf-8" });
              res.send(JSON.stringify(response));
            } else {
              const response = {
                status: "succ",
                data: rental,
              };
              res.status(200);
              res.set({ "content-type": "application/json charset=utf-8" });
              res.send(JSON.stringify(response));
            }
          }
        );
    } else {
      await rental
        .find()
        .populate("client")
        .populate("rented")
        .exec(
          (
            err: mongoose.MongooseError,
            rentals: Array<RentalPopulatedWithData>
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
              res.set({ "content-type": "application/json charset=utf-8" });
              res.send(JSON.stringify(response));
            } else {
              const response = {
                status: "succ",
                data: rentals,
              };
              res.status(200);
              res.set({ "content-type": "application/json charset=utf-8" });
              res.send(JSON.stringify(response));
            }
          }
        );
    }
  }
);

router.post(
  "/",
  async function (
    req: TypedRequestBody<RentalNotPopulated>,
    res: express.Response,
    next: express.NextFunction
  ) {
    const data = new rental({
      priceTotal: req.body.priceTotal,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      ongoing: true,
      rented: req.body.rented,
      client: req.body.client,
    });

    data.save().then((savedData: typeof data) => {
      let response = {
        status: "succ",
        data: {
          message: `Succesfully rented item.`,
          data: savedData,
        },
      };
      res.status(201);
      res.set({ "contnet-type": "application/json charset=utf-8" });
      res.send(JSON.stringify(response));
    });
  }
);
