// FASE 6 - Comandos e Ciclo de Vida: Rafa
const FASE_INFO = {
  id: 6,
  titulo: "Comandos e Ciclo de Vida",
  subtitulo: "Gerenciando sua aplicacao Compose",
  icone: "⚡"
};

const QUESTIONS = [
  {
    question: "Se voce rodar o docker compose up -d, o que acontece com o seu terminal?",
    options: [
      "Ele fecha automaticamente e encerra a execucao do Docker Compose.",
      "Ele fica travado mostrando todas as mensagens de erro e logs dos containers em tempo real.",
      "Ele fica livre para voce continuar usando, porque o ambiente roda em segundo plano (background).",
      "Ele abre uma janela separada para cada container que foi instanciado."
    ],
    correct: 2,
    explanation: "O -d significa detached: os containers continuam rodando em background e o terminal fica livre."
  },
  {
    question: "De acordo com o roteiro, qual a diferenca pratica entre os comandos down e ps?",
    options: [
      "O down e o comando principal para ler o arquivo YAML, enquanto o ps serve para limpar as sobras do computador.",
      "O down para os containers e remove as redes criadas, enquanto o ps serve para conferir se tudo subiu corretamente.",
      "O down monitora os erros do sistema, enquanto o ps forca o reinicio rapido dos servicos.",
      "Ambos fazem a mesma coisa, mas o down e usado em desenvolvimento e o ps em producao."
    ],
    correct: 1,
    explanation: "docker compose down encerra e limpa recursos; docker compose ps mostra o estado dos servicos."
  },
  {
    question: "Se voce fizer uma alteracao no Dockerfile da sua aplicacao, apenas usar o docker compose up nao vai mostrar a mudanca. O que voce deve fazer?",
    options: [
      "Usar o comando docker compose exec para abrir o terminal do banco de dados.",
      "Usar o comando docker compose build para que o Compose atualize a imagem com as novas mudancas.",
      "Deletar o arquivo docker-compose.override.yml do seu computador.",
      "Usar o comando docker compose logs para forcar a atualizacao do codigo."
    ],
    correct: 1,
    explanation: "docker compose build reconstruiu a imagem depois de alteracoes no Dockerfile ou dependencias."
  },
  {
    question: "Pensando no cenario do Slide 3, se um desenvolvedor Frontend quer subir o Banco e o Backend sem rodar ferramentas de teste pesadas, qual recurso do Compose ele deve ativar?",
    options: [
      "O arquivo .env",
      "O comando docker compose restart",
      "Os Profiles",
      "O docker-compose.override.yml"
    ],
    correct: 2,
    explanation: "Profiles permitem iniciar apenas os servicos necessarios para um cenario especifico."
  },
  {
    question: "Por que utilizamos o arquivo docker-compose.override.yml?",
    options: [
      "Para esconder senhas e chaves de API importantes da equipe.",
      "Para rodar comandos de teste dentro de um container que ja esta ativo.",
      "Para aplicar configuracoes que so valem no seu proprio computador, como o modo debug.",
      "Para garantir a imutabilidade e salvar os dados fora do container."
    ],
    correct: 2,
    explanation: "O override separa ajustes locais de desenvolvimento sem alterar a configuracao base compartilhada."
  }
];
