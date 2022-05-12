import * as mongoose from "mongoose";

const item = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  unitsTotal: { type: Number, required: true },
  unitsAviable: { type: Number, required: true },
  createdOn: { type: Date, required: true, default: Date.now() },
});

export default mongoose.model("Item", item);
