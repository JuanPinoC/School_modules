const mongoose = require('mongoose');

const OptionSchema = new Schema( { label: { type: String, required: true } , value: { type: Mixed, required: true } } );

const InputTypes = ['Number','Text','Number Options','Text Options'];

const inputSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	label:	{ type: String, required: true },
	type:	{ type: [ mongoose.Schema.Types.ObjectId ], enum: InputTypes, required: true },
	subform:	{ type: [ mongoose.Schema.Types.ObjectId ], ref: 'Subform', required: true },
	weight: { type: Number , required: false },
	options: [ OptionSchema ],
	maxValue: { type: Number , required: false },
	minValue: { type: Number , required: false }
});

module.exports = mongoose.model('Input', inputSchema, 'inputs');