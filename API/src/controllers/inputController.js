const moongose = require('mongoose');

const Input = require('../models/input');

module.exports = {

	create: ( sectionId, element ) => {

		const section = new Section({
			_id: new mongoose.Types.ObjectId(),
			label: element.label,
			type: element.type,
			section: sectionId,
			weight: element.weight,
			options: element.options,
			maxValue: element.maxValue,
			minValue: element.minValue
		});

		form.save()
			.then( (result) => {
				res.status(200).json(response);
			})
			.catch( (err) => {
				res.status(500).json({
					error: err
				});	
			});

	},
	update: (req,res,next) => {

	},
	delete: (req,res,next) => {

	}

};