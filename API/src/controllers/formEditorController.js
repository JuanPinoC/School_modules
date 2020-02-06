const mongoose = require('mongoose');

const Form = require('../models/form');

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
				res.status(500).json({
					error:err
				});
			});
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
						res.status(500).json({
							error: err
						});
					}

				});

			})
			.catch( (err) => {
				res.status(500).json({
					error: err
				});
			});

	},
	find: (req,res,next) => {

		const id = req.query.id;

		console.log(id);

		Form.aggregate([
/*
							{
								$match: {
									_id: id
								}
							},
*/
							{
								$lookup:
										{
											from: 'sections',
											localField: '_id',
											foreignField: 'form',
											as: 'sections'
										}
							}
/*							,
							{
								$project:{
									_id: '$id',
									name: '$name',
									type: '$type',
									action: '$action',
									description: '$description',
									weight: '$weight',
									colorScale: '$colorScale',
									sections: '$sections'
								}
							}
*/
						])
			.exec()
			.then( doc => {
				res.status(200).json(doc);
			})
			.catch(err => {
				res.status(500).json({
					error:err
				});
			});

	},
	update: (req,res,next) => {

	},
	delete: (req,res,next) => {

	}

};