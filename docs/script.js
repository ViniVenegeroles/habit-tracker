const API_URL = "https://habit-tracker-api-f3w0.onrender.com/habitos";

const form = document.getElementById("form-novo-habito");
const input = document.getElementById("input-nome-habito");
const listaHabitos = document.getElementById("lista-habitos");

// Busca todos os hábitos na API e renderiza na tela
async function carregarHabitos() {
  const resposta = await fetch(API_URL);
  const habitos = await resposta.json(); // converte a resposta em objeto/array JS

  renderizarHabitos(habitos);
}

function renderizarHabitos(habitos) {
  listaHabitos.innerHTML = "";

  // Se não tiver nenhum hábito, mostra uma mensagem amigável
  if (habitos.length === 0) {
    listaHabitos.innerHTML =
      '<p style="color: #71717a;">Nenhum hábito ainda. Adicione um acima!</p>';
    return;
  }

  // Para cada hábito, cria um <li> e insere na lista
  habitos.forEach((habito) => {
    const li = document.createElement("li");
    li.className = "habito";

    li.innerHTML = `
      <div class="habito-info">
        <span class="habito-nome">${habito.nome}</span>
        <span class="habito-streak">🔥 ${habito.streakAtual} dia(s) seguido(s)</span>
      </div>
      <div class="habito-acoes">
        <button 
          class="btn-concluir ${habito.concluidoHoje ? "concluido" : ""}" 
          data-id="${habito.id}"
        >
          ${habito.concluidoHoje ? "✓ Feito" : "Marcar feito"}
        </button>
        <button class="btn-excluir" data-id="${habito.id}">✕</button>
      </div>
    `;

    listaHabitos.appendChild(li);
  });
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = input.value.trim();

  if (!nome) return;

  // Faz a requisição POST pra API
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });

  input.value = "";
  carregarHabitos();
});

// Captura cliques na lista de hábitos (delegação de evento)
// Em vez de um listener por botão, um listener só na <ul> que "escuta" tudo dentro dela
listaHabitos.addEventListener("click", async (evento) => {
  const id = evento.target.dataset.id;

  if (!id) return;

  // Verifica se clicou no botão de concluir
  if (evento.target.classList.contains("btn-concluir")) {
    await fetch(`${API_URL}/${id}/concluir`, { method: "PUT" });
    carregarHabitos();
  }

  // Verifica se clicou no botão de excluir
  if (evento.target.classList.contains("btn-excluir")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarHabitos();
  }
});

// Carrega os hábitos assim que a página abre
carregarHabitos();
