const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  name: { type: String, required: true, index: true, sparse: true },
  id: String,
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  image: String,
  categories: [
    {
      type: Schema.Types.ObjectId,

      ref: "categories",
    },
    { timestamps: true, versionKey: false },
  ],
  tokenId: String,
  address: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "reviews",
    },
    { timestamps: true, versionKey: false },
  ],
  createdInDB: {
    type: Boolean,
    default: true,
  },
  sold:{
    type: Boolean,
    default: false,
  },
  description: String,
  artistName: String,
  reviews: [],
});

module.exports = mongoose.model("products", ProductsSchema);
