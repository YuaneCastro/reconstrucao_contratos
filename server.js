const express = require('express');
const path = require('path');
const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Rotas
app.get('/', (req, res) => {
  res.render('login/login');
});

// Exporta o app para o Vercel
module.exports = app;