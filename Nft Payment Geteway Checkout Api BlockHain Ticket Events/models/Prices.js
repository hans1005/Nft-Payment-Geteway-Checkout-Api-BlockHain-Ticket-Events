
const { Schema, mongoose } = require('mongoose');

const PriceSchema = new Schema({
	currency: String,
	price: Number,
	date: String,
});

module.exports = mongoose.model('prices', PriceSchema);