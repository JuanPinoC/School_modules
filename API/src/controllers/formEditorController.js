const mongoose = require('mongoose');

const Form = require('../models/form');
const Section = require('../models/section');
const Input = require('../models/input');

const SectionController = require('../controllers/sectionController');

const errorHandler = ( res, err ) => {
	console.log( err );
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {
		Form.find()
			.select('_id name type')
			.populate('colorScale', 'name')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
							_id: doc._id,
							name: doc.name,
							type: doc.type,
							colorScale: doc.colorScale
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

					return itemPromise.then( () => { return true } ).catch( (err) => { console.log(err); return false; } );
				
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

		let promise = new Promise( ( resolve, reject ) => {
										SectionController.delete( req.query.id, resolve, reject );
									} );

		promise.then( () => {

				Form.deleteOne({ _id: req.query.id })
							.then( (result) => {
								res.status(200).json(result);
							})
							.catch( err => errorHandler(res, err) );

			}).catch( err => errorHandler(res, err) );

	},
	findByIdArray: ( ids, resolve, reject ) => {

		Form.find({ '_id': { '$in': ids } })
			.select('_id name type')
			.exec()
			.then( (forms) => {

				const formsArray = forms.map( form => {
										return {
											_id: form._id,
											name: form.name,
											type: form.type
										}
									});

				resolve(formsArray);

			})
			.catch( (err) => reject(err) );

	},
	getInputs: ( id, resolve, reject ) => {

		Section.aggregate([
			{	$match: {
					form: mongoose.Types.ObjectId(id)
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
		]).then( ( records ) => {

			const inputArrays = records.map( (section) => {
				return section.inputs;
			});

			let inputs = [];

			for (let i = inputArrays.length - 1; i >= 0; i--) {
				inputs = [ ...inputArrays[i], ...inputs ];
			}

			resolve(inputs);

		}).catch( ( err ) => {

			reject(err);

		});

	},
	getForm: ( id, resolve, reject ) => {

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
					},
					{
						$sort : { order: 1, 'inputs.order': 1 }
					}
				])
				.exec()
				.then( (sections) => {

					resolve({
						_id:	form._id,
						name:	form.name,
						type:	form.type,
						action: form.action,
						description: form.description,
						colorScale: form.colorScale,
						sections: sections
					});

				})
				.catch( err => reject(err) );

			})
			.catch( err => reject(err) );
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