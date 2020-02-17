const mongoose = require('mongoose');

const Input = require('../models/input');

module.exports = {

	create: ( sectionId, order, element, resolve, reject ) => {

		const input = new Input({
			_id: new mongoose.Types.ObjectId(),
			label: element.label,
			type: element.type,
			section: sectionId,
			options: element.options,
			maxValue: element.maxValue,
			minValue: element.minValue,
			evaluatedUserField: element.minValue,
			order: order
		});

		input.save()
			.then( (result) => {
				resolve();
			})
			.catch( (err) => {
				reject();
			});

	},
	update: (req,res,next) => {

	},
	delete: ( sectionId, resolve, reject ) => {

		Input.deleteMany({ section: sectionId })
				.then( (result) => {
					resolve();
				})
				.catch( (err) => {
					reject();
				});

	}

};