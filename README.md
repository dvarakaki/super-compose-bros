# Super Compose Bros

Jogo educativo sobre Docker Compose com estética retrô. O jogador navega por um mapa de fases, estuda o conteúdo em slides e responde quizzes para liberar a próxima fase. Ao completar todas as 6 fases, o portal final abre e o jogador enfrenta o Boss — um jogo de ação no browser.

## Fluxo do jogo

```
Login → Mapa de fases → Slides de conteúdo → Quiz → (repetir por 6 fases) → Boss Final
```

1. **Login** — o jogador informa um username. Um registro é criado (ou recuperado) no banco.
2. **Mapa** — tela animada com fases representadas por personagens. Cada fase se desbloqueia ao concluir a anterior.
3. **Slides** — ao clicar em COMEÇAR, o jogador assiste a um livro de slides com o conteúdo da fase.
4. **Quiz** — 4 a 5 perguntas sobre o conteúdo. O score é salvo no banco ao concluir.
5. **Boss Final** — jogo de ação (mago vs boss) desbloqueado após completar todas as 6 fases.
6. **Ranking** — placar global com os scores de todos os jogadores.

## Temas por fase

| Fase | Personagem | Conteúdo |
|------|------------|----------|
| 1 | Edu | Introdução ao Docker Compose |
| 2 | Felipe | Ports, Networks e Volumes |
| 3 | Arakaki | Services, Build e Images |
| 4 | Igor | Networking e Volumes avançado |
| 5 | Gustavo | Variáveis de ambiente e depends_on |
| 6 | Rafa | Comandos e ciclo de vida |
| 7 | — | Boss Final (`index.html`) |

## Estrutura do projeto

```
super-compose-bros/
├── index.html                  # Boss Final (fase 7)
├── frontend/
│   ├── mapa.html               # Mapa de fases (entrada do jogo)
│   ├── login.html              # Tela de login
│   ├── quiz.html               # Engine do quiz
│   ├── ranking.html            # Placar global
│   ├── assets/
│   │   ├── css/style.css
│   │   ├── images/             # Sprites, personagens e fundos
│   │   └── media/              # Vídeos e áudio
│   └── js/
│       ├── quiz.js             # Lógica do quiz (timer, score, progresso)
│       └── questions/
│           ├── fase1.js
│           ├── fase2.js
│           ├── fase3.js
│           ├── fase4.js
│           ├── fase5.js
│           └── fase6.js
├── backend/
│   ├── server.js               # API REST (Express + PostgreSQL)
│   └── package.json
└── database/
    ├── migrations/
    │   ├── V001_create_user_table.sql
    │   └── V002_create_fase_scores.sql
    └── modeling/
        └── compose-bros-logical-model.png
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

## Configuração e execução

### 1. Banco de dados

Crie o banco e execute as migrations:

```bash
createdb super_compose_bros

psql super_compose_bros -f database/migrations/V001_create_user_table.sql
psql super_compose_bros -f database/migrations/V002_create_fase_scores.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env`:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/super_compose_bros
PORT=3000
```

Inicie o servidor:

```bash
npm start
# ou em modo desenvolvimento (reload automático):
npm run dev
```

O servidor sobe em `http://localhost:3000`.

### 3. Frontend

Abra `frontend/login.html` diretamente no browser ou sirva a raiz do projeto com qualquer servidor estático:

```bash
# Exemplo com npx
npx serve .
```

Acesse `http://localhost:3000` (ou a porta do serve) e navegue para `frontend/login.html`.

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/login` | Cria ou recupera usuário por username |
| `POST` | `/api/score` | Incrementa score do usuário |
| `GET` | `/api/ranking` | Retorna todos os jogadores ordenados por score |

### POST /api/login

```json
// Request
{ "username": "carlinhos" }

// Response
{ "id": 1, "username": "carlinhos", "score": 0, "is_admin": false }
```

### POST /api/score

```json
// Request
{ "user_id": 1, "score": 3 }

// Response
{ "id": 1, "username": "carlinhos", "score": 3 }
```

### GET /api/ranking

```json
[
  { "username": "carlinhos", "score": 18 },
  { "username": "igor", "score": 15 }
]
```

## Adicionando perguntas

Cada fase tem seu arquivo em `frontend/js/questions/faseN.js`. Para editar ou adicionar perguntas:

```js
const QUESTIONS = [
  {
    question: "Texto da pergunta",
    options: ["A", "B", "C", "D"],
    correct: 2,           // índice da opção correta (0-based)
    explanation: "Explicação exibida após a resposta."
  }
];
```
