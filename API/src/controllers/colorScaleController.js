const mongoose = require('mongoose');

const ColorScale = require('../models/colorScale');

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

	}

};