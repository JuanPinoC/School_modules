const mongoose = require('mongoose');

const SectionActions = ['sum','avg','text'];

const sectionSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	form:	{ type: [ mongoose.Schema.Types.ObjectId ], ref: 'Form', required: true },
	action:	{ type: String, enum: 'SectionActions', required: true },
	weight: { type: Number, required: true }
});

module.exports = mongoose.model('Section', sectionSchema, 'sections');