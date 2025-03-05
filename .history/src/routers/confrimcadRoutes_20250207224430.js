const express = require('express');
const router = express.Router();
const confirmcadcontroller = require('../controllers/confirmcad')

router.get('/confirmcad', confirmcadcontroller.showConfirmationPage);
router.post('/confirmcad', confirmcadcontrolleronfirmccadontroller.confirmCode);

module.exports = router;