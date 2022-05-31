import * as express from "express";
import ItemModel from "../../models/item";
import Item from "../../types/Item";
import mongoose from "mongoose";
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
    await ItemModel
      .find()
      .exec(
        (
          err: mongoose.MongooseError,
          items: Array<Item>
        ) => {
          if (err) {
            console.log(err);

            const response = {
              status: "err",
              data: {
                message: `Server error occured.`,
              },
            };
            console.log(err)
            res.set({ "content-type": "application/json" });
            res.send(JSON.stringify(response));
          } else {
            const response = {
              status: "succ",
              data: items,
            };
            res.status(200);
            // res.set({ "content-type": "application/json" });
            res.send(JSON.stringify(response));
          }
        }
      );
  }
);

router.post(
  "/",
  async function (
    req: TypedRequestBody<Item>,
    res: express.Response,
    next: express.NextFunction
  ) {
    const data = new ItemModel({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      unitsAviable: req.body.unitsAviable,
      unitsTotal: req.body.unitsTotal
    });

    data.save().then((savedData: typeof data) => {
      let response = {
        status: "succ",
        data: {
          message: `Succesfully created item.`,
          data: savedData,
        },
      };
      res.status(201);
      logAction(response.data.message,"info");
      res.set({ "content-type": "application/json" });
      res.send(JSON.stringify(response));
    });
  }
);