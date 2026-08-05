// Importa o Express — framework que criamos com "npm install express"
// Isso é parecido com um "import" de uma lib no Java
const express = require("express");
const cors = require("cors");
const habitosRouter = require("./routes/habitos"); // importa o router que criamos

// Cria a aplicação Express (pensa nisso como instanciar o "app principal")
const app = express();

app.use(cors());
// Middleware que permite o Express entender JSON no corpo das requisições
// (sem isso, req.body vai vir undefined quando o front mandar dados em JSON)
app.use(express.json());

// Diz pro Express: toda rota que começar com "/habitos" vai ser
// tratada pelo router que está em routes/habitos.js
app.use("/habitos", habitosRouter);

// Define a porta onde o servidor vai "escutar" as requisições
const PORT = process.env.PORT || 3000;

// Rota de teste: quando alguém acessar GET http://localhost:3000/
// essa função é executada e devolve uma resposta
app.get("/", (req, res) => {
  res.json({ mensagem: "API do Habit Tracker funcionando!" });
});

// Inicia o servidor, escutando na porta definida
// O callback (função dentro do listen) roda assim que o servidor sobe
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
