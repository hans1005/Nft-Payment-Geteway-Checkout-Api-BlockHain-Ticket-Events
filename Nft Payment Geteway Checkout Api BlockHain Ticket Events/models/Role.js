const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false, // no genera el el id por default
  }
);

module.exports = mongoose.model("Roles", roleSchema);
