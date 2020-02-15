const mongoose = require('mongoose');

const EvaluationPlan = require('../models/evaluationPlan');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {

		EvaluationPlan.find()
			.select('_id name userType startDate endDate')
			.populate('userType','name')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
							_id: doc._id,
							name: doc.name,
							userType: doc.userType,
							startDate: doc.startDate,
							endDate: doc.endDate
						}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	},
	create: (req,res,next) => {

		const evaluationPlan = new EvaluationPlan({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			userType: req.body.userType,
			forms: req.body.forms,
			startDate: req.body.startDate,
			endDate: req.body.endDate
		});

		evaluationPlan.save()
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