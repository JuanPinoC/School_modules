const mongoose = require('mongoose');

const SubformTypes = ['sum','avg','text'];

const subformSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	form:	{ type: [ mongoose.Schema.Types.ObjectId ], ref: 'Form', required: true },
	type:	{ type: [ mongoose.Schema.Types.ObjectId ], enum: 'SubformTypes', required: true }
});

module.exports = mongoose.model('Subform', subformSchema, 'subforms');