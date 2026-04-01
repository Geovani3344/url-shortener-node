require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env

const urlRoutes = require("./routes/urlRoutes"); // Importa as rotas que criei pra encurtar URL, renderizar a pagina inicial e redirecionar
const mongoose = require("mongoose");// Importa o mongoose
const express = require("express"); // Importa o express pra criar o servidor e lidar com as rotas

const app = express();

// Conecta ao MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Atlas conectou"))
  .catch((err) => console.error("erro ao conectar:", err));

// Middleware para o Express entender JSON que vem no body das reqs
app.use(express.json());

// Middleware para o Express entender dados de formulários
app.use(express.urlencoded({ extended: true }));

// Configura o EJS como template engine para renderizar as views
app.set("view engine", "ejs");

const path = require("path"); // Importa o path pra lidar com caminhos de arquivos

// Isso faz o Node sair da pasta 'src' e encontrar a 'public' na raiz
app.use(express.static(path.join(__dirname, "../public")));

// Injeta as rotas de encurtamento q criei no app
app.use(urlRoutes);

// Define a porta do ambiente (Heroku/Render) ou a 3000 pra dev local
const port = process.env.PORT || 3000;
app.listen(port, () => { // Inicia o servidor e mostra a mensagem no console
  console.log(`Servidor rodando na porta ${port}`);
});
