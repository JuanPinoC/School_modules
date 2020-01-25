const moongose = require('mongoose');

const Form = require('../models/form');
const Subform = require('../models/subform');
const Input = require('../models/input');

module.exports = {

	show: (req,res,next) => {

		Form.find()
			.select('name type weight')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					forms: docs.map( doc => {
						return {
							_id: doc._id,
							name: doc.name,
							type: doc.type,
							weight: doc.weight
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