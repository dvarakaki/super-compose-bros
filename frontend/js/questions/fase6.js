// FASE 6 — Comandos e Ciclo de Vida: Rafa
const FASE_INFO = {
  id: 6,
  titulo: "Comandos e Ciclo de Vida",
  subtitulo: "Gerenciando sua aplicação Compose",
  icone: "⚡"
};

const QUESTIONS = [
  {
    question: "Qual comando sobe os containers em modo background (detached)?",
    options: [
      "docker compose up",
      "docker compose up -d",
      "docker compose start -b",
      "docker compose run --detach"
    ],
    correct: 1,
    explanation: "O flag '-d' (detached) faz os containers rodarem em background, liberando o terminal. Sem ele, os logs aparecem diretamente."
  },
  {
    question: "Como você para e remove todos os containers, redes e volumes criados pelo Compose?",
    options: [
      "docker compose stop",
      "docker compose kill",
      "docker compose down",
      "docker compose rm"
    ],
    correct: 2,
    explanation: "'docker compose down' para e remove containers e redes. Com '--volumes' também remove os volumes. 'stop' apenas para, sem remover."
  },
  {
    question: "Como ver os logs em tempo real de um serviço específico chamado 'api'?",
    options: [
      "docker compose log api",
      "docker compose logs -f api",
      "docker compose watch api",
      "docker logs api --follow"
    ],
    correct: 1,
    explanation: "'docker compose logs -f api' segue os logs do serviço 'api' em tempo real. O '-f' é de 'follow', igual ao 'tail -f'."
  },
  {
    question: "Qual comando reconstrói as imagens e reinicia os containers atualizados?",
    options: [
      "docker compose restart",
      "docker compose refresh",
      "docker compose up --build",
      "docker compose rebuild"
    ],
    correct: 2,
    explanation: "'docker compose up --build' reconstrói as imagens antes de subir. Ideal quando você mudou o Dockerfile ou as dependências."
  },
  {
    question: "Como executar um comando dentro de um container em execução no serviço 'api'?",
    options: [
      "docker compose run api <comando>",
      "docker compose exec api <comando>",
      "docker compose shell api <comando>",
      "docker compose attach api <comando>"
    ],
    correct: 1,
    explanation: "'exec' roda um comando num container já em execução. 'run' cria um novo container temporário para rodar o comando."
  }
];
