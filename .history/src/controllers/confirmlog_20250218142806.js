const { findOTPByUserId, deleteOTP } = require('../db');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const SECRET_KEY = 'sua_chave_secreta';



