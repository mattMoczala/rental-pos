import * as express from "express";
import ItemModel from "../models/item";
import Item from "../types/Item";
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
            res.status(500);
            res.set({ "content-type": "application/json" });
            res.send(JSON.stringify(response));
          } else {
            const response = {
              status: "succ",
              data: items,
            };
            res.status(200);
            res.set({ "content-type": "application/json" });
            res.send(JSON.stringify(response));
          }
        }
      );
  }
);
