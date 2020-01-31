const moongose = require('mongoose');

const Section = require('../models/section');
const Input = require('../models/input');

const InputController = require('../controllers/inputController');

module.exports = {

	create: ( formId, element ) => {

		const section = new Section({
			_id: new mongoose.Types.ObjectId(),
			name: element.name,
			form: formId,
			action: element.action,
			weight: element.weight
		});

		form.save()
			.then( (result) => {

				const inputs = element.sections;

				inputs.forEach(
					(element) => {
						InputController.create( result._id, element );
					}
				);

			})
			.catch( (err) => {
				res.status(500).json({
					error: err
				});	
			});

	},
	update: (req,res,next) => {

	},
	delete: (req,res,next) => {

	}

};