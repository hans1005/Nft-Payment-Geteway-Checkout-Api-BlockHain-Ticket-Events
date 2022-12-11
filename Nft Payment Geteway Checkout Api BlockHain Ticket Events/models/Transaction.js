const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
	myAddress: String,
	transactionTo: String,
	moneyAmount: Number,
});

module.exports = mongoose.model('transactions', TransactionSchema);