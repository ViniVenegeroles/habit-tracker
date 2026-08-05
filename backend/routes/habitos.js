// Módulo nativo do Node.js para trabalhar com arquivos
// (equivalente ao java.io / java.nio que você já usou no Task CLI)
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
  // toISOString() gera algo tipo "2026-08-04T15:30:00.000Z"
  // o split('T')[0] pega só a parte "2026-08-04"
}

// Calcula quantos dias seguidos (streak) o hábito foi concluído,
// contando a partir de hoje pra trás
function calcularStreak(diasConcluidos) {
  let streak = 0;
  let dataAtual = new Date();

  // Vai voltando dia a dia enquanto encontrar a data no array
  while (true) {
    const dataFormatada = dataAtual.toISOString().split("T")[0];

    if (diasConcluidos.includes(dataFormatada)) {
      streak++;
      dataAtual.setDate(dataAtual.getDate() - 1); // volta um dia
    } else {
      break; // quebrou a sequência, para de contar
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

  // .map() percorre o array e devolve um NOVO array transformado
  // (parecido com .stream().map() do Java)
  const habitosComStatus = habitos.map((habito) => ({
    ...habito, // spread: copia todos os campos do hábito original
    concluidoHoje: habito.diasConcluidos.includes(hoje),
    streakAtual: calcularStreak(habito.diasConcluidos),
  }));

  res.json(habitosComStatus);
});

// POST /habitos → cria um hábito novo
router.post("/", (req, res) => {
  const { nome } = req.body; // desestrutura o corpo da requisição

  if (!nome) {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
  }

  const habitos = lerHabitos();

  const novoHabito = {
    id: Date.now(), // usa o timestamp atual como ID único (simples e sem colisão)
    nome,
    diasConcluidos: [],
  };

  habitos.push(novoHabito);
  salvarHabitos(habitos);

  res.status(201).json(novoHabito); // 201 = "Created"
});

// PUT /habitos/:id/concluir → marca o hábito como concluído hoje
router.put("/:id/concluir", (req, res) => {
  const { id } = req.params; // pega o :id da URL
  const habitos = lerHabitos();
  const hoje = dataDeHoje();

  // .find() procura o primeiro elemento que bate com a condição
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

  // .filter() devolve um novo array SEM o item que bate com a condição
  const habitosFiltrados = habitos.filter((h) => h.id !== Number(id));

  if (habitosFiltrados.length === habitos.length) {
    return res.status(404).json({ erro: "Hábito não encontrado" });
  }

  salvarHabitos(habitosFiltrados);
  res.status(204).send(); // 204 = "No Content" (sucesso sem corpo de resposta)
});

// Exporta o router pra ser usado no server.js
module.exports = router;
