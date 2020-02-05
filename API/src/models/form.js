const mongoose = require('mongoose');

const FormTypes = ['Soft Abilities','Hard Abilities','Interview'];
const FormActions = ['sum','avg','none'];

const formSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	type:	{ type: String, enum: FormTypes, required: true },
	action: { type: String, enum: FormActions, required: true },
	description: { type: String, required: true },
	weight: { type: Number, required: true },
	colorScale: { type: mongoose.Schema.Types.ObjectId, ref: 'ColorScale', required: true }
	// fecha ( forma de limitar a un intento )
});

module.exports = mongoose.model('Form', formSchema, 'forms');