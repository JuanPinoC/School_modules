const mongoose = require('mongoose');

const CollectionRulesSchema = new Schema({ 
					action: { type: String, required: true },
					route: { type: String, required: true }
				});

const userTypeSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	rules:  [ CollectionRulesSchema ]
});

module.exports = mongoose.model('UserType', userTypeSchema, 'userTypes');