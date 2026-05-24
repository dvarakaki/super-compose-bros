// FASE 3 — Services, Build e Images: Arakaki
const FASE_INFO = {
  id: 3,
  titulo: "Services, Build e Images",
  subtitulo: "Construindo e configurando serviços",
  icone: "🔨"
};

const QUESTIONS = [
  {
    question: "Qual é o bloco principal do docker-compose.yml onde você define os containers?",
    options: [
      "containers",
      "services",
      "apps",
      "processes"
    ],
    correct: 1,
    explanation: "O bloco 'services' é o coração do docker-compose.yml. Cada entrada dentro dele define um container com suas configurações."
  },
  {
    question: "Quando você deve usar 'image:' em vez de 'build:' em um serviço?",
    options: [
      "Sempre, pois é mais rápido",
      "Quando a imagem é sua aplicação principal",
      "Quando usar dependências prontas como banco de dados, cache ou broker (ex: image: postgres:16)",
      "Apenas em ambiente de produção"
    ],
    correct: 2,
    explanation: "'image' é ideal para serviços de infraestrutura prontos (postgres, redis, rabbitmq). 'build' é para sua aplicação que tem um Dockerfile."
  },
  {
    question: "O que o campo 'context' dentro de 'build:' define?",
    options: [
      "O nome do container após o build",
      "O diretório onde o Docker procura o Dockerfile e os arquivos do projeto",
      "A versão do Docker Engine a ser usada",
      "O namespace do registry onde a imagem será publicada"
    ],
    correct: 1,
    explanation: "'context' define o diretório de build — de onde o Docker lê o Dockerfile e os arquivos que serão copiados para a imagem."
  },
  {
    question: "O que acontece quando você roda 'docker compose build'?",
    options: [
      "Sobe todos os containers definidos no arquivo",
      "Constrói as imagens sem subir os containers",
      "Baixa as imagens do registry",
      "Remove as imagens existentes e reconstrói"
    ],
    correct: 1,
    explanation: "'docker compose build' apenas constrói as imagens dos serviços que usam 'build:'. Para subir, use 'docker compose up'."
  },
  {
    question: "No docker-compose.yml, como você define que um serviço deve ser construído a partir de um Dockerfile na pasta './backend'?",
    options: [
      "image: ./backend",
      "dockerfile: ./backend",
      "build: ./backend",
      "context: ./backend/Dockerfile"
    ],
    correct: 2,
    explanation: "'build: ./backend' instrui o Compose a procurar um Dockerfile em ./backend e construir a imagem a partir dele."
  }
];
