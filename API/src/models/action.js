const mongoose = require('mongoose');

const actionSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	route:  { type: String, required: true }
});

module.exports = mongoose.model('Action', actionSchema, 'actions');