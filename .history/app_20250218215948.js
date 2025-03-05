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
    resave: false, // Mantenha `false` para evitar salvar sessões desnecessárias
    saveUninitialized: false, // Alterado para `false` para evitar sessões vazias
    cookie: {
        secure: false, // Altere para `true` se estiver usando HTTPS
        httpOnly: true, // Garante que o cookie só pode ser acessado pelo servidor
        maxAge: 10 * 60 * 1000 // Expira em 10 minutos (ajuste conforme necessário)
    }
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
