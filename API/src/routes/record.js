const express = require('express');
const router = express.Router();

const Record = require('../controllers/recordController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');


router.post('/create', checkAuth, accessRules, Record.create);
router.get('/find', checkAuth, accessRules, Record.find);
router.post('/update', checkAuth, accessRules, Record.update);
router.get('/delete', checkAuth, accessRules, Record.delete);


module.exports = router;
