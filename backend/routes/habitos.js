const express = require("express");
const pool = require("../db");
const router = express.Router();

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
    const encontrou = diasConcluidos.some(
      (d) => new Date(d).toISOString().split("T")[0] === dataFormatada,
    );
    if (!encontrou) break;
    streak++;
    dataAtual.setDate(dataAtual.getDate() - 1);
  }

  return streak;
}

router.get("/", async (req, res) => {
  const resultado = await pool.query("SELECT * FROM habitos ORDER BY id");
  const hoje = dataDeHoje();

  const habitosComStatus = resultado.rows.map((habito) => {
    const diasConcluidos = habito.dias_concluidos.map(
      (d) => new Date(d).toISOString().split("T")[0],
    );

    return {
      id: habito.id,
      nome: habito.nome,
      diasConcluidos,
      concluidoHoje: diasConcluidos.includes(hoje),
      streakAtual: calcularStreak(habito.dias_concluidos),
    };
  });

  res.json(habitosComStatus);
});

router.post("/", async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
  }

  const resultado = await pool.query(
    "INSERT INTO habitos (nome) VALUES ($1) RETURNING *",
    [nome],
  );

  res.status(201).json(resultado.rows[0]);
});

router.put("/:id/concluir", async (req, res) => {
  const { id } = req.params;
  const hoje = dataDeHoje();

  const busca = await pool.query("SELECT * FROM habitos WHERE id = $1", [id]);

  if (busca.rows.length === 0) {
    return res.status(404).json({ erro: "Hábito não encontrado" });
  }

  // array_append só adiciona a data se ainda não estiver no array,
  // evitando duplicar o mesmo dia
  const resultado = await pool.query(
    `UPDATE habitos 
     SET dias_concluidos = 
       CASE 
         WHEN $2 = ANY(dias_concluidos) THEN dias_concluidos
         ELSE array_append(dias_concluidos, $2::date)
       END
     WHERE id = $1
     RETURNING *`,
    [id, hoje],
  );

  res.json(resultado.rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const resultado = await pool.query(
    "DELETE FROM habitos WHERE id = $1 RETURNING *",
    [id],
  );

  if (resultado.rows.length === 0) {
    return res.status(404).json({ erro: "Hábito não encontrado" });
  }

  res.status(204).send();
});

module.exports = router;
