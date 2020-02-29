const mongoose = require('mongoose');

const ColorScale = require('../models/colorScale');

const Form = require('../models/form');

const errorHandler = ( res, err ) => {

	console.log( err );

	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {
		ColorScale.find()
			.select('_id name items')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
							_id: doc._id,
							name: doc.name,
							items: doc.items
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

		const colorScale = new ColorScale({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			items: req.body.items
		});

		colorScale.save()
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

		ColorScale.findById(id)
					.exec()
					.then( (doc) => {
						
						const response = {
										name: doc.name,
										items: doc.items
									};

						res.status(200).json(response);

					})
					.catch( err => errorHandler(res, err) );

	},
	update: (req,res,next) => {

		const filter = { _id: req.body.id };
		const update = {
			name: req.body.name,
			items: req.body.items
		};

		ColorScale.findOneAndUpdate(filter, update, { new: true })
					.then( (doc) => {
						
						const response = {
										_id: doc._id,
										name: doc.name,
										items: doc.items
									};

						res.status(200).json(response);

					})
					.catch( err => errorHandler(res, err) );

	},
	delete: (req,res,next) => {

		ColorScale.deleteOne({ _id: req.query.id })
					.then( (result) => {
						
						res.status(200).json(result);

					})
					.catch( err => errorHandler(res, err) );

	},
	findByForm: (req,res,next) => {

		Form.aggregate([
							{
								$lookup:{
									from: 'colorScales',
									localField: 'colorScale',
									foreignField: '_id',
									as: 'colorScale'
								}
							},
							{ $match : { '_id' : mongoose.Types.ObjectId(req.query.id) } },
							{
								$project: {
									colorScale: 1
								}
							},
							{
								$unwind: '$colorScale'
							}
		])
		.exec()
		.then( (docs) => {

			if(docs[0] !== 'undefined'){
				res.status(200).json( docs[0].colorScale );
			}else{
				errorHandler(res, 'No records');
			}

		})
		.catch( err => errorHandler(res, err) );

	},
	findByFormsArray: (req,res,next) => {

		const formIds = req.body.forms.map( (id) => {
							return mongoose.Types.ObjectId(id)
						});

		Form.aggregate([
							{
								$lookup: {
									from: 'colorScales',
									localField: 'colorScale',
									foreignField: '_id',
									as: 'colorScale'
								}
							},
							{ $match : { '_id' : { '$in': formIds } } },
							{
								$group : {
									'_id':'$colorScale'
								}
							}
						])
			.exec()
			.then( (records) => {

				const response = records.map( (record) => {
					return record._id[0];
				});

				res.status(200).json(response);

			})
			.catch( err => errorHandler(res, err) );


	}

};