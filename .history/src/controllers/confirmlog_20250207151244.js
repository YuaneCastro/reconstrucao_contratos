const {addUserToDB, deleteOTP, findOTP} = require('../db');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const secretKey = 'sua_chave_secreta';
