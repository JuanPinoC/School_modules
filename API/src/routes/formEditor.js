const express = require('express');
const router = express.Router();

const FormEditor = require('../controllers/formEditorController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');

/*
router.post('/create', checkAuth, accessRules, User.create);
router.get('/find', checkAuth, accessRules, User.find);
router.post('/update', checkAuth, accessRules, User.update);
router.get('/delete', checkAuth, accessRules, User.delete);
router.post('/login',User.login);
*/

module.exports = router;
