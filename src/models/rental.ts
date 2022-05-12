import * as mongoose from "mongoose";

const rentalItem = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
    itemRealIdentifier: {type: Number, required: false}
})

const rental = new mongoose.Schema({
  priceTotal: { type: Number, required: true },
  startDate: { type: Date, required: true},
  endDate: { type: Date, required: true},
  ongoing: {type: Boolean, required: true},
  rented: {type: [rentalItem], required: true},
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  createdOn: { type: Date, required: true, default: Date.now() },
});

export default mongoose.model("Rental", rental);
