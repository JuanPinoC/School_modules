const mongoose = require('mongoose');

const Record = require('../models/record');

const Input = require('../models/input');

const Plan = require('../models/evaluationPlan');

const FormEditorController = require('../controllers/FormEditorController');


const errorHandler = ( res, err ) => {
	console.log( err );
	res.status(500).json({
		error:err
	});
};


const sumValues = (array) => {
	return array.reduce((a,b) => a + b, 0);
};

const avgValues = (array) => {
	return sumValues(array)/array.length;
}

module.exports = {

	show: (req,res,next) => {

	},
	create: (req,res,next) => {

		let completedArr = [];

		const evaluatedUserId = req.body.evaluated + '';
		const signedUserId = req.userData._id + '';

		isEvaluatedUser = evaluatedUserId === signedUserId;

		const requestItems = req.body.items;

		let formInputsPromise = new Promise( ( resolve, reject ) => FormEditorController.getInputs( req.body.form, resolve, reject ) );

		formInputsPromise.then( (formInputsArray) => {

				let recordItems = [];

				requestItems.forEach( ( item ) => {

					const id = formInputsArray.findIndex( (e) => e._id + '' === item.input + '' );

					if( formInputsArray[id].evaluatedUserField !== isEvaluatedUser ){
						
					}else{

						switch( formInputsArray[id].type ){
							case 'Text':
								recordItems.push( { input: item.input, answerString: item.answer } );
								break;
							case 'Number':
								recordItems.push( { input: item.input, answerNumber: item.answer } );
								break;
							case 'Number Options':
							case 'Text Options':
								recordItems.push( { input: item.input, answerId: item.answer } );
								break;
						}

					}

				});

				let completedForm = formInputsArray.map( ( formInput ) => {
					return ( recordItems.findIndex( (e) => e.input + '' === formInput._id + '' ) >= 0 );
				});

				const record = new Record({
					_id: new mongoose.Types.ObjectId(),
					evaluator: req.userData._id,
					evaluated: req.body.evaluated,
					plan: req.body.plan,
					planItemId: req.body.planItemId,
					form: req.body.form,
					items: recordItems,
					completed: completedForm.every( (e) => e )
				});

				record.save()
					.then( (result) => {

						res.status(201).json({
							message: 'Created Succesfully',
							createdObj: result
						});

					})
					.catch( err => errorHandler(res, err) );

		}).catch( err => errorHandler(res, err) );

	},
	find: (req,res,next) => {

		Record.findById(req.query.id)
			.populate('evaluated','_id name')
			.exec()
			.then( (record) => {

				res.status(200).json({
					_id: record._id,
					evaluator: record.evaluator,
					evaluated: record.evaluated,
					plan: record.plan,
					planItemId: record.planItemId,
					form: record.form,
					items: record.items,
					completed: record.completed
				});

			}).catch( err => errorHandler(res, err) );

	},
	update: (req,res,next) => {

		Record.findById(req.body.id)
			.exec()
			.then( (record) => {

				if( true ){ // !record.completed

					const evaluatedUserId = record.evaluated + '';
					const signedUserId = req.userData._id + '';

					isEvaluatedUser = evaluatedUserId === signedUserId;

					const requestItems = req.body.items;

					let formInputsPromise = new Promise( ( resolve, reject ) => FormEditorController.getInputs( req.body.form, resolve, reject ) );

					formInputsPromise.then( (formInputsArray) => {

							let recordItems = [];

							requestItems.forEach( ( item ) => {

								const id = formInputsArray.findIndex( (e) => e._id + '' === item.input + '' );

								if( formInputsArray[id].evaluatedUserField !== isEvaluatedUser ){
									
								} else {

									switch( formInputsArray[id].type ){
										case 'Text':
											recordItems.push( { input: item.input, answerString: item.answer } );
											break;
										case 'Number':
											recordItems.push( { input: item.input, answerNumber: item.answer } );
											break;
										case 'Number Options':
										case 'Text Options':
											recordItems.push( { input: item.input, answerId: item.answer } );
											break;
									}

								}

							});

							let oldRecordItems = [];

							record.items.forEach( (oldRecordItem) => {

								if( recordItems.findIndex( (newRecordItem) => oldRecordItem.input + '' === newRecordItem.input + '') === -1 ){

									oldRecordItems.push(oldRecordItem);

								}

							});

							const filter = { _id: req.body.id };
							const update = {
								items: [ ...oldRecordItems, ...recordItems ],
								completed: oldRecordItems.length + recordItems.length === formInputsArray.length
							};

							Record.findOneAndUpdate(filter, update, { new: true })
										.then( (doc) => {
											
											const response = {
															message: 'Updated'
														};

											res.status(200).json(response);

										})
										.catch( err => errorHandler(res, err) );

					}).catch( err => errorHandler(res, err) );

				}else{

					res.status(200).json({ message: 'Already completed' });

				}

			}).catch( err => errorHandler(res, err) );

	},
	delete: (req,res,next) => {

	},
	getFormRecords: (req,res,next) => {

		let formPromise = new Promise(( resolve, reject ) => {
										FormEditorController.getForm( req.body.form, resolve, reject );
									});

		formPromise.then( (form) => {

			Record.find({ 'plan': req.body.plan, 'planItemId': req.body.planItemId, 'form': req.body.form, 'completed': true })
				.populate('evaluated','_id name')
				.sort('evaluated.name')
				.exec()
				.then( (records) => {

					const sections = form.sections;

					const recordsArray = records.map( (record) => {

						let sectionsItems = {};
						let sectionsTotals = {};
						let sectionsTotalsArray = [];
						let total = 0;

						const itemsToShow = record.items.map( (item) => {

							let inputIndex = -1;
							let sectionIndex = sections.length;

							while( sectionIndex >= 0 && inputIndex < 0 ){
								sectionIndex--;
								inputIndex = sections[sectionIndex].inputs.findIndex( (e) => e._id + '' === item.input + '' );
							}

							const options = sections[sectionIndex].inputs[inputIndex].options;
							let optionIndex = -1;

							switch( sections[sectionIndex].inputs[inputIndex].type ){
								case 'Text':
									//item.answerString
									return { section: sections[sectionIndex]._id , input: item.input, answer: item.answerString };
									break;
								case 'Number':
									sectionsItems[ sections[sectionIndex]._id ] = (typeof sectionsItems[ sections[sectionIndex]._id ] !== 'undefined' )? 
																					[ ...sectionsItems[ sections[sectionIndex]._id ], item.answerNumber ] : [ item.answerNumber ];
									//item.answerNumber
									return { section: sections[sectionIndex]._id , input: item.input, answer: item.answerNumber };
									break;
								case 'Number Options':
									optionIndex = options.findIndex( (e) => e._id + '' === item.answerId + '' );

									sectionsItems[ sections[sectionIndex]._id ] = (typeof sectionsItems[ sections[sectionIndex]._id ] !== 'undefined' )? 
																					[ ...sectionsItems[ sections[sectionIndex]._id ], options[optionIndex].value ] : [ options[optionIndex].value ];

									//item.answerId
									return { section: sections[sectionIndex]._id , input: item.input, answer: options[optionIndex].label };
									break;
								case 'Text Options':
									optionIndex = options.findIndex( (e) => e._id + '' === item.answerId + '' );

									//item.answerId
									return { section: sections[sectionIndex]._id , input: item.input, answer: options[optionIndex].label };
									break;
							}

						});

						sections.forEach( (section) => {

							switch(section.action){
								case 'sum':
									sectionsTotals[section._id] = sumValues(sectionsItems[section._id]);
									sectionsTotalsArray.push( sectionsTotals[section._id] );
									break;
								case 'avg':
									sectionsTotals[section._id] = avgValues(sectionsItems[section._id]);
									sectionsTotalsArray.push( sectionsTotals[section._id] );
									break;
								case 'none':
									break;
							}
						
						});

						switch(form.action){
							case 'sum':
								total = sumValues( sectionsTotalsArray );
								break;
							case 'avg':
								total = avgValues( sectionsTotalsArray );
								break;
							case 'none':
								total = '';
								break;
						}

						return {
							_id: record._id,
							evaluator: record.evaluator,
							evaluated: record.evaluated,
							plan: record.plan,
							planItemId: record.planItemId,
							form: record.form,
							items: record.items,
							completed: record.completed,

							itemsToShow: itemsToShow,
							sectionsTotals: sectionsTotals,
							total: total
						};
					});

					res.status(200).json({
						form: form,
						records: recordsArray
					});

				}).catch( err => errorHandler(res, err) );


		}).catch( err => errorHandler(res, err) );

	},
	getPlanRecords: (req,res,next) => {

		Plan.findById(req.query.id)
		.exec()
		.then( (plan) => {

			let idForms = plan.forms.map( (e) => {
				return e.form;
			});

			let formsPromise = new Promise(( resolve, reject ) => {
									FormEditorController.getForms( idForms, resolve, reject );
								});

			formsPromise.then( (forms) => {

				Record.find({ 'form': { '$in': idForms }, completed: true })
				.populate('evaluated','_id name')
				.exec()
				.then( ( records ) => {

					let formsRecordsArrays = [];

					forms.forEach( (form) => {

						const planFormItemIndex = plan.forms.findIndex( (e) => e.form + '' === form._id + '' );

						const filteredRecords = records.filter( (record) => record.form + '' === form._id + '' );
						const sections = form.sections;
						
						let recordsResult = filteredRecords.map( (record) => {

							let sectionsItems = {};
							let sectionsTotals = {};
							let sectionsTotalsArray = [];
							let total = 0;

							record.items.forEach( (item) => {

								let inputIndex = -1;
								let sectionIndex = sections.length;

								while( sectionIndex >= 0 && inputIndex < 0 ){
									sectionIndex--;
									inputIndex = sections[sectionIndex].inputs.findIndex( (e) => e._id + '' === item.input + '' );
								}

								const options = sections[sectionIndex].inputs[inputIndex].options;
								let optionIndex = -1;

								switch( sections[sectionIndex].inputs[inputIndex].type ){
									case 'Text':
										break;
									case 'Number':
										sectionsItems[ sections[sectionIndex]._id ] = (typeof sectionsItems[ sections[sectionIndex]._id ] !== 'undefined' )? 
																						[ ...sectionsItems[ sections[sectionIndex]._id ], item.answerNumber ] : [ item.answerNumber ];
										break;
									case 'Number Options':
										optionIndex = options.findIndex( (e) => e._id + '' === item.answerId + '' );

										sectionsItems[ sections[sectionIndex]._id ] = (typeof sectionsItems[ sections[sectionIndex]._id ] !== 'undefined' )? 
																						[ ...sectionsItems[ sections[sectionIndex]._id ], options[optionIndex].value ] : [ options[optionIndex].value ];
										break;
									case 'Text Options':
										break;
								}

							});

							sections.forEach( (section) => {

								switch(section.action){
									case 'sum':
										sectionsTotals[section._id] = sumValues(sectionsItems[section._id]);
										sectionsTotalsArray.push( sectionsTotals[section._id] );
										break;
									case 'avg':
										sectionsTotals[section._id] = avgValues(sectionsItems[section._id]);
										sectionsTotalsArray.push( sectionsTotals[section._id] );
										break;
									case 'none':
										break;
								}
							
							});

							switch(form.action){
								case 'sum':
									total = sumValues( sectionsTotalsArray );
									break;
								case 'avg':
									total = avgValues( sectionsTotalsArray );
									break;
								case 'none':
									total = '';
									break;
							}

							return {
									_id: record._id,
									evaluated: record.evaluated,
									total: total
								};
						
						});

						formsRecordsArrays.push({
							_id: form._id,
							weight: plan.forms[planFormItemIndex].weight,
							requiredAmount: plan.forms[planFormItemIndex].requiredAmount,
							records: recordsResult
						});

					});

					let evaluatedUsersFormRecords = [];

					formsRecordsArrays.forEach( ( formRecords ) => {

						formRecords.records.forEach( (record) => {

							const ArrayIndex = evaluatedUsersFormRecords.findIndex( (e) => e.evaluated._id + '' === record.evaluated._id + '' );

							if(ArrayIndex < 0){

								evaluatedUsersFormRecords.push(
									{
										evaluated: record.evaluated,
										formTotals: [
														{	formId: formRecords._id,
															totals: [ record.total ] }
													]
									}
								);

							}else{

								let formTotals = evaluatedUsersFormRecords[ArrayIndex].formTotals;

								const formTotalsItemIndex = formTotals.findIndex( (e) => e.formId + '' === formRecords._id + ''); 

								if( formTotalsItemIndex < 0 ){

									formTotals.push({ formId: formRecords._id,
															totals: [ record.total ] });

								}else{

									formTotals[formTotalsItemIndex].totals.push(record.total); 

								}

								evaluatedUsersFormRecords[ArrayIndex] = {
																			...evaluatedUsersFormRecords[ArrayIndex],
																			formTotals: formTotals
																		};
							
							}

						});

					});

					const response = evaluatedUsersFormRecords.map( ( evaluatedUserRecords  ) => {

						let avgWeightedValues = [];

						const formAvgs = evaluatedUserRecords.formTotals.map( ( formTotalsItem ) => {

							const formsRecordsArraysIndex = formsRecordsArrays.findIndex( (e) => e._id + '' === formTotalsItem.formId + '' );

							avgWeightedValues.push( avgValues( formTotalsItem.totals ) * formsRecordsArrays[formsRecordsArraysIndex].weight / 100);

							return {
									formId: formTotalsItem.formId,
									formWeight: formsRecordsArrays[formsRecordsArraysIndex].weight,
									completed: formTotalsItem.totals.length === formsRecordsArrays[formsRecordsArraysIndex].requiredAmount,
									total: avgValues( formTotalsItem.totals )
								};

						});

						return {
							evaluated: evaluatedUserRecords.evaluated,
							formAvgs: formAvgs,
							total: sumValues(avgWeightedValues)
						};

					});

					res.status(200).json(response);

				}).catch( err => errorHandler(res, err) );

			}).catch( err => errorHandler(res, err) );

		}).catch( err => errorHandler(res, err) );

	},
	getPlanRecordsByUser: (req,res,next) => {

		Plan.find({ userType: req.body.userTypeId })
		.exec()
		.then( (plans) => {

			const plansRecordsPromises = plans.map( (plan) => {

				let idForms = plan.forms.map( (e) => {
					return e.form;
				});

				let formsPromise = new Promise(( resolve, reject ) => {
										FormEditorController.getForms( idForms, resolve, reject );
									});

				let processPromise = new Promise(( resolve, reject ) => {
										
				formsPromise.then( (forms) => {

					Record.find({ evaluated: req.body.userId ,'form': { '$in': idForms }, completed: true })
						.populate('evaluated','_id name')
						.exec()
						.then( ( records ) => {

							let formsRecordsArrays = [];

							forms.forEach( (form) => {

								const planFormItemIndex = plan.forms.findIndex( (e) => e.form + '' === form._id + '' );

								const filteredRecords = records.filter( (record) => record.form + '' === form._id + '' );
								const sections = form.sections;

								let recordsResult = filteredRecords.map( (record) => {

									let sectionsItems = {};
									let sectionsTotals = {};
									let sectionsTotalsArray = [];
									let total = 0;

									record.items.forEach( (item) => {

										let inputIndex = -1;
										let sectionIndex = sections.length;

										while( sectionIndex >= 0 && inputIndex < 0 ){
											sectionIndex--;
											inputIndex = sections[sectionIndex].inputs.findIndex( (e) => e._id + '' === item.input + '' );
										}

										const options = sections[sectionIndex].inputs[inputIndex].options;
										let optionIndex = -1;

										switch( sections[sectionIndex].inputs[inputIndex].type ){
											case 'Text':
												break;
											case 'Number':
												sectionsItems[ sections[sectionIndex]._id ] = (typeof sectionsItems[ sections[sectionIndex]._id ] !== 'undefined' )? 
																								[ ...sectionsItems[ sections[sectionIndex]._id ], item.answerNumber ] : [ item.answerNumber ];
												break;
											case 'Number Options':
												optionIndex = options.findIndex( (e) => e._id + '' === item.answerId + '' );

												sectionsItems[ sections[sectionIndex]._id ] = (typeof sectionsItems[ sections[sectionIndex]._id ] !== 'undefined' )? 
																								[ ...sectionsItems[ sections[sectionIndex]._id ], options[optionIndex].value ] : [ options[optionIndex].value ];
												break;
											case 'Text Options':
												break;
										}

									});

									sections.forEach( (section) => {

										switch(section.action){
											case 'sum':
												sectionsTotals[section._id] = sumValues(sectionsItems[section._id]);
												sectionsTotalsArray.push( sectionsTotals[section._id] );
												break;
											case 'avg':
												sectionsTotals[section._id] = avgValues(sectionsItems[section._id]);
												sectionsTotalsArray.push( sectionsTotals[section._id] );
												break;
											case 'none':
												break;
										}
									
									});

									switch(form.action){
										case 'sum':
											total = sumValues( sectionsTotalsArray );
											break;
										case 'avg':
											total = avgValues( sectionsTotalsArray );
											break;
										case 'none':
											total = '';
											break;
									}

									return {
											_id: record._id,
											evaluated: record.evaluated,
											total: total
										};
								
								});

								formsRecordsArrays.push({
									_id: form._id,
									weight: plan.forms[planFormItemIndex].weight,
									requiredAmount: plan.forms[planFormItemIndex].requiredAmount,
									records: recordsResult
								});

							});

							let evaluatedUsersFormRecords = [];

							formsRecordsArrays.forEach( ( formRecords ) => {

								formRecords.records.forEach( (record) => {

									const ArrayIndex = evaluatedUsersFormRecords.findIndex( (e) => e.evaluated._id + '' === record.evaluated._id + '' );

									if(ArrayIndex < 0){

										evaluatedUsersFormRecords.push(
											{
												evaluated: record.evaluated,
												formTotals: [
																{	formId: formRecords._id,
																	totals: [ record.total ] }
															]
											}
										);

									}else{

										let formTotals = evaluatedUsersFormRecords[ArrayIndex].formTotals;

										const formTotalsItemIndex = formTotals.findIndex( (e) => e.formId + '' === formRecords._id + ''); 

										if( formTotalsItemIndex < 0 ){

											formTotals.push({ formId: formRecords._id,
																	totals: [ record.total ] });

										}else{

											formTotals[formTotalsItemIndex].totals.push(record.total); 

										}

										evaluatedUsersFormRecords[ArrayIndex] = {
																					...evaluatedUsersFormRecords[ArrayIndex],
																					formTotals: formTotals
																				};
									
									}

								});

							});

							const planRecords = evaluatedUsersFormRecords.map( ( evaluatedUserRecords  ) => {

								let avgWeightedValues = [];

								const formAvgs = evaluatedUserRecords.formTotals.map( ( formTotalsItem ) => {

									const formsRecordsArraysIndex = formsRecordsArrays.findIndex( (e) => e._id + '' === formTotalsItem.formId + '' );

									avgWeightedValues.push( avgValues( formTotalsItem.totals ) * formsRecordsArrays[formsRecordsArraysIndex].weight / 100);

									return {
											formId: formTotalsItem.formId,
											formWeight: formsRecordsArrays[formsRecordsArraysIndex].weight,
											completed: formTotalsItem.totals.length === formsRecordsArrays[formsRecordsArraysIndex].requiredAmount,
											total: avgValues( formTotalsItem.totals )
										};

								});

								return {
									evaluated: evaluatedUserRecords.evaluated,
									formAvgs: formAvgs,
									total: sumValues(avgWeightedValues)
								};

							});

							console.log(planRecords);
							resolve(planRecords);

						}).catch( err => { reject(err); } );

					}).catch( err => { reject(err); } );

				});

				return processPromise.then( (promiseRes) => { 
												return {
															planId: plan._id,
															records: (typeof promiseRes[0] !== 'undefined')? promiseRes[0] : {}
														} 
									})
									.catch( (err) => { return err; } );

			});

			Promise.all(plansRecordsPromises).then( arrayOfResponses => {

				console.log(arrayOfResponses);

				res.status(200).json(arrayOfResponses);

			}).catch( err => errorHandler(res, err) );

		}).catch( err => errorHandler(res, err) );

	},
	getFormRecordsByUser: (req,res,next) => {

		let formPromise = new Promise(( resolve, reject ) => {
										FormEditorController.getForm( req.body.form, resolve, reject );
									});

		formPromise.then( (form) => {

			Record.find({
							'plan': req.body.plan,
							'planItemId': req.body.planItemId,
							'form': req.body.form,
							'completed': true,
							'evaluated': req.userData._id })
				.populate('evaluated','_id name')
				.sort('evaluated.name')
				.exec()
				.then( (records) => {

					const sections = form.sections;

					const recordsArray = records.map( (record) => {

						let sectionsItems = {};
						let sectionsTotals = {};
						let sectionsTotalsArray = [];
						let total = 0;

						const itemsToShow = record.items.map( (item) => {

							let inputIndex = -1;
							let sectionIndex = sections.length;

							while( sectionIndex >= 0 && inputIndex < 0 ){
								sectionIndex--;
								inputIndex = sections[sectionIndex].inputs.findIndex( (e) => e._id + '' === item.input + '' );
							}

							const options = sections[sectionIndex].inputs[inputIndex].options;
							let optionIndex = -1;

							switch( sections[sectionIndex].inputs[inputIndex].type ){
								case 'Text':
									//item.answerString
									return { section: sections[sectionIndex]._id , input: item.input, answer: item.answerString };
									break;
								case 'Number':
									sectionsItems[ sections[sectionIndex]._id ] = (typeof sectionsItems[ sections[sectionIndex]._id ] !== 'undefined' )? 
																					[ ...sectionsItems[ sections[sectionIndex]._id ], item.answerNumber ] : [ item.answerNumber ];
									//item.answerNumber
									return { section: sections[sectionIndex]._id , input: item.input, answer: item.answerNumber };
									break;
								case 'Number Options':
									optionIndex = options.findIndex( (e) => e._id + '' === item.answerId + '' );

									sectionsItems[ sections[sectionIndex]._id ] = (typeof sectionsItems[ sections[sectionIndex]._id ] !== 'undefined' )? 
																					[ ...sectionsItems[ sections[sectionIndex]._id ], options[optionIndex].value ] : [ options[optionIndex].value ];

									//item.answerId
									return { section: sections[sectionIndex]._id , input: item.input, answer: options[optionIndex].label };
									break;
								case 'Text Options':
									optionIndex = options.findIndex( (e) => e._id + '' === item.answerId + '' );

									//item.answerId
									return { section: sections[sectionIndex]._id , input: item.input, answer: options[optionIndex].label };
									break;
							}

						});

						sections.forEach( (section) => {

							switch(section.action){
								case 'sum':
									sectionsTotals[section._id] = sumValues(sectionsItems[section._id]);
									sectionsTotalsArray.push( sectionsTotals[section._id] );
									break;
								case 'avg':
									sectionsTotals[section._id] = avgValues(sectionsItems[section._id]);
									sectionsTotalsArray.push( sectionsTotals[section._id] );
									break;
								case 'none':
									break;
							}
						
						});

						switch(form.action){
							case 'sum':
								total = sumValues( sectionsTotalsArray );
								break;
							case 'avg':
								total = avgValues( sectionsTotalsArray );
								break;
							case 'none':
								total = '';
								break;
						}

						return {
							_id: record._id,
							evaluator: record.evaluator,
							evaluated: record.evaluated,
							plan: record.plan,
							planItemId: record.planItemId,
							form: record.form,
							items: record.items,
							completed: record.completed,

							itemsToShow: itemsToShow,
							sectionsTotals: sectionsTotals,
							total: total
						};
					});

					res.status(200).json({
						form: form,
						records: recordsArray
					});

				}).catch( err => errorHandler(res, err) );


		}).catch( err => errorHandler(res, err) );

	},
	getRecordsByEvaluator: (req,res,next) => {

		Record.find({ evaluator: req.userData._id })
			.select('_id evaluated plan planItemId form completed')
			.populate('evaluated','_id name')
			.populate('plan','_id name')
			.populate('form','_id name')
			.exec()
			.then( (records) => {

				const response = {
					count: records.length,
					records: records.map( record => {
						return {
							_id: record._id,
							evaluated: record.evaluated,
							plan: record.plan,
							planItemId: record.planItemId,
							form: record.form,
							completed: record.completed
						}
					})
				};

				res.status(200).json(response);

			}).catch( err => errorHandler(res, err) );

	},

	getRecordsByEvaluated: (req,res,next) => {

		Record.find({ evaluated: req.userData._id })
			.select('_id evaluator plan planItemId form completed')
			.populate('evaluator','_id name')
			.populate('plan','_id name')
			.populate('form','_id name')
			.exec()
			.then( (records) => {

				const response = {
					count: records.length,
					records: records.map( record => {
						return {
							_id: record._id,
							evaluator: record.evaluator,
							plan: record.plan,
							planItemId: record.planItemId,
							form: record.form,
							completed: record.completed
						}
					})
				};

				res.status(200).json(response);

			}).catch( err => errorHandler(res, err) );

	}

};