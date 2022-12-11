const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Purchase", roleSchema);