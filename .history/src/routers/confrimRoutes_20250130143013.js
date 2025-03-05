const express = require('express');
const router = express.Router();
const confirmcontroller = require('../controllers/confirmcont')

router.get('/confirmcadastro', confirmcontroller.showConfirmationPage);
router.post('/confirmcadastro', confirmcontroller.confirmCode);

router.get('/confirmlogin', confi)

module.exports = router;