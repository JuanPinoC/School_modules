const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({ 
					input: { type: mongoose.Schema.Types.ObjectId, ref: 'Input', required: true },
					answerString: { type: String, required: false },
					answerNumber: { type: Number, required: false }
				});

const recordSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	date: { type: Date, default: Date.now },
	evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	evaluated: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	form:	{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
	items: [ ItemSchema ],
	Completed: { type: Boolean, required: true}
});

module.exports = mongoose.model('Record', recordSchema, 'records');