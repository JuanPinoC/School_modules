const mongoose = require('mongoose');

const Record = require('../models/record');

const Input = require('../models/input');


const errorHandler = ( res, err ) => {
	console.log( err );
	res.status(500).json({
		error:err
	});
};

module.exports = {

	show: (req,res,next) => {

	},
	create: (req,res,next) => {

		let completedArr = [];

		const requestItems = req.body.items;

		let recordItemPromises = requestItems.map( ( item ) => {
		
			let itemPromise = new Promise(
											( resolve, reject ) => {

												Input.findById( item.input )
														.exec()
														.then( ( input ) => {

															completedArr.push( ( input.evaluatedUserField && ( item.answer === null || typeof item.answer === 'undefined' || item.answer === 0 ) )? false : true );

															switch( input.type ){
																case 'Text':
																	resolve( { input: item.input, answerString: item.answer } );
																case 'Number':
																	resolve( { input: item.input, answerNumber: item.answer } );
																case 'Number Options':
																case 'Text Options':
																	resolve( { input: item.input, answerId: item.answer } );
															}

														})
														.catch( ( err ) => reject( err ) );

											});

			return itemPromise.then( ( obj ) => { return obj } ).catch( ( err ) => { return err } );
		
		});

		Promise.all(recordItemPromises).then( arrayOfResponses => {

			if( arrayOfResponses.every( (e) => typeof e.input !== 'undefined' ) ){

				console.log( req.body.evaluated );

				const form = new Record({
					_id: new mongoose.Types.ObjectId(),
					evaluator: req.userData._id,
					evaluated: req.body.evaluated,
					form:	req.body.form,
					items: arrayOfResponses,
					Completed: completedArr.every( ( item ) => item )
				});

				form.save()
					.then( (result) => {

						res.status(201).json({
							message: 'Created Succesfully',
							createdObj: result
						});

					})
					.catch( err => errorHandler(res, err) );

			}else{
				errorHandler(res, 'Error at input mapping.');
			}

		}).catch( err => errorHandler(res, err) );

	},
	find: (req,res,next) => {

	},
	update: (req,res,next) => {
		
	},
	delete: (req,res,next) => {

	}

};