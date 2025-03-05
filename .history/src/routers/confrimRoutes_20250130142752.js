const express = require('express');
const router = express.Router();
const confirmcontroller = require('../controllers/confirmcont')

router.get('/confirm', confirmcontroller.showConfirmationPage);
router.post('/confirm', confirmcontroller.confirmCode);

router.get()

module.exports = router;