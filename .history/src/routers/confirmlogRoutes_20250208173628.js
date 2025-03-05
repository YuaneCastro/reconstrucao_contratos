const express = require('express');
const router = express.Router();
const confirmlogcontroller = require('../controllers/confirmlog');

router.get('/confirmlog', confirmlogcontroller.showpageconflogin);
router.post('/confirmlogin', confirmlogcontroller.confirmCodelogin);

module.exports = router;