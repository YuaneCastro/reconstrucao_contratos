const express = require('express');
const router = express.Router();
const confirmlogcontroller = require('../controllers/confirmlog');

router.get('/confirmlogin', confirmlogcontroller.showpageconflogin)
router.post('/confirmlo')