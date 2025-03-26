const express = require('express');
const router = express.Router();
const confirmcadcontroller = require('../controllers/confirmcad')

router.get('/set-password/:token',contratocontrollers.telapass);
router.post('/set-password/:token', contratocontrollers.setPassword);

module.exports = router;