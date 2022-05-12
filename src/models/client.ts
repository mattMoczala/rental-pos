import * as mongoose from "mongoose";


const client = new mongoose.Schema({
  name: { type: String, required: false },
  surname: { type: String, required: false },
  nip: { type: String, required: false, default: "" },
  phoneNumber: { type: String, required: false, default: "" },
  pesel: { type: String, required: false, default: "" },
  createdOn: { type: Date, required: true, default: Date.now() },
});

export default mongoose.model("Client", client);
