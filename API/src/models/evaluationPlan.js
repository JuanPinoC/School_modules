const mongoose = require('mongoose');

const PlanFormsSchema = mongoose.Schema({
						form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
						weight: { type: Number, required: true },
						requiredAmount: { type: Number, required: true }
					});

const evaluationPlanSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true },
	userType: { type: mongoose.Schema.Types.ObjectId, ref: 'UserType', required: true },
	forms: [ PlanFormsSchema ],
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true }
});

module.exports = mongoose.model('EvaluationPlan', evaluationPlanSchema, 'evaluationPlans');