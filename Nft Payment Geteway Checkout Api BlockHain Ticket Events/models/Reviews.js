const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewsSchema = new Schema({
  // id: [
  // 	{
  // 	  type: Schema.Types.ObjectId,
  // 	  ref: "products",
  // 	},
  // 	{ timestamps: true, versionKey: false },
  //   ],
  id: {
    type: Schema.Types.ObjectId,
    ref: 'products',
  },
  review: String,
})

module.exports = mongoose.model('reviews', ReviewsSchema)
