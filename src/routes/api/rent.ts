import * as express from "express";
import RentalModel from "../../models/rental";
import mongoose from "mongoose";
import TypedRequestBody from "../../types/RequestType";
import { RentalNotPopulated, RentalPopulatedWithData } from "../../types/Rental";
import { logAction } from "../../logger";

export const router = express.Router();

router.get(
  "/",
  async function (
    req: TypedRequestBody<null>,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.query.getOnlyOngoing) {
      await RentalModel.find({ ongoing: true })
        .populate("client")
        .populate("rented")
        .exec(
          (err: mongoose.MongooseError, rentals: Array<RentalNotPopulated>) => {
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
                data: rentals,
              };
              res.status(200);
              res.set({ "content-type": "application/json" });
              res.send(JSON.stringify(response));
            }
          }
        );
    } else {
      await RentalModel.find()
        .populate("client")
        .populate("rented")
        .exec(
          (err: mongoose.MongooseError, rentals: Array<RentalNotPopulated>) => {
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
                data: rentals,
              };
              res.status(200);
              res.set({ "content-type": "application/json" });
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
    const data = new RentalModel({
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
          message: `Succesfully created rental to client "${req.body.client}".`,
          data: savedData,
        },
      };
      logAction(response.data.message, "info");
      res.status(201);
      res.set({ "contnet-type": "application/json" });
      res.send(JSON.stringify(response));
    });
  }
);

router.get(
  "/changeRentalStatus",
  async function (
    req: TypedRequestBody<typeof RentalModel>,
    res: express.Response,
    next: express.NextFunction
  ) {
      await RentalModel.findById(req.query.id).exec(
        (err: mongoose.MongooseError, rental: RentalNotPopulated) => {
          if (!err) {
            RentalModel.findByIdAndUpdate(req.query.id, {
              ongoing: !rental.ongoing,
            }).exec(() => {
              const response = {
                status: "succ",
                data: {
                  message: `rental "${req.query.id}" status changed.`,
                  currentStatus: !rental.ongoing,
                },
              };
              logAction(response.data.message,"info")
              res.status(200);
              res.set({ "content-type": "application/json" });
              res.send(JSON.stringify(response));
            });
          } else {
            logAction(
              `GET /rent/changeRentalStatus\tProvided parameter id, "${req.query.id}"  is invalid or does not exist in database.`,
              "error"
            );
      
            const response = {
              status: "err",
              data: {
                message: `GET /rent/changeRentalStatus\tProvided parameter id: "${req.query.id}"  is invalid or does not exist in database.`,
              },
            };
            res.status(400);
            res.set({ "content-type": "application/json" });
            res.send(JSON.stringify(response));
          }
        }
      );
  }
);