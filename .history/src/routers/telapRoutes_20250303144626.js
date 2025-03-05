const express = require('express');
const router = express.Router();
const  authenticateToken = require('../authMiddleware');

router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { email: req.user.email });
});

module.exports = router;
