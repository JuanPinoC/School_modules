const mongoose = require('mongoose');

const Form = require('../models/form');
const Section = require('../models/section');

const SectionController = require('../controllers/sectionController');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {
		Form.find()
			.select('_id name type')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
							_id: doc._id,
							name: doc.name,
							type: doc.type
						}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );
	},
	create: (req,res,next) => {

		const form = new Form({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			type: req.body.type,
			action: req.body.action,
			description: req.body.description,
			weight: req.body.weight,
			colorScale: req.body.colorScale
		});

		form.save()
			.then( (result) => {

				const sections = req.body.sections;

				let sectionPromises = sections.map((item, index) => {
				
					let itemPromise = new Promise(
													( resolve, reject ) => {
														SectionController.create( result._id, index, item, resolve, reject );
													});

					return itemPromise.then( () => { return true } ).catch( () => { return false } );
				
				});

				Promise.all(sectionPromises).then( arrayOfResponses => {

					if( arrayOfResponses.every( (e) => e ) ){
						res.status(201).json({
							message: 'Created Succesfully',
							createdObj: result
						});
					}else{
						errorHandler(res, 'Error at sections creation.');
					}

				}).catch( err => errorHandler(res, err) );

			})
			.catch( err => errorHandler(res, err) );

	},
	find: (req,res,next) => {

		const id = req.query.id;

		Form.findById(id)
			.exec()
			.then( (form) => {

				Section.aggregate([
					{	
						$match: {
							form: mongoose.Types.ObjectId(id),
						}
					},
					{
						$lookup: {
							from: 'inputs',
							localField: '_id',
							foreignField: 'section',
							as: 'inputs'
						}
					},
					{
						$project: {
							__v: 0,
							'inputs.__v': 0
						}
					}
				])
				.exec()
				.then( (sections) => {

					res.status(200).json({
						_id:	form._id,
						name:	form.name,
						type:	form.type,
						action: form.action,
						description: form.description,
						weight: form.weight,
						colorScale: form.colorScale,
						sections: sections
					});

				})
				.catch( err => errorHandler(res, err) );

			})
			.catch( err => errorHandler(res, err) );

	},
	update: (req,res,next) => {
		
	},
	delete: (req,res,next) => {

	}

};

/*

db.sections.aggregate([
	{	$match: {
			form: ObjectId('5e3bc29efeddbb2098651654')
		}
	},
	{
		$lookup: {
			from: 'inputs',
			localField: '_id',
			foreignField: 'section',
			as: 'inputs'
		}
	}
]);

db.forms.aggregate([
	{	$match: {
			_id: ObjectId('5e3bc29efeddbb2098651654')
		}
	},
	{
		$lookup: {
			from: 'sections',
			localField: '_id',
			foreignField: 'form',
			as: 'sections'
		}
	},
	{ $unwind : '$sections' },
	{
		$lookup: {
			from: 'inputs', 
			localField: 'sections._id', 
			foreignField: 'section',
			as: 'sections.inputs'
		}
	}
]);

db.forms.aggregate([ {$match: { _id: ObjectId('5e3bc29efeddbb2098651654') } }, { $lookup: { from: 'sections', localField: '_id', foreignField: 'form', as: 'sections' } } ]).pretty();

*/