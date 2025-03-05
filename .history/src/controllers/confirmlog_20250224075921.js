const { findOTPByUserId, deleteOTP } = require('../db');
const jwt = require('jsonwebtoken'); 
const SECRET_KEY = 'sua_chave_secreta';

