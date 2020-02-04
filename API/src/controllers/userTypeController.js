const moongose = require('mongoose');

const UserType = require('../models/userType');

module.exports = {

	list: (req,res,next) => {
		UserType.find()
			.select('_id name')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					types: docs.map( doc => {
						return {
							_id: doc._id,
							name: doc.name
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

	},
	find: (req,res,next) => {

	},
	update: (req,res,next) => {

	},
	delete: (req,res,next) => {

	}

};