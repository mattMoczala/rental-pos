import * as mongoose from "mongoose";
import Client from "../../../types/Client";


const ClientModel = new mongoose.Schema({
  name: { type: String, required: false },
  surname: { type: String, required: false },
  nip: { type: String, required: false, default: "" },
  phoneNumber: { type: String, required: false, default: "" },
  pesel: { type: String, required: false, default: "" },
  createdOn: { type: Date, required: true, default: Date.now() },
});

export default mongoose.model<Client>("Client", ClientModel);
