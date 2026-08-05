// Módulo nativo do Node.js para trabalhar com arquivos
const fs = require("fs");

// Caminho do arquivo onde os hábitos ficam salvos
const CAMINHO_ARQUIVO = "./data/habitos.json";

// Lê o arquivo JSON e devolve como array de objetos JS
function lerHabitos() {
  const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
  return JSON.parse(conteudo); // transforma o texto JSON em objeto/array JS
}

// Recebe um array de hábitos e escreve no arquivo, formatado
function salvarHabitos(habitos) {
  // JSON.stringify converte o array JS de volta pra texto JSON
  // o "null, 2" é só formatação (2 espaços de indentação, fica legível)
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(habitos, null, 2));
}
// Retorna a data de hoje no formato "AAAA-MM-DD" (mesmo formato salvo no array)
function dataDeHoje() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Calcula quantos dias seguidos um hábito foi concluído,
 * contando a partir de hoje para trás.
 */
function calcularStreak(diasConcluidos) {
  let streak = 0;
  let dataAtual = new Date();

  while (true) {
    const dataFormatada = dataAtual.toISOString().split("T")[0];

    if (diasConcluidos.includes(dataFormatada)) {
      streak++;
      dataAtual.setDate(dataAtual.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// Router do Express — permite organizar rotas em arquivo separado
// (em vez de tudo dentro do server.js)
const express = require("express");
const router = express.Router();

// GET /habitos → lista todos os hábitos, já com status calculado
router.get("/", (req, res) => {
  const habitos = lerHabitos();
  const hoje = dataDeHoje();

  const habitosComStatus = habitos.map((habito) => ({
    ...habito,
    concluidoHoje: habito.diasConcluidos.includes(hoje),
    streakAtual: calcularStreak(habito.diasConcluidos),
  }));

  res.json(habitosComStatus);
});

// POST /habitos → cria um hábito novo
router.post("/", (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
  }

  const habitos = lerHabitos();

  const novoHabito = {
    id: Date.now(),
    nome,
    diasConcluidos: [],
  };

  habitos.push(novoHabito);
  salvarHabitos(habitos);

  res.status(201).json(novoHabito); // 201 = "Created"
});

// PUT /habitos/:id/concluir → marca o hábito como concluído hoje
router.put("/:id/concluir", (req, res) => {
  const { id } = req.params;
  const habitos = lerHabitos();
  const hoje = dataDeHoje();

  const habito = habitos.find((h) => h.id === Number(id));

  if (!habito) {
    return res.status(404).json({ erro: "Hábito não encontrado" });
  }

  if (!habito.diasConcluidos.includes(hoje)) {
    habito.diasConcluidos.push(hoje);
    salvarHabitos(habitos);
  }

  res.json(habito);
});

// DELETE /habitos/:id → remove um hábito
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const habitos = lerHabitos();

  const habitosFiltrados = habitos.filter((h) => h.id !== Number(id));

  if (habitosFiltrados.length === habitos.length) {
    return res.status(404).json({ erro: "Hábito não encontrado" });
  }

  salvarHabitos(habitosFiltrados);
  res.status(204).send();
});

// Exporta o router pra ser usado no server.js
module.exports = router;
