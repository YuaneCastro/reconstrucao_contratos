router.get('/confirm', (req, res) => {
    const email = req.query.email;
    res.render('confirm', { email });
});