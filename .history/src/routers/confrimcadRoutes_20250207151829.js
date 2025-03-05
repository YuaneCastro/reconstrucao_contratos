const express = require('express');
const router = express.Router();
const confirmcadcontroller = require('../controllers/confirmcad')

router.get('/confirmcad', confirmcadcontroller.showConfirmationPage);
router.post('/confirmcad', confirmccadontroller.confirmCode);

router.get('/confirmlog', confirmcontroller.showpageconflogin);
router.post('/confirmlog', confirmcontroller.confirmCodelogin);

module.exports = router;