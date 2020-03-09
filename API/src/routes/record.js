const express = require('express');
const router = express.Router();

const Record = require('../controllers/recordController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');


router.post('/create', checkAuth, accessRules, Record.create);
router.get('/find', checkAuth, accessRules, Record.find);
router.post('/update', checkAuth, accessRules, Record.update);
router.get('/delete', checkAuth, accessRules, Record.delete);

router.post('/getFormRecords', checkAuth, accessRules, Record.getFormRecords);
router.get('/getPlanRecords', checkAuth, accessRules, Record.getPlanRecords);

router.post('/getPlanRecordsByUser', checkAuth, accessRules, Record.getPlanRecordsByUser);
router.post('/getFormRecordsByUser', checkAuth, accessRules, Record.getFormRecordsByUser);

router.get('/getRecordsByEvaluator', checkAuth, accessRules, Record.getRecordsByEvaluator);
router.get('/getRecordsByEvaluated', checkAuth, accessRules, Record.getRecordsByEvaluated);


module.exports = router;
