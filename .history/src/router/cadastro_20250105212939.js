const express = require('express');
const router = express.Router();
const cadastroCont = require('../controllers/')

router.get('/cadastro',(req,res)=>{
    res.render('cadastro');
});

module.exports = router;