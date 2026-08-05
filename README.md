# 🎯 Habit Tracker

Aplicação fullstack para acompanhamento de hábitos diários, com cálculo automático de sequência (streak) de dias consecutivos.

🔗 **[Ver projeto ao vivo](https://vinivenegeroles.github.io/habit-tracker/)**

> ⚠️ O back-end está hospedado no plano gratuito do Render, que "dorme" após períodos de inatividade. A primeira requisição pode levar até ~50 segundos para responder — as próximas são instantâneas.

<!-- 🎥 Se tiver o GIF/vídeo pronto, descomenta e ajusta o link abaixo:
![Demo do Habit Tracker](link-do-gif-aqui)
-->

## 📋 Sobre o projeto

O Habit Tracker permite criar hábitos, marcá-los como concluídos no dia e acompanhar quantos dias seguidos cada hábito vem sendo mantido. O status (concluído ou pendente) e o streak não ficam salvos fixos no banco — são **calculados dinamicamente** a cada requisição, a partir do histórico de datas concluídas, evitando dados inconsistentes.

## 🚀 Tecnologias utilizadas

**Back-end**

- Node.js
- Express
- CORS (restrito às origens de produção e desenvolvimento)
- Persistência em arquivo JSON

**Front-end**

- HTML5
- CSS3
- JavaScript puro (Fetch API, manipulação de DOM, delegação de eventos)

**Deploy**

- Back-end: [Render](https://render.com)
- Front-end: [GitHub Pages](https://pages.github.com)

## ✨ Funcionalidades

- ✅ Criar novo hábito
- ✅ Marcar hábito como concluído no dia
- ✅ Cálculo automático de streak (dias seguidos)
- ✅ Excluir hábito
- ✅ Interface responsiva e sem dependência de frameworks

## 📁 Estrutura do projeto

```
habit-tracker/
├── backend/
│   ├── data/
│   │   └── habitos.json      # "Banco de dados" em arquivo
│   ├── routes/
│   │   └── habitos.js        # Rotas da API (CRUD + lógica de streak)
│   ├── server.js             # Ponto de entrada do servidor Express
│   └── package.json
└── docs/                     # Front-end (nome exigido pelo GitHub Pages)
    ├── index.html
    ├── style.css
    └── script.js
```

## 🔌 Rotas da API

| Método | Rota                    | Descrição                                   |
| ------ | ----------------------- | ------------------------------------------- |
| GET    | `/habitos`              | Lista todos os hábitos com status calculado |
| POST   | `/habitos`              | Cria um novo hábito                         |
| PUT    | `/habitos/:id/concluir` | Marca o hábito como concluído hoje          |
| DELETE | `/habitos/:id`          | Remove um hábito                            |

## 💻 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) instalado (versão LTS recomendada)

### Back-end

```bash
cd backend
npm install
node server.js
```

O servidor sobe em `http://localhost:3000`.

### Front-end

Abra o arquivo `docs/index.html` diretamente no navegador, ou sirva com uma extensão como o Live Server do VS Code.

> Por padrão, o front aponta para a API em produção. Para testar contra o back-end local, altere a constante `API_URL` no `docs/script.js` para `http://localhost:3000/habitos`.

## 🧠 Aprendizados

Este foi meu primeiro projeto fullstack em JavaScript, vindo de uma base em Java. Alguns pontos que aprofundei durante o desenvolvimento:

- Diferença entre CORS em desenvolvimento e produção, e como restringi-lo por origem
- Cálculo de dados derivados (streak) em tempo real em vez de persisti-los, evitando inconsistência
- `async/await` e `fetch` para comunicação entre front e back
- Deploy separado de front-end (estático) e back-end (servidor Node) em serviços diferentes

## 👤 Autor

**Vinicius**
[GitHub](https://github.com/ViniVenegeroles)
