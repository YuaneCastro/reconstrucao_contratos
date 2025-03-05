const express = require('express');
const router = express.Router();
const confirmcontroller = require('../controllers/confirmcont')

router.get('/confirmcadastro', confirmcontroller.showConfirmationPage);
router.post('/confirmcad', confirmcontroller.confirmCode);

router.get('/confirmlogin', confirmcontroller.showpageconflogin);
router.post('/confirmlogin', confirmcontroller.cofirmCodelogin);

module.exports = router;