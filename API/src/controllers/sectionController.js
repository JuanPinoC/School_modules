const mongoose = require('mongoose');

const Section = require('../models/section');

const InputController = require('../controllers/inputController');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	create: ( formId, order, element, resolve, reject ) => {

		const section = new Section({
			_id: new mongoose.Types.ObjectId(),
			name: element.name,
			form: formId,
			action: element.action,
			order: order
		});

		section.save()
			.then( (result) => {

				const inputs = element.inputs;

				let inputPromises = inputs.map((item, index) => {

					let itemPromise = new Promise(
													( resolve1, reject1 ) => {
														InputController.create( result._id, index, item, resolve1, reject1 );
													});

					return itemPromise.then( () => { return true } ).catch( () => { return false } );
				
				});

				Promise.all(inputPromises).then(arrayOfResponses => {
					
					if( arrayOfResponses.every( (e) => e ) ){
						resolve();
					}else{
						reject();
					}

				}).catch( err => errorHandler(res, err) );

			})
			.catch( (err) => {
				reject();
			});

	},
	update: (req,res,next) => {

	},
	delete: ( formId, resolve, reject ) => {

		Section.find({ form: formId })
				.select('_id')		
				.exec()
				.then( (docs) => {

					let promises = docs.map( (item) => {

						let itemPromise = new Promise(
														( resolve1, reject1 ) => {
															InputController.delete( item._id, resolve1, reject1 );
														});

						return itemPromise.then( () => { return true } ).catch( () => { return false } );
					
					});

					Promise.all(promises).then( arrayOfResponses => {
						
						if( arrayOfResponses.every( (e) => e ) ){

							Section.deleteMany({ form: formId })
								.then( (result) => {
									resolve();
								})
								.catch( (err) => {
									reject();
								});

						}else{
							reject();
						}

					}).catch( err => errorHandler(res, err) );

				})
				.catch( (err) => {
					reject();
				});

	}

};