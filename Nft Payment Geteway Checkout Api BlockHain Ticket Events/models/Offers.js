
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const OffersSchema = new Schema({
	name: String,
	oldPrice: Number,
	price: Number,
	product:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'products',
		},
        initialDate: String,
       expirationDate: String,

});
OffersSchema.plugin(findOrCreate);

module.exports = mongoose.model('offers', OffersSchema);