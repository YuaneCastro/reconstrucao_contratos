const cookieParser = require("cookie-parser");
const session = require('express-session'); 
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/assets',express.static(path.join(__dirname,'assets')));
app.use(cookieParser());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'src','views'));

app.use(session({
    secret: 'seu-segredo', 
    resave: false, 
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

const loginRoutes = require('./src/routers/loginRoutes');
const cadastroRoutes = require('./src/routers/cadastroRoutes');
const telapRoutes = require('./src/routers/telapRoutes');
const confirmcadRoutes = require('./src/routers/confrimcadRoutes');
const confirmlogRoutes = require('./src/routers/confirmlogRoutes');

app.use('/', loginRoutes);
app.use('/', cadastroRoutes);
app.use('/', telapRoutes);
app.use('/', confirmcadRoutes);
app.use('/', confirmlogRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = app;
