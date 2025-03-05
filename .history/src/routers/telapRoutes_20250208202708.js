const express = require('express');
const router = express.Router();
const telaCont = require('../controllers/telacont');
const very

router.get('/telap',(req,res)=>{
    res.render('telap');
});

module.exports = router;