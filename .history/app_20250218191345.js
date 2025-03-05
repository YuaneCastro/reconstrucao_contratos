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
    secret: 'sua-chave-secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Defina como `true` se estiver usando HTTPS
}));

const loginRoutes = require('./src/routers/loginRoutes');
const cadastroRoutes = require('./src/routers/cadastroRoutes');
const telapRoutes = require('./src/routers/telapRoutes');
const confirmcadRoutes = require('./src/routers/confrimcadRoutes');

app.use('/', loginRoutes);
app.use('/', cadastroRoutes);
app.use('/', telapRoutes);
app.use('/', confirmcadRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = app;
