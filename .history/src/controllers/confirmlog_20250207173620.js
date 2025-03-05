const {findUserByEmail} = require('../db');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const secretKey = 'sua_chave_secreta';

exports.showpageconflogin = (req, res) => {
    res.render('confirmlog');
};

exports.confirmCodelogin = (req, res) =>{
    const { email, senha } = req.body;  
    try{
        const user = await findUserByEmail(email);
        if(!user || !bcrypt.compareSync(senha, user.senha)){
            console.log(`❌ Falha no login para: ${email}`);
            return res.status(401).json({ message: 'Email ou senha incorretos' })
        }
    }catch(error){}
    
};