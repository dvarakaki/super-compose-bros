// FASE 5 — Variáveis de Ambiente e depends_on: Gustavo
const FASE_INFO = {
  id: 5,
  titulo: "Variáveis de Ambiente e depends_on",
  subtitulo: "Configuração segura e ordem de inicialização",
  icone: "⚙️"
};

const QUESTIONS = [
  {
    question: "O Docker Compose lê automaticamente arquivos de configuração locais para carregar variáveis de ambiente de forma segura. Qual é o nome padrão desse arquivo oculto que deve ficar na raiz do projeto e ser ignorado no Git?",
    options: [
      ".env",
      "docker.env",
      "environment.config",
      "compose.env"
    ],
    correct: 0,
    explanation: "O arquivo .env é detectado automaticamente pelo Docker Compose na raiz do diretório de execução para injetar variáveis e interpolar valores no arquivo compose.yml."
  },
  {
    question: "Por padrão, quando adicionamos simplesmente a instrução 'depends_on' para vincular a API ao Banco de Dados, o que o Docker Compose aguarda para iniciar o serviço dependente?",
    options: [
      "Ele aguarda o container do banco de dados ter finalizado a execução com sucesso (Exit Code 0).",
      "Ele realiza um ping na porta mapeada até obter uma resposta positiva.",
      "Ele aguarda apenas o container do banco de dados iniciar (entrar em estado de execução).",
      "Ele aguarda o container do banco de dados estar pronto para receber conexões de rede."
    ],
    correct: 2,
    explanation: "Por padrão, o depends_on apenas garante a ordem de inicialização dos containers, sem verificar se o serviço interno está saudável ou pronto."
  },
  {
    question: "Se você precisa garantir que a sua API só inicie quando o container do banco de dados estiver totalmente pronto para receber conexões (e não apenas iniciado), qual condição deve ser associada ao 'depends_on'?",
    options: [
      "condition: service_completed_successfully",
      "condition: service_started",
      "condition: service_healthy",
      "condition: network_ready"
    ],
    correct: 2,
    explanation: "A condição service_healthy instrui o Compose a aguardar até que o healthcheck configurado no container pai retorne sucesso antes de liberar a inicialização do dependente."
  },
  {
    question: "Dentro da configuração de um 'healthcheck' no Docker Compose, qual parâmetro define o tempo de tolerância inicial (tempo de 'graça') para a aplicação inicializar antes de começar a contar as falhas de saúde?",
    options: [
      "timeout",
      "retries",
      "interval",
      "start_period"
    ],
    correct: 3,
    explanation: "O start_period fornece um período de inicialização onde as falhas do healthcheck são desconsideradas, ideal para aplicações pesadas que demoram a subir."
  }
];
