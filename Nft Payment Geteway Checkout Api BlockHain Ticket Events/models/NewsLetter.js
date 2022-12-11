
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const NewsLetterSchema = new Schema({
	emails: [
		{
			type: String,
			required: true,
			validate: {
				validator: function (v) {
					return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
				},
				message: (props) => `${props.value} is not a valid email!`,
			},
		},
	],
});

module.exports = mongoose.model('newsLetter', NewsLetterSchema);