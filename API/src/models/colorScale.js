const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
						label: { type: String, required: true },
						max: { type: Number, required: true },
						min: { type: Number, required: true },
						color: { type: String, required: true }
					});


const colorScaleSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name:	{ type: String, required: true },
	items:  [ ItemSchema ]
});

module.exports = mongoose.model('ColorScale', colorScaleSchema, 'colorScales');