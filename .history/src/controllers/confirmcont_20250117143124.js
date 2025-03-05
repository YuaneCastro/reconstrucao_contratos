const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const pool = require('../db');

exports.showConfirmationPage = (req, res) => {
    res.render('confirm');
};
