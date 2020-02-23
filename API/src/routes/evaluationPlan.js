const express = require('express');
const router = express.Router();

const EvaluationPlan = require('../controllers/evaluationPlanController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');


router.post('/create', checkAuth, accessRules, EvaluationPlan.create);
router.get('/find', checkAuth, accessRules, EvaluationPlan.find);
router.post('/update', checkAuth, accessRules, EvaluationPlan.update);
router.get('/delete', checkAuth, accessRules, EvaluationPlan.delete);


router.get('/', EvaluationPlan.list);

router.get('/getPlansAndForms', EvaluationPlan.getPlansAndForms);

module.exports = router;
