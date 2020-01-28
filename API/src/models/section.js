const mongoose = require('mongoose');

const SectionTypes = ['sum','avg','text'];

const sectionSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	form:	{ type: [ mongoose.Schema.Types.ObjectId ], ref: 'Form', required: true },
	type:	{ type: [ mongoose.Schema.Types.ObjectId ], enum: 'SectionTypes', required: true },
	weight: { type: Number, required: true }
});

module.exports = mongoose.model('Section', sectionSchema, 'sections');