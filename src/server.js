require('dotenv').config();

const urlRoutes = require('./routes/urlRoutes');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

// Conecta ao MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Atlas conectou"))
  .catch(err => console.error("erro ao conectar:", err));

// Middleware para o Express entender JSON que vem no body das reqs
app.use(express.json());

// Middleware para o Express entender dados de formulários
app.use(express.urlencoded({ extended: true })); 

// Configura o EJS como template engine para renderizar as views
app.set('view engine', 'ejs');

// Injeta as rotas de encurtamento q criei no app
app.use(urlRoutes);

// Configura o EJS como template engine para renderizar as views
app.set('view engine', 'ejs');

// Define a porta do ambiente (Heroku/Render) ou a 3000 pra dev local
port = process.env.PORT || 3000;

// Sobe o servidor e deixa ele ouvindo as requs
app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});