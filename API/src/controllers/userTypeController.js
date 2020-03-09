const mongoose = require('mongoose');

const UserType = require('../models/userType');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {
		UserType.find()
			.select('_id name')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
							_id: doc._id,
							name: doc.name
						}
					})
				};

				res.status(200).json(response);
			})
			.catch( (err) => errorHandler(res,err) );
	},
	create: (req,res,next) => {

	},
	find: (req,res,next) => {

	},
	update: (req,res,next) => {

	},
	delete: (req,res,next) => {

	},
	getUserType: (req,res,next) => {

		UserType.findById( req.userData.type )
				.exec()
				.then( (doc) => {
					res.status(200).json( doc.name );			
				})
				.catch( (err) => errorHandler(res,err) );

	}

};