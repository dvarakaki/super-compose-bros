// FASE 2 — Ports, Networks e Volumes: Felipe
const FASE_INFO = {
  id: 2,
  titulo: "Ports, Networks e Volumes",
  subtitulo: "Expondo serviços e persistindo dados",
  icone: "🔌"
};

const QUESTIONS = [
  {
    question: "No docker-compose.yml, o que faz a configuração 'ports: - \"8080:3000\"'?",
    options: [
      "Cria dois containers: um na porta 8080 e outro na porta 3000",
      "Mapeia a porta 8080 do host para a porta 3000 do container",
      "Bloqueia as portas 8080 e 3000 por segurança",
      "Define a porta máxima e mínima do container"
    ],
    correct: 1,
    explanation: "O formato é HOST:CONTAINER. A porta 8080 da sua máquina redireciona para a porta 3000 dentro do container."
  },
  {
    question: "Qual a diferença entre 'ports' e 'expose' no Docker Compose?",
    options: [
      "Não há diferença, ambos publicam a porta externamente",
      "'expose' publica a porta para o host; 'ports' apenas para outros containers",
      "'ports' publica a porta para o host; 'expose' apenas documenta/disponibiliza para outros containers na mesma rede",
      "'expose' é para IPv6 e 'ports' para IPv4"
    ],
    correct: 2,
    explanation: "'expose' não publica no host — serve apenas para comunicação interna entre containers na mesma rede e documentação."
  },
  {
    question: "O que é um named volume no Docker Compose?",
    options: [
      "Um volume com nome de arquivo específico",
      "Um volume gerenciado pelo Docker que persiste dados além do ciclo de vida do container",
      "Um volume temporário que é apagado ao reiniciar o container",
      "Um alias para um caminho do host"
    ],
    correct: 1,
    explanation: "Named volumes são gerenciados pelo Docker Engine e persistem mesmo quando o container é removido. Ideal para bancos de dados."
  },
  {
    question: "No Docker Compose, o que faz 'volumes: - ./data:/var/lib/postgresql/data'?",
    options: [
      "Copia os arquivos de ./data para dentro do container na inicialização",
      "Monta o diretório ./data do host em /var/lib/postgresql/data dentro do container (bind mount)",
      "Cria um volume chamado 'data' e o mapeia para o Postgres",
      "Faz backup automático dos dados do Postgres para ./data"
    ],
    correct: 1,
    explanation: "Bind mount: mapeia um caminho do host diretamente no container. Mudanças em ./data são refletidas imediatamente dentro do container."
  },
  {
    question: "Como containers de diferentes serviços se comunicam no Docker Compose?",
    options: [
      "Via localhost, igual ao host",
      "Só via endereço IP fixo configurado manualmente",
      "Pelo nome do serviço definido no docker-compose.yml, pois o Compose cria uma rede interna automaticamente",
      "Precisam de um load balancer externo para se comunicar"
    ],
    correct: 2,
    explanation: "O Docker Compose cria uma rede default e registra cada serviço por nome. Um container 'api' acessa o 'db' pelo hostname 'db'."
  }
];
