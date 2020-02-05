const moongose = require('mongoose');

const Form = require('../models/form');
const Section = require('../models/section');
const Input = require('../models/input');

const SectionController = require('../controllers/sectionController');

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
							action: doc.action,
							description: doc.description,
							weight: doc.weight,
							colorScale: doc.colorScale
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

	console.log( req.body );

	console.log( req.body.sections );

/*
		const form = new Form({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			type: req.body.type,
			action: req.body.action,
			description: req.body.description,
			weight: req.body.weight,
			colorScale: req.colorScale
		});

		form.save()
			.then( (result) => {

				const sections = req.body.sections;

				sections.forEach(
					(element) => {
						SectionController.create( result._id, element );
					}
				);

				res.status(201).json({
					message: 'Created Succesfully',
					createdObj: result
				})
			})
			.catch( (err) => {
				res.status(500).json({
					error: err
				});	
			});
*/
	},
	find: (req,res,next) => {

	},
	update: (req,res,next) => {

	},
	delete: (req,res,next) => {

	}

};