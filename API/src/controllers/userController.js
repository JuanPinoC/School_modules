const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const EvaluationPlanController = require('../controllers/evaluationPlanController');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {

		User.find()
			.select('email name type')
			.populate('type','name')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
							_id: doc._id,
							email: doc.email,
							name: doc.name,
							type: doc.type,
						}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	},
	create: (req,res,next) => {

		User.find({ email: req.body.email })
			.exec()
			.then(user => {
				if( user.length >= 1) {
					return res.status(409).json({
						message: 'Mail exists'
					});
				}
				else{
					bcrypt.hash(req.body.password, 10, (err, hash) => {
						if( err ) {
							return res.status(500).json({
								error: err
							});
						}
						else{
							const user = new User({
								_id: new mongoose.Types.ObjectId(),
								name: req.body.name,
								type: req.body.type,
								email: req.body.email,
								password: hash
							});

							user.save()
								.then( result => {
									res.status(201).json({
										message: 'Succesfully created',
										createdUser: {
											_id: result._id,
											email: result.email,
											password: result.password
										}
									});
								})
								.catch( err => errorHandler(res, err) );
						}
					})
				}
			});
			
	},
	
	find: (req,res,next) => {

		const id = req.query.id;

		User.findById(id)
			.select('email name type')
			.populate('type','_id name')
			.exec()
			.then(doc => {
				console.log( doc );
				if (doc) {
					res.status(200).json( doc );
				}else{
					res.status(404).json({message:'No valid entry found for provided ID'});
				}
			})
			.catch( err => errorHandler(res, err) );

	},
	update: (req,res,next) => {

		if( req.body.password !== null && req.body.password !== '' ){

			bcrypt.hash(req.body.password, 10, (err, hash) => {

				if( err ) {
					return res.status(500).json({
						error: err
					});
				}
				else{

					const filter = { _id: req.body.id };

					const update = {
						name: req.body.name,
						type: req.body.type,
						email: req.body.email,
						password: hash
					};

					User.findOneAndUpdate(filter, update, { new: true })
						.then( (doc) => {
							
							const response = {
											_id: doc._id,
											name: doc.name,
											type: doc.type,
											email: doc.email
										};

							res.status(200).json({
								message: 'User updated.'
							});

						})
						.catch( err => errorHandler(res, err) );

				}

			});

		}else{

			const filter = { _id: req.body.id };

			const update = {
				name: req.body.name,
				type: req.body.type,
				email: req.body.email
			};

			User.findOneAndUpdate(filter, update, { new: true })
				.then( (doc) => {
					
					const response = {
									_id: doc._id,
									name: doc.name,
									type: doc.type,
									email: doc.email
								};

					res.status(200).json({
						message: 'User updated.'
					});

				})
				.catch( err => errorHandler(res, err) );

		}

	},
	delete: (req,res,next) => {

		const id = req.query.id;
			
		User.findById(id)
			.select('_id')
			.exec()
			.then(doc =>{
				if (!doc) {
					return res.status(404).json({
						message: "User not found"
					});
				}else{
					User.deleteOne({_id: id})
						.exec()
						.then(result => {
							res.status(200).json({
								message: 'User deleted',
							});
						})
						.catch( err => errorHandler(res, err) );		
				}
			})
			.catch( err => errorHandler(res, err) );

	},
	login: (req,res,next) => {

		User.findOne( { email: req.body.email } )
			.populate('type')
			.exec()
			.then( user => {

				if (typeof user !== 'undefined') {

					bcrypt.compare(req.body.password, user.password, (err, result) => {

						if (err) {
							return res.status(401).json({
								message: 'Auth failed'
							});
						}
						else if (result) {
							const token = jwt.sign(
							{
								_id: user._id,
								email: user.email,
								type: user.type._id
							},
							//process.env.JWT_KEY,
							'secret',
							{
								expiresIn: "1h"
							}
							);
							return res.status(200).json({
								message: 'Auth succesful',
								token: token,
								name: user.name,
								email: user.email,
								type: user.type.name
							});
						}

					});
					
				}

			})
			.catch( err => errorHandler(res, err) );
	
	},

	userPlanForms: (req,res,next) => {

		let itemPromise = new Promise(( resolve, reject ) => {
											EvaluationPlanController.findByUserType( req.query.id, resolve, reject );
										});

		return itemPromise.then( ( result ) => {

								return res.status(200).json( result );

							}).catch( err => errorHandler(res, err) );

	},

	isEvaluatedUser: (req,res,next) => {

		try{

			const evaluatedUserId = req.query.id + '';
			const signedUserId = req.userData._id + '';

			return res.status(200).json( { isEvaluatedUser: evaluatedUserId === signedUserId } );

		}catch( err ){
			errorHandler(res, err);
		}

	}

};