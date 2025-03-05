const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/telacont');
const  authenticateToken = require('../authMiddleware');

router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { email: req.user.email });
});
module.exports = router;
