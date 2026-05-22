// FASE 1 — Introdução: O que é Docker Compose?
const FASE_INFO = {
  id: 1,
  titulo: "Introdução",
  subtitulo: "O que é Docker Compose?",
  icone: "🌊"
};

const QUESTIONS = [
  {
    question: "O que é o Docker Compose?",
    options: [
      "Uma linguagem de programação para containers",
      "Uma ferramenta para definir e rodar aplicações multi-container com um único arquivo de configuração",
      "Um sistema operacional baseado em containers",
      "Um substituto completo do Docker Engine"
    ],
    correct: 1,
    explanation: "Docker Compose permite definir serviços, redes e volumes em um arquivo YAML e subir tudo com um único comando."
  },
  {
    question: "Qual é o nome padrão do arquivo de configuração do Docker Compose?",
    options: [
      "dockerfile.yml",
      "container-config.yaml",
      "docker-compose.yml",
      "compose.json"
    ],
    correct: 2,
    explanation: "O arquivo padrão é 'docker-compose.yml' (ou 'compose.yaml' nas versões mais recentes)."
  },
  {
    question: "Qual problema principal o Docker Compose resolve?",
    options: [
      "Criar imagens Docker menores",
      "Substituir o Kubernetes em produção",
      "Orquestrar múltiplos containers que precisam trabalhar juntos",
      "Compilar código-fonte mais rápido"
    ],
    correct: 2,
    explanation: "Quando sua aplicação precisa de vários serviços (app + banco + cache), o Compose gerencia tudo junto."
  },
  {
    question: "Em qual formato é escrito o arquivo docker-compose.yml?",
    options: [
      "JSON",
      "XML",
      "TOML",
      "YAML"
    ],
    correct: 3,
    explanation: "YAML (Yet Another Markup Language) é o formato usado pelo Docker Compose — legível por humanos e baseado em indentação."
  },
  {
    question: "Qual comando sobe todos os serviços definidos no docker-compose.yml?",
    options: [
      "docker-compose start",
      "docker-compose run",
      "docker-compose up",
      "docker-compose launch"
    ],
    correct: 2,
    explanation: "'docker-compose up' cria e inicia todos os containers. Use '-d' para rodar em background (detached)."
  }
];