const mongoose = require('mongoose');

const userTypeSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	actions:  [ { type: [ mongoose.Schema.Types.ObjectId ], ref: 'Action', required: true } ]
});

module.exports = mongoose.model('UserType', userTypeSchema, 'userTypes');