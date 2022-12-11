const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const findOrCreate = require('mongoose-findorcreate');

const CategoriesSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false, // no genera el el id por default
  }
);
//CategoriesSchema.plugin(findOrCreate);

module.exports = mongoose.model("categories", CategoriesSchema);
