const moongose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
	list: (req,res,next) => {

		User.find()
			.select('email name type')
			.populate('type','name')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					users: docs.map( doc => {
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
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error:err
				});
			});

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
								_id; new mongoose.Types.ObjectId(),
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
								.catch( err => {
									console.log(err);
									res.status(500).json({
										error: err
									});
								});
						}
					})
				}
			});
	},
	
	find: (req,res,next) => {

	},
	update: (req,res,next) => {

	},
	delete: (req,res,next) => {
	
	},
	login: (req,res,next) => {
	
	},
	headers: (req,res,next) => {
	
	}
}