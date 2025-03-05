const express = require('express');
const router = express.Router();
const

router.get('/cadastro',(req,res)=>{
    res.render('cadastro');
});

module.exports = router;