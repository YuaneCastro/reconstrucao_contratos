const express = require('express');
const router = express.Router();
const confirmcadcontroller = require('../controllers/confirmcad')

router.get('/confirmcad', confirmcontroller.showConfirmationPage);
router.post('/confirmcad', confirmcontroller.confirmCode);

router.get('/confirmlog', confirmcontroller.showpageconflogin);
router.post('/confirmlog', confirmcontroller.confirmCodelogin);

module.exports = router;