const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	type:	{ type: [ mongoose.Schema.Types.ObjectId ], ref: 'UserType', required: true },
	email:	{ type: String, required: true },
	password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema, 'users');