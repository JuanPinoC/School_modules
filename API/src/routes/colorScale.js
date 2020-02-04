const express = require('express');
const router = express.Router();

const ColorScale = require('../controllers/colorScaleController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');

router.get('/', ColorScale.list);

module.exports = router;