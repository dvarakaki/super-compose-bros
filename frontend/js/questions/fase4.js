// FASE 4 — Networking e Volumes: Igor
const FASE_INFO = {
  id: 4,
  titulo: "Networking e Volumes",
  subtitulo: "Comunicação e persistência de dados",
  icone: "🌐"
};

const QUESTIONS = [
  {
    question: "Como um container 'api' acessa o container 'db' em uma rede Docker Compose?",
    options: [
      "Via localhost:5432",
      "Via 127.0.0.1:5432",
      "Via o nome do serviço: db:5432",
      "Precisa configurar o IP manualmente no docker-compose.yml"
    ],
    correct: 2,
    explanation: "O Docker Compose registra cada serviço pelo nome na rede interna. 'api' acessa 'db' usando o hostname 'db', não localhost."
  },
  {
    question: "O que acontece com os dados de um banco de dados num container quando ele é removido sem volume configurado?",
    options: [
      "Os dados são sincronizados automaticamente com o host",
      "Os dados são perdidos permanentemente",
      "Os dados ficam em cache no Docker Engine",
      "Os dados são exportados como backup automático"
    ],
    correct: 1,
    explanation: "Sem volume, os dados ficam apenas na camada de escrita do container. Ao remover o container, tudo se perde. Volumes resolvem isso."
  },
  {
    question: "Qual a principal diferença entre um named volume e um bind mount?",
    options: [
      "Named volumes são temporários; bind mounts são permanentes",
      "Named volumes são gerenciados pelo Docker; bind mounts mapeiam um diretório específico do host",
      "Bind mounts só funcionam em Linux; named volumes funcionam em qualquer OS",
      "Não há diferença prática entre os dois"
    ],
    correct: 1,
    explanation: "Named volumes: Docker gerencia onde ficam os dados. Bind mounts: você aponta exatamente qual diretório do host usar."
  },
  {
    question: "Para que serve o bloco 'networks:' no nível raiz do docker-compose.yml?",
    options: [
      "Para bloquear a comunicação entre containers",
      "Para definir redes customizadas que os serviços podem usar, além da rede default",
      "Para configurar o DNS externo dos containers",
      "Para definir a velocidade máxima de rede de cada container"
    ],
    correct: 1,
    explanation: "Você pode criar redes nomeadas customizadas e atribuir serviços a elas, permitindo isolamento ou comunicação controlada entre grupos de containers."
  },
  {
    question: "Como declarar um named volume 'pgdata' e usá-lo no serviço 'db'?",
    options: [
      "Basta escrever 'volume: pgdata' dentro do serviço",
      "Declarar em 'volumes:' no nível raiz e referenciar em 'volumes:' dentro do serviço com 'pgdata:/caminho'",
      "Usar 'bind: pgdata:/caminho' dentro do serviço",
      "Named volumes são criados automaticamente, não precisam ser declarados"
    ],
    correct: 1,
    explanation: "Named volumes precisam ser declarados na seção 'volumes:' raiz do arquivo e referenciados dentro de cada serviço que os utiliza."
  }
];
