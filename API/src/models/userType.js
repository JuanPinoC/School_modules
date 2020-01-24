const mongoose = require('mongoose');

const CollectionRulesSchema = new Schema({ 
					collection: { type: String, required: true },
					createAny: { type: Boolean, required: true },
					readAny: { type: Boolean, required: true },
					updateAny: { type: Boolean, required: true },
					deleteAny: { type: Boolean, required: true },
					createOwn: { type: Boolean, required: true },
					readOwn: { type: Boolean, required: true },
					updateOwn: { type: Boolean, required: true },
					deleteOwn: { type: Boolean, required: true },
				});

const userTypeSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	rules:  [ CollectionRulesSchema ]
});

module.exports = mongoose.model('UserType', userTypeSchema, 'userTypes');