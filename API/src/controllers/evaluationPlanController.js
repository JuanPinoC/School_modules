const mongoose = require('mongoose');

const EvaluationPlan = require('../models/evaluationPlan');

const FormEditorController = require('../controllers/formEditorController');

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

	},

	findByUserType: ( userType , resolve, reject ) => {

		EvaluationPlan.find({ userType: userType })
			.select('_id name userType startDate endDate forms')
			.populate('userType','name')
			.exec()
			.then( (plans) => {

				const recordsPromise = plans.map( (plan) => {

					const formIds = plan.forms.map( (e) => {
						return e.form;
					});

					let itemPromise = new Promise( ( resolve, reject ) => {
											FormEditorController.findByIdArray( formIds, resolve, reject );
										});

					return itemPromise.then( ( formsArray ) => { 

								let forms = plan.forms.map( (form) => {

									const id = formsArray.findIndex( (e) => e._id + '' === form.form + '' );

									return {
										_id: form._id,
										form: form.form,
										weight: form.weight,
										requiredAmount: form.requiredAmount,
										name: formsArray[ id ].name,
										type: formsArray[ id ].type
									};

								});

								return {	
									_id: plan._id,
									name: plan.name, 
									userType: plan.userType,
									startDate: plan.startDate,
									endDate: plan.endDate, 
									forms: forms
								};


							}).catch( (err) => {
								reject(err);
							});

				});

				Promise.all(recordsPromise).then( arrayOfResponses => {

					if( arrayOfResponses.every( (e) => e._id !== null ) ){
						resolve(arrayOfResponses);
					}else{
						reject('Error');
					}

				}).catch( err => reject(err) );
				
			})
			.catch( (err) => reject(err) );

	},

	getPlansAndForms: ( req, res, next ) => {

		EvaluationPlan.find()
			.select('_id name userType startDate endDate forms')
			.populate('userType','name')
			.exec()
			.then( (plans) => {

				const recordsPromise = plans.map( (plan) => {

					const formIds = plan.forms.map( (e) => {
						return e.form;
					});

					let itemPromise = new Promise( ( resolve, reject ) => {
											FormEditorController.findByIdArray( formIds, resolve, reject );
										});

					return itemPromise.then( ( formsArray ) => { 

								let forms = plan.forms.map( (form) => {

									const id = formsArray.findIndex( (e) => e._id + '' === form.form + '' );

									return {
										_id: form._id,
										form: form.form,
										weight: form.weight,
										requiredAmount: form.requiredAmount,
										name: formsArray[ id ].name,
										type: formsArray[ id ].type
									};

								});

								return {	
									_id: plan._id,
									name: plan.name, 
									userType: plan.userType,
									startDate: plan.startDate,
									endDate: plan.endDate, 
									forms: forms
								};


							}).catch( err => errorHandler(res, err) );

				});

				Promise.all(recordsPromise).then( arrayOfResponses => {

					if( arrayOfResponses.every( (e) => e._id !== null ) ){
						res.status(200).json(arrayOfResponses);
					}else{
						errorHandler(res, 'Error at arrayOfResponses.')
					}

				}).catch( err => errorHandler(res, err) );
				
			}).catch( err => errorHandler(res, err) );

	}

};