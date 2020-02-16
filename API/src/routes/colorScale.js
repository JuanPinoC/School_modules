const express = require('express');
const router = express.Router();

const ColorScale = require('../controllers/colorScaleController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');


router.post('/create', checkAuth, accessRules, ColorScale.create);
router.get('/find', checkAuth, accessRules, ColorScale.find);
router.post('/update', checkAuth, accessRules, ColorScale.update);
router.get('/delete', checkAuth, accessRules, ColorScale.delete);

router.get('/', ColorScale.list);


module.exports = router;