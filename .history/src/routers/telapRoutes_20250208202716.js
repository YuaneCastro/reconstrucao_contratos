const express = require('express');
const router = express.Router();
const telaCont = require('../controllers/telacont');
const verifyToken

router.get('/telap',(req,res)=>{
    res.render('telap');
});

module.exports = router;