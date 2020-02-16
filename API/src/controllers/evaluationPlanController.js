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

		const id = req.query.id;

		EvaluationPlan.findById(id)
					.exec()
					.then( (doc) => {
						
						const response = {
										name: doc.name,
										userType: doc.userType,
										forms: doc.forms,
										startDate: doc.startDate,
										endDate: doc.endDate
									};

						res.status(200).json(response);

					})
					.catch( err => errorHandler(res, err) );

	},
	update: (req,res,next) => {

		const filter = { _id: req.body.id };
		const update = {
			name: req.body.name,
			userType: req.body.userType,
			forms: req.body.forms,
			startDate: req.body.startDate,
			endDate: req.body.endDate
		};

		EvaluationPlan.findOneAndUpdate(filter, update, { new: true })
					.then( (doc) => {
						
						const response = {
										_id: doc._id,
										name: doc.name,
										userType: doc.userType,
										forms: doc.forms,
										startDate: doc.startDate,
										endDate: doc.endDate
									};

						res.status(200).json(response);

					})
					.catch( err => errorHandler(res, err) );

	},
	delete: (req,res,next) => {

		EvaluationPlan.deleteOne({ _id: req.query.id })
					.then( (result) => {
						
						res.status(200).json(result);

					})
					.catch( err => errorHandler(res, err) );

	}

};