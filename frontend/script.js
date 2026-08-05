// URL base da nossa API
const API_URL = "http://localhost:3000/habitos";

// Pega as referências dos elementos HTML que vamos manipular
const form = document.getElementById("form-novo-habito");
const input = document.getElementById("input-nome-habito");
const listaHabitos = document.getElementById("lista-habitos");

// Busca todos os hábitos na API e renderiza na tela
async function carregarHabitos() {
  const resposta = await fetch(API_URL); // GET por padrão
  const habitos = await resposta.json(); // converte a resposta em objeto/array JS

  renderizarHabitos(habitos);
}

// Recebe o array de hábitos e monta o HTML de cada um dentro da <ul>
function renderizarHabitos(habitos) {
  // Limpa a lista antes de redesenhar (evita duplicar itens)
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

    // Template string (crase ``) permite interpolar variáveis com ${}
    // Isso é bem mais legível que concatenação de string com "+"
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

// Captura o envio do formulário (criar hábito novo)
form.addEventListener("submit", async (evento) => {
  evento.preventDefault(); // impede o recarregamento padrão da página no submit

  const nome = input.value.trim(); // remove espaços em branco nas pontas

  if (!nome) return; // proteção extra, embora o "required" do HTML já ajude

  // Faz a requisição POST pra API
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // avisa que o corpo é JSON
    body: JSON.stringify({ nome }), // converte o objeto JS em texto JSON
  });

  input.value = ""; // limpa o campo de texto
  carregarHabitos(); // recarrega a lista pra mostrar o hábito novo
});

// Captura cliques na lista de hábitos (delegação de evento)
// Em vez de um listener por botão, um listener só na <ul> que "escuta" tudo dentro dela
listaHabitos.addEventListener("click", async (evento) => {
  const id = evento.target.dataset.id; // pega o data-id do elemento clicado

  if (!id) return; // clicou em algo sem data-id, ignora

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
