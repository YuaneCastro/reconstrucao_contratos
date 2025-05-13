const cookieParser = require("cookie-parser");
const session = require('express-session');
const express = require('express');
const path = require('path');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./reconstrucao_contratos/.git/');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/favicon.ico', express.static('assets/favicon.ico'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(session({
  store: new pgSession({
    pool: pool, // sua pool de conexões
    tableName: 'session' // nome da tabela no banco (pode trocar)
  }),
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Rotas
const loginRoutes = require('./src/routers/loginRoutes');
const cadastroRoutes = require('./src/routers/cadastroRoutes');
const telapRoutes = require('./src/routers/dashboardRoutes');

app.use('/', loginRoutes);
app.use('/', cadastroRoutes);
app.use('/', telapRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.redirect('/login');
});

module.exports = app;