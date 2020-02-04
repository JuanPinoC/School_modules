const express = require('express');
const router = express.Router();

const FormEditor = require('../controllers/formEditorController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');

/*
router.post('/create', checkAuth, accessRules, FormEditor.create);
router.get('/find', checkAuth, accessRules, FormEditor.find);
router.post('/update', checkAuth, accessRules, FormEditor.update);
router.get('/delete', checkAuth, accessRules, FormEditor.delete);
*/

module.exports = router;
