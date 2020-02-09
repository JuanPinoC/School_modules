const mongoose = require('mongoose');

const Record = require('../models/record');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	show: (req,res,next) => {

	},
	create: (req,res,next) => {

		let items = req.body.items.map( (item) => {
			return {
				input: item.input,
				stringValue: item.value,
				numberValue: 0
			}
		});

		const form = new Record({
			_id: new mongoose.Types.ObjectId(),
			evaluator: req.userData._id,
			evaluated: req.body.evaluated,
			form:	req.body.form,
			items: items,
			Completed: { type: Boolean, required: true}
		});

		form.save()
			.then( (result) => {

				res.status(201).json({
					message: 'Created Succesfully',
					createdObj: result
				});

			})
			.catch( err => errorHandler(res, err) );

	},
	find: (req,res,next) => {

	},
	update: (req,res,next) => {
		
	},
	delete: (req,res,next) => {

	}

};