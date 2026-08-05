const express = require("express");
const cors = require("cors");
const habitosRouter = require("./routes/habitos");

const app = express();

const corsOptions = {
  origin: [
    "https://vinivenegeroles.github.io", // produção
    "http://127.0.0.1:5500", // desenvolvimento local (Live Server)
  ],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/habitos", habitosRouter);

// Render define a porta via variável de ambiente em produção
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ mensagem: "API do Habit Tracker funcionando!" });
});

// Inicia o servidor, escutando na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
