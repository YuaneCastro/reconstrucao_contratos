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
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmação de Cadastro',
            text: `Seu código de confirmação é: ${confirmationCode}`,
        });
    }catch(error){}
    
};