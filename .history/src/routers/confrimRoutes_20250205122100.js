const express = require('express');
const router = express.Router();
const confirmcontroller = require('../controllers/confirmcont')

router.get('/confirmcad', confirmcontroller.showConfirmationPage);
router.post('/confirmcad', confirmcontroller.confirmCode);

router.get('/confirmlog', confirmcontroller.showpageconflogin);
router.post('/confirmlog', confirmcontroller.cofirmCodelogin);

module.exports = router;