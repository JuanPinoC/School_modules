const express = require('express');
const router = express.Router();

const UserType = require('../controllers/userTypeController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');

router.get('/getUserType', checkAuth, accessRules, UserType.getUserType);

router.get('/', UserType.list);

module.exports = router;