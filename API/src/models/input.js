const mongoose = require('mongoose');

const OptionSchema = mongoose.Schema({
						label: { type: String, required: true },
						stringValue: { type: String, required: false },
						numberValue: { type: Number, required: false }
					});

const InputTypes = ['Number','Text','Number Options','Text Options'];

const inputSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	label:	{ type: String, required: true },
	type:	{ type: String, enum: InputTypes, required: true },
	section:	{ type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
	weight: { type: Number , required: false },
	options: [ OptionSchema ],
	maxValue: { type: Number , required: false },
	minValue: { type: Number , required: false },
	evaluatedUserField: { type: Boolean, required: true}, //que usuario deberia llenarlo
	order: { type: Number, required: true }
});

module.exports = mongoose.model('Input', inputSchema, 'inputs');