const {} = require('../db');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const secretKey = 'sua_chave_secreta';

exports.showpageconflogin = (req, res) => {
    res.render('confirmlog');
};

exports.confirmCodelogin = (req, res) =>{
    const { email, senha } = req.body;  
    try{
        const user = await 
    }catch(err){}
    
};