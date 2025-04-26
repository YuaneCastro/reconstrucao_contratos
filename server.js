const express = require('express');
const path = require('path');
const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Arquivos estáticos (CSS, imagens, JS, etc.)
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Rotas
app.get('/', (req, res) => {
  res.render('login/login'); // ou outro arquivo .ejs
});

// Exporta o app para o Vercel
module.exports = app;