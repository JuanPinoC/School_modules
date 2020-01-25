const mongoose = require('mongoose');

const FormTypes = ['Soft Abilities','Hard Abilities','Interview'];

const formSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	type:	{ type: [ mongoose.Schema.Types.ObjectId ], enum: FormTypes, required: true },
	weight: { type: Number, required: true }
});

module.exports = mongoose.model('Form', formSchema, 'forms');