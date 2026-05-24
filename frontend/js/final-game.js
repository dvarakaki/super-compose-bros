// ===== ESCALA DA VIEWPORT =====
const GAME_W = 1542;
const GAME_H = 728;

function ajustarEscala() {
  const scale = Math.min(
    window.innerWidth / GAME_W,
    window.innerHeight / GAME_H,
  );
  const offsetX = (window.innerWidth - GAME_W * scale) / 2;
  const offsetY = (window.innerHeight - GAME_H * scale) / 2;

  const root = document.getElementById("game-root");
  root.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

  const emTelaCheia = window.innerHeight === screen.height;
  const cenario = document.getElementById("cenario");
  const topExtra = emTelaCheia ? 0 : 0;

  cenario.src = emTelaCheia
    ? "assets/images/fundo-tela-cheia.png"
    : "assets/images/fundo.png";

  if (emTelaCheia) {
    const descer = 315;
    cenario.style.width = "100%";
    cenario.style.height = `calc(100% + ${descer}px)`;
    cenario.style.left = "0px";
    cenario.style.top = `-${topExtra}px`;
  } else {
    const scaleCover = Math.max(
      window.innerWidth / GAME_W,
      window.innerHeight / GAME_H,
    );
    const cenarioW = GAME_W * scaleCover;
    const cenarioH = GAME_H * scaleCover;
    cenario.style.width = cenarioW + "px";
    cenario.style.height = cenarioH + "px";
    cenario.style.left = (window.innerWidth - cenarioW) / 2 + "px";
    cenario.style.top = (window.innerHeight - cenarioH) / 2 + "px";
  }
}

function getScale() {
  return Math.min(window.innerWidth / GAME_W, window.innerHeight / GAME_H);
}

ajustarEscala();
window.addEventListener("resize", ajustarEscala);
document.addEventListener("fullscreenchange", ajustarEscala);

function toGameCoords(rect) {
  const scale = getScale();
  const offsetX = (window.innerWidth - GAME_W * scale) / 2;
  const offsetY = (window.innerHeight - GAME_H * scale) / 2;
  return {
    left: (rect.left - offsetX) / scale,
    right: (rect.right - offsetX) / scale,
    top: (rect.top - offsetY) / scale,
    bottom: (rect.bottom - offsetY) / scale,
  };
}

// ===== CABEÇAS DISPONÍVEIS =====

const cabecas = [
  {
    src: "assets/images/igor-careca.png",
    top: "-31px",
    leftEsq: "-2.5px",
    leftDir: "-2px",
    width: "105px",
    height: "140px",
    objectPosition: "center",
    borderRadius: "50%",
    espelhar: true,
  },
  {
    src: "assets/images/souza-careca.png",
    top: "-33px",
    leftEsq: "-2.5px",
    leftDir: "-2px",
    width: "105px",
    height: "130px",
    objectPosition: "center",
    borderRadius: "50%",
    espelhar: true,
  },
  {
    src: "assets/images/edu-careca.png",
    top: "-22px",
    leftEsq: "9px",
    leftDir: "10px",
    width: "83px",
    height: "110px",
    objectPosition: "center",
    borderRadius: "50%",
    espelhar: true,
  },
  {
    src: "assets/images/rafa-careca.png",
    top: "-18px",
    leftEsq: "13px",
    leftDir: "11px",
    width: "78px",
    height: "100px",
    objectPosition: "center",
    borderRadius: "50%",
    espelhar: true,
  },
  {
    src: "assets/images/arakaki-careca.png",
    top: "-19px",
    leftEsq: "5px",
    leftDir: "5px",
    width: "92px",
    height: "120px",
    objectPosition: "center",
    borderRadius: "50%",
    espelhar: true,
  },
  {
    src: "assets/images/felipe-careca.png",
    top: "-23px",
    leftEsq: "10px",
    leftDir: "9px",
    width: "84px",
    height: "105px",
    objectPosition: "center",
    borderRadius: "50%",
    espelhar: true,
  },
];

const cabecaAleatoria = cabecas[Math.floor(Math.random() * cabecas.length)];

// ===== SONS =====

const somRugido = new Audio("assets/music/rugido-monstro.mpeg");
const somBatalha = new Audio("assets/music/som-batalha.mpeg");
const somTiro = new Audio("assets/music/tiro-personagem.mpeg");
const somDano = new Audio("assets/music/dano-personagem.mp3");
const somLagosta = new Audio("assets/music/lagosta.mp3");
const somMonsterPrimeiro = new Audio("assets/music/monster-primeiro-ataque.mp3");
const somMonsterSegundo = new Audio("assets/music/monster-segundo-ataque.mp3");
const somMonsterRisada = new Audio("assets/music/monster-risada.mp3");

// Volumes normais
somBatalha.volume = 0.75;
somTiro.volume = 0.8;
somRugido.volume = 1.0;
somDano.volume = 1.0;
somLagosta.volume = 0.9;
somMonsterPrimeiro.volume = 0.2;
somMonsterSegundo.volume = 0.07;
somMonsterRisada.volume = 1.0;

// AudioContext para boostar clique, knockout e fah acima de 1.0
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function criarSomBoostado(src, gainValue) {
  const audio = new Audio(src);
  const source = audioCtx.createMediaElementSource(audio);
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = gainValue;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  return audio;
}

const somClique = criarSomBoostado("assets/music/clique.mp3", 3.0);
const somKnockout = criarSomBoostado("assets/music/knockout.mp3", 3.0);
const somFah = criarSomBoostado("assets/music/fah.mp3", 0.08);

// Retoma AudioContext na primeira interação (política de autoplay)
document.addEventListener(
  "click",
  () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
  },
  { once: true },
);
document.addEventListener(
  "keydown",
  () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
  },
  { once: true },
);

function tocarBoostado(audio) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  audio.currentTime = 0;
  audio.play();
}

// Helper geral de clique
function tocarClique() {
  tocarBoostado(somClique);
}

// Pool de instâncias para o pulo — evita corte quando pula rapidamente
const somPularPool = Array.from({ length: 4 }, () => {
  const a = new Audio("assets/music/pular.mpeg");
  a.volume = 1.0;
  return a;
});
let somPularIdx = 0;
function tocarPulo() {
  const a = somPularPool[somPularIdx % somPularPool.length];
  somPularIdx++;
  a.currentTime = 0;
  a.play();
}

// som-batalha reinicia sozinho quando terminar (fallback para loop)
somBatalha.loop = true;
somBatalha.addEventListener("ended", () => {
  somBatalha.currentTime = 0;
  somBatalha.play();
});

// Controle de lagostas ativas e intervalo do som
let lagostasAtivas = 0;
let intervaloSomLagosta = null;

function iniciarSomLagosta() {
  if (intervaloSomLagosta) return;
  intervaloSomLagosta = setInterval(() => {
    if (lagostasAtivas > 0 && !jogoPausado) {
      somLagosta.currentTime = 0;
      somLagosta.play();
    }
  }, 5000);
}

function pararSomLagosta() {
  clearInterval(intervaloSomLagosta);
  intervaloSomLagosta = null;
}

// ===== REFERÊNCIAS DOM =====

const cutsceneOverlay = document.getElementById("cutscene-overlay");
const cutsceneMago = document.getElementById("cutscene-mago");
const cutsceneMagoSprite = document.getElementById("cutscene-mago-sprite");
const cutsceneCabecaImg = document.getElementById("cutscene-cabeca-img");
const cutsceneBoss = document.getElementById("cutscene-boss");
const bubbleMago = document.getElementById("cutscene-bubble-mago");
const bubbleBoss = document.getElementById("cutscene-bubble-boss");

const magoVermelho = document.getElementById("p1");
const imgVermelho = document.getElementById("magoVermelho");
const boss = document.getElementById("boss");
const bossImg = document.getElementById("bossImg");
const overlay = document.getElementById("boss-dead-overlay");
const cabecaImg = document.getElementById("cabeca-personagem");
const cabecaContainer = document.getElementById("cabeca-container");

const pauseBtn = document.getElementById("pause-button");
const pauseOv = document.getElementById("pause-overlay");
const resumeBtn = document.getElementById("resume-button");
const exitBtn = document.getElementById("exit-button");

const coracoesVermelho = document.querySelectorAll("#vidas-vermelho img");

// Elementos ocultados durante a cutscene e revelados ao iniciar o jogo
const elementosJogo = [
  magoVermelho,
  boss,
  document.getElementById("boss-hp-bar"),
  pauseBtn,
  document.getElementById("painel-vermelho"),
];

// ===== VARIÁVEIS DE ESTADO =====

let jogoPausado = true;
let projetisAtivos = [];

let imuneVermelho = false;
let tempoImuneVermelho = 0;
let ultimaDirVermelho = "dir";
let atacandoVermelho = false;
const attackDuration = 900;

let vidasVermelho = 3;
let mortoVermelho = false;

const bossProjetilSrc = "assets/images/bola-azul.jpg";
let bossAttackInterval;

// ===== FÍSICA / POSICIONAMENTO =====

let posX = 100,
  posY = 100,
  vel = 3,
  vy = 0,
  pulando = false;
const grav = 0.3,
  forca = 10,
  chao = 96;

let bossX = GAME_W + 150;
const targetBossX = GAME_W - 500;
const bossY = 85;
const bossSpeed = 2;

// ===== BOSS / FASES =====

const bossMaxHealth = 120;
let bossHealth = bossMaxHealth;
const FIREBALL_PHASE = 0.5;
let firePhaseOn = false;
let fireballInterval = null;
let cenouraSpawnada = false;
const cenouraVel = 3;

// Flags de rugido — cada marco toca só uma vez
let rugidoMeiaVidaTocado = false;
let rugidoQuartoVidaTocado = false;

let podeContinuarVictory = false;

// ===== TECLAS =====

const teclas = { KeyW: false, KeyA: false, KeyD: false, KeyF: false };

function onKeyDown(e) {
  if (teclas.hasOwnProperty(e.code)) {
    teclas[e.code] = true;
    e.preventDefault();
  }
}

function onKeyUp(e) {
  if (teclas.hasOwnProperty(e.code)) {
    teclas[e.code] = false;
    e.preventDefault();
  }
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

// ===== CUTSCENE =====

function posicionarBubbleMago() {
  const scale = getScale();
  const offsetX = (window.innerWidth - GAME_W * scale) / 2;
  const offsetY = (window.innerHeight - GAME_H * scale) / 2;
  const magoRect = cutsceneMago.getBoundingClientRect();

  const magoLeft = (magoRect.left - offsetX) / scale;
  const magoTop = (magoRect.top - offsetY) / scale;

  bubbleMago.style.left = magoLeft + 5 + "px";
  bubbleMago.style.bottom = GAME_H - magoTop + 40 + "px";
}

function posicionarBubbleBoss() {
  const scale = getScale();
  const offsetX = (window.innerWidth - GAME_W * scale) / 2;
  const offsetY = (window.innerHeight - GAME_H * scale) / 2;
  const bossRect = cutsceneBoss.getBoundingClientRect();

  const bossRight = (bossRect.right - offsetX) / scale;
  const bossTop = (bossRect.top - offsetY) / scale;

  bubbleBoss.style.right = GAME_W - bossRight + 120 + "px";
  bubbleBoss.style.bottom = GAME_H - bossTop + "px";
}

function executarCutscene(onFinish) {
  jogoPausado = true;

  elementosJogo.forEach((el) => {
    if (el) el.style.display = "none";
  });
  cutsceneOverlay.classList.remove("hidden");

  // Rugido na abertura da cutscene
  somRugido.currentTime = 0;
  somRugido.play();

  // Configura cabeça do mago na cutscene
  const cabecaContCut = cutsceneMago.querySelector(".cabeca-cut");
  cabecaContCut.style.top = cabecaAleatoria.top;
  cabecaContCut.style.left = cabecaAleatoria.leftDir;
  cabecaContCut.style.width = cabecaAleatoria.width;
  cabecaContCut.style.height = cabecaAleatoria.height;
  cabecaContCut.style.borderRadius = cabecaAleatoria.borderRadius;

  cutsceneCabecaImg.src = cabecaAleatoria.src;
  cutsceneCabecaImg.style.width = cabecaAleatoria.width;
  cutsceneCabecaImg.style.height = cabecaAleatoria.height;
  cutsceneCabecaImg.style.objectPosition = cabecaAleatoria.objectPosition;
  cutsceneCabecaImg.style.objectFit = "fill";

  const screenW = GAME_W;
  const chaoBottom = 100;

  // Fase 1 — Mago aparece pela esquerda
  cutsceneMago.style.left = "-300px";
  cutsceneMago.style.bottom = chaoBottom + "px";
  cutsceneMago.style.transition = "none";
  cutsceneMagoSprite.src = "assets/images/mago-azul-parado.gif";

  setTimeout(() => {
    cutsceneMago.style.transition = "left 1.8s cubic-bezier(.17,.89,.32,1.28)";
    cutsceneMago.style.left = "80px";
  }, 200);

  // Fase 2 — Mago anda para a direita e volta
  setTimeout(() => {
    cutsceneMagoSprite.src = "assets/images/mago-azul-correndo.gif";
    cabecaContCut.style.left = cabecaAleatoria.leftDir;
    cabecaContCut.style.transform = cabecaAleatoria.espelhar
      ? "scaleX(-1)"
      : "scaleX(1)";

    const destDir = screenW * 0.38;
    const durDir = 1200;

    cutsceneMago.style.transition = `left ${durDir}ms linear, bottom 0.6s cubic-bezier(.17,.89,.32,1.28)`;
    cutsceneMago.style.left = destDir + "px";

    // Volta para a esquerda
    setTimeout(() => {
      cutsceneMagoSprite.src = "assets/images/mago-azul-correndo-esquerdo.gif";
      cabecaContCut.style.left = cabecaAleatoria.leftEsq;
      cabecaContCut.style.transform = cabecaAleatoria.espelhar
        ? "scaleX(1)"
        : "scaleX(-1)";

      cutsceneMago.style.transition = "left 900ms linear";
      cutsceneMago.style.left = screenW * 0.1 + "px";

      setTimeout(() => {
        // Para, olha para a direita
        cutsceneMagoSprite.src = "assets/images/mago-azul-parado.gif";
        cabecaContCut.style.left = cabecaAleatoria.leftDir;
        cabecaContCut.style.transform = cabecaAleatoria.espelhar
          ? "scaleX(-1)"
          : "scaleX(1)";

        // Fase 3 — Balão "Cadê o Cthulhu?"
        posicionarBubbleMago();
        bubbleMago.classList.add("show");

        // Fase 4 — Boss entra pela direita
        setTimeout(() => {
          cutsceneBoss.style.right = "-400px";
          cutsceneBoss.style.left = "auto";
          cutsceneBoss.style.bottom = "85px";
          cutsceneBoss.style.transition = "none";
          cutsceneBoss.style.opacity = "1";

          setTimeout(() => {
            cutsceneBoss.style.transition =
              "right 1s cubic-bezier(.17,.89,.32,1.28)";
            cutsceneBoss.style.right = "20px";

            // Risada do boss
            somMonsterRisada.currentTime = 0;
            somMonsterRisada.play();

            // Fase 5 — Balão do boss
            setTimeout(() => {
              bubbleMago.classList.remove("show");
              posicionarBubbleBoss();
              bubbleBoss.classList.add("show");

              // Fase 6 — Transição para o jogo
              setTimeout(() => {
                bubbleBoss.classList.remove("show");

                const fade = document.getElementById("transition-fade");
                const prepare = document.getElementById("prepare-text");

                fade.classList.add("show");

                setTimeout(() => {
                  prepare.classList.add("show");
                  cutsceneOverlay.classList.add("hidden");

                  setTimeout(() => {
                    prepare.classList.remove("show");

                    setTimeout(() => {
                      elementosJogo.forEach((el) => {
                        if (el) el.style.display = "block";
                      });
                      onFinish();

                      setTimeout(() => {
                        fade.classList.remove("show");
                      }, 100);
                    }, 700);
                  }, 1800);
                }, 1000);
              }, 2500);
            }, 800);
          }, 50);
        }, 1500);
      }, 950);
    }, durDir + 200);
  }, 900);
}

// ===== TELA INICIAL =====

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");

function iniciarJogo() {
  jogoPausado = true;
  startButton.disabled = true;

  audioCtx.resume().then(() => tocarClique());

  startScreen.classList.add("starting");

  setTimeout(() => {
    startScreen.style.display = "none";

    executarCutscene(() => {
      jogoPausado = false;

      // Inicia música de batalha
      somBatalha.currentTime = 0;
      somBatalha.play();

      // Toca fah ao entrar no jogo
      tocarBoostado(somFah);

      magoVermelho.style.left = posX + "px";
      magoVermelho.style.bottom = posY + "px";

      bossX = targetBossX;
      boss.style.left = bossX + "px";
      boss.style.bottom = bossY + "px";

      cabecaContainer.style.left =
        ultimaDirVermelho === "esq"
          ? cabecaAleatoria.leftEsq
          : cabecaAleatoria.leftDir;

      cabecaContainer.style.transform =
        ultimaDirVermelho === "esq"
          ? cabecaAleatoria.espelhar
            ? "scaleX(1)"
            : "scaleX(-1)"
          : cabecaAleatoria.espelhar
            ? "scaleX(-1)"
            : "scaleX(1)";

      andar();
    });
  }, 550);
}

// Espaço na tela inicial
document.addEventListener("keydown", (e) => {
  if (
    (e.code === "Space" || e.code === "Enter") &&
    startScreen.style.display !== "none"
  )
    iniciarJogo();
});

startButton.addEventListener("click", iniciarJogo);

// ===== PAUSE =====

function showPauseMenu() {
  jogoPausado = true;
  somBatalha.pause();
  pauseOv.style.display = "flex";
  pauseOv.classList.remove("closing");
  pauseOv.classList.add("show");
}

function hidePauseMenu() {
  tocarClique();
  pauseOv.classList.add("closing");
  setTimeout(() => {
    pauseOv.classList.remove("show", "closing");
    pauseOv.style.display = "none";
    jogoPausado = false;
    somBatalha.play();
    requestAnimationFrame(andar);
  }, 250);
}

function exitGame() {
  tocarClique();
  location.reload();
}

pauseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showPauseMenu();
});
resumeBtn.addEventListener("click", hidePauseMenu);
exitBtn.addEventListener("click", exitGame);

document
  .getElementById("pause-menu")
  .addEventListener("click", (e) => e.stopPropagation());

document.addEventListener("click", (e) => {
  if (jogoPausado && pauseOv.style.display === "flex") {
    if (!document.getElementById("pause-menu").contains(e.target))
      hidePauseMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (
    pauseOv.style.display === "flex" &&
    (e.code === "Enter" || e.code === "Space")
  ) {
    e.preventDefault();
    e.stopPropagation();
    hidePauseMenu();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !jogoPausado) showPauseMenu();
});

// ===== VIDAS / MORTE DO JOGADOR =====

function checarSobreposicao(rect1, rect2) {
  return !(
    rect1.right < rect2.left + 50 ||
    rect1.left > rect2.right - 50 ||
    rect1.bottom < rect2.top + 40 ||
    rect1.top > rect2.bottom - 20
  );
}

function checarColisao() {
  const rectVermelho = magoVermelho.getBoundingClientRect();
  const rectBoss = bossImg.getBoundingClientRect();

  const rectExpandido = {
    left: rectVermelho.left,
    right: rectVermelho.right,
    bottom: rectVermelho.bottom,
    top: rectVermelho.top - 10,
  };

  if (!imuneVermelho && checarSobreposicao(rectExpandido, rectBoss))
    perderVida();
}

function perderVida() {
  if (!imuneVermelho && vidasVermelho > 0) {
    vidasVermelho--;
    coracoesVermelho[vidasVermelho].style.opacity = 0.2;
    imuneVermelho = true;
    magoVermelho.classList.add("imune");
    tempoImuneVermelho = performance.now();

    // Som de dano no personagem
    somDano.currentTime = 0;
    somDano.play();

    if (vidasVermelho === 0) magoMorreu();
  }
}

function magoMorreu() {
  mortoVermelho = true;
  magoVermelho.classList.add("jogador-morto");
  spawnGhost(magoVermelho, ultimaDirVermelho);
  teclas.KeyW = teclas.KeyA = teclas.KeyD = teclas.KeyF = false;
  verificarGameOver();
}

function verificarGameOver() {
  if (!mortoVermelho) return;

  jogoPausado = true;
  somBatalha.pause();
  pararSomLagosta();

  document.querySelectorAll("img").forEach((img) => {
    if (!img.src.includes("Knockout")) img.style.animationPlayState = "paused";
  });

  document.querySelectorAll("#p1 img, #boss img, .projetil").forEach((el) => {
    if (el) el.style.animationPlayState = "paused";
  });

  projetisAtivos.forEach((p) => p.remove());
  projetisAtivos = [];

  clearInterval(bossAttackInterval);
  if (fireballInterval) clearInterval(fireballInterval);

  const somGameOver = criarSomBoostado("assets/music/game-over.mp3", 5.0);

  setTimeout(() => {
    tocarBoostado(somGameOver);
    document.getElementById("game-over-overlay").style.display = "flex";
  }, 10);
}

function spawnGhost(magoElem, ultimaDir) {
  const rect = magoElem.getBoundingClientRect();
  const ghost = document.createElement("img");
  ghost.src = "assets/images/fantasma.gif";
  ghost.classList.add("ghost");
  ghost.style.animationName =
    ultimaDir === "esq" ? "ghost-left" : "ghost-right";
  ghost.style.left = rect.left + "px";
  ghost.style.bottom = GAME_H - rect.bottom + "px";
  document.getElementById("game-root").appendChild(ghost);
  ghost.addEventListener("animationend", () => ghost.remove());
}

// ===== BOSS: VIDA E FASES =====

function atualizarBossHp() {
  const pct = Math.max(0, bossHealth / bossMaxHealth) * 100;
  document.getElementById("boss-hp-fill").style.width = pct + "%";

  if (bossHealth <= 0) {
    morrerBoss();
    return;
  }

  // Rugido em 50% de vida
  if (!rugidoMeiaVidaTocado && bossHealth <= bossMaxHealth * 0.5) {
    rugidoMeiaVidaTocado = true;
    somRugido.currentTime = 0;
    somRugido.play();
  }

  // Rugido em 25% de vida
  if (!rugidoQuartoVidaTocado && bossHealth <= bossMaxHealth * 0.25) {
    rugidoQuartoVidaTocado = true;
    somRugido.currentTime = 0;
    somRugido.play();
  }

  if (!firePhaseOn && bossHealth <= FIREBALL_PHASE * bossMaxHealth) {
    firePhaseOn = true;
    fireballInterval = setInterval(spawnFallingFireball, 600);
  }

  if (!cenouraSpawnada && bossHealth <= bossMaxHealth * 0.2) {
    spawnCenoura();
    cenouraSpawnada = true;
  }
}

function morrerBoss() {
  bossHealth = 0;

  clearInterval(bossAttackInterval);
  clearInterval(fireballInterval);
  pararSomLagosta();

  // Knockout ao eliminar o boss
  tocarBoostado(somKnockout);

  document.querySelectorAll(".projetil").forEach((p) => p.remove());
  projetisAtivos = [];

  bossImg.src = "assets/images/monster-derrotado.png";
  boss.classList.add("boss-dead");
  overlay.style.display = "flex";

  for (let k in teclas) teclas[k] = false;
  document.removeEventListener("keydown", onKeyDown);
  document.removeEventListener("keyup", onKeyUp);

  imgVermelho.src = "assets/images/mago-azul-parado.gif";

  setTimeout(() => {
    overlay.style.display = "none";
    podeContinuarVictory = false;

    const victory = document.getElementById("victory-overlay");
    victory.style.display = "flex";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        victory.classList.add("show");
        setTimeout(() => {
          podeContinuarVictory = true;
        }, 1200);
      });
    });
  }, 1500);
}

// ===== PROJÉTEIS DO BOSS (bolinhas azuis) =====

function criarProjetilBoss() {
  if (jogoPausado || bossHealth <= 0) return;

  const rectBoss = toGameCoords(bossImg.getBoundingClientRect());
  const p = document.createElement("img");
  p.src = bossProjetilSrc;
  p.classList.add("projetil");
  p.style.width = "60px";
  p.style.height = "60px";

  const alturaMin = chao;
  const alturaMax = 450;
  const alturaAleatoria = Math.random() * (alturaMax - alturaMin) + alturaMin;

  p.style.left = rectBoss.left + 100 + "px";
  p.style.bottom = alturaAleatoria + "px";
  document.getElementById("game-root").appendChild(p);

  somMonsterPrimeiro.currentTime = 0;
  somMonsterPrimeiro.play();

  let x = rectBoss.left + 100;
  const speed = -3;
  const size = 60;

  (function mover() {
    if (bossHealth <= 0) {
      p.remove();
      return;
    }
    if (jogoPausado) {
      requestAnimationFrame(mover);
      return;
    }

    x += speed;
    p.style.left = x + "px";

    if (!mortoVermelho) {
      const rectVermelho = {
      left: posX + 0,
      right: posX + 100,
      bottom: posY + 115,
      top: posY + 5,
    };

      const rectBola = {
        left: x,
        right: x + size,
        bottom: parseFloat(p.style.bottom) + size,
        top: parseFloat(p.style.bottom),
      };

      if (!imuneVermelho && checarSobreposicao(rectBola, rectVermelho)) {
        perderVida();
        p.remove();
        return;
      }
    }

    if (x < -size * 2 || x > GAME_W + size * 2) {
      p.remove();
      return;
    }
    requestAnimationFrame(mover);
  })();

  projetisAtivos.push(p);
}

// ===== PROJÉTEIS DO JOGADOR =====

function criarProjetil(x, y, dir, src, size) {
  if (jogoPausado || bossHealth <= 0) return;

  const p = document.createElement("img");
  p.src = src;
  p.classList.add("projetil");
  p.style.width = size + "px";
  p.style.height = size + "px";
  p.style.left = x + "px";
  p.style.bottom = y + "px";
  document.getElementById("game-root").appendChild(p);

  const v = 8 * dir;

  function detectarColisao(proj, bossSpr) {
    const r1 = proj.getBoundingClientRect();
    const rb = bossSpr.getBoundingClientRect();
    return !(
      r1.right < rb.left + 75 ||
      r1.left > rb.right - 60 ||
      r1.bottom < rb.top + 40 ||
      r1.top > rb.bottom - 20
    );
  }

  (function mover() {
    if (bossHealth <= 0) {
      p.remove();
      return;
    }
    if (jogoPausado) {
      requestAnimationFrame(mover);
      return;
    }

    x += v;
    p.style.left = x + "px";

    if (detectarColisao(p, bossImg)) {
      p.remove();
      bossHealth--;
      atualizarBossHp();
      return;
    }

    if (x < -size * 2 || x > GAME_W + size * 2) {
      p.remove();
      return;
    }
    requestAnimationFrame(mover);
  })();

  projetisAtivos.push(p);
}

// ===== PROJÉTEIS CAINDO — ataque do céu =====

function spawnFallingFireball() {
  if (jogoPausado || bossHealth <= 0) return;

  const p = document.createElement("img");
  p.src = "assets/images/ataque.gif";
  p.classList.add("projetil");
  p.style.position = "absolute";
  p.style.width = "80px";
  p.style.height = "100px";

  const x = Math.random() * (GAME_W - 80);
  p.style.left = x + "px";
  p.style.top = "0px";
  document.getElementById("game-root").appendChild(p);

  // Som do ataque do céu
  somMonsterSegundo.currentTime = 0;
  somMonsterSegundo.play();

  (function cair() {
    if (jogoPausado || bossHealth <= 0) {
      p.remove();
      return;
    }

    const rectP = p.getBoundingClientRect();
    if (
      !mortoVermelho &&
      !imuneVermelho &&
      checarSobreposicao(rectP, magoVermelho.getBoundingClientRect())
    ) {
      perderVida();
      p.remove();
      return;
    }

    let y = parseFloat(p.style.top) + 5;
    if (y >= GAME_H - 96) {
      p.remove();
      return;
    }

    p.style.top = y + "px";
    requestAnimationFrame(cair);
  })();
}

// ===== FASE DA LAGOSTA =====

function spawnCenoura() {
  const scale = getScale();
  const offsetX = (window.innerWidth - GAME_W * scale) / 2;
  const rectBoss = bossImg.getBoundingClientRect();
  const bossLeft = (rectBoss.left - offsetX) / scale;

  const cenW = 90;
  const leftLimit = 0;
  const rightLimit = bossLeft - cenW - 10;

  clearInterval(bossAttackInterval);
  clearInterval(fireballInterval);

  fireballInterval = setInterval(spawnFallingFireball, 700);

  function criarUmaCenoura(direcaoInicial) {
    const cen = document.createElement("img");
    cen.src =
      direcaoInicial === 1 ? "assets/images/lagosta-d.gif" : "assets/images/lagosta-e.gif";
    cen.classList.add("projetil");
    cen.style.width = cenW + "px";
    cen.style.height = "123px";
    cen.style.left = rightLimit + "px";
    cen.style.bottom = chao + 3 + "px";
    document.getElementById("game-root").appendChild(cen); // era document.body

    lagostasAtivas++;
    iniciarSomLagosta();

    let dir = direcaoInicial;
    let velX = cenouraVel;
    let y = chao + 1;
    let vyC = 8;
    const gravC = 0.35;
    const forcaC = 1;
    let ultimoPulo = performance.now();

    (function mover() {
      if (jogoPausado || bossHealth <= 0) {
        requestAnimationFrame(mover);
        return;
      }

      let x = parseFloat(cen.style.left);
      x += velX * dir;

      let virou = false;

      if (x <= leftLimit) {
        x = leftLimit;
        dir = 1;
        virou = true;
      } else if (x >= rightLimit) {
        x = rightLimit;
        dir = -1;
        virou = true;
      }

      cen.style.left = x + "px";
      if (virou)
        cen.src = dir === 1 ? "assets/images/lagosta-d.gif" : "assets/images/lagosta-e.gif";

      const agora = performance.now();
      if (y <= chao + 3 && agora - ultimoPulo > 1200) {
        vyC = forcaC;
        ultimoPulo = agora;
      }

      vyC -= gravC;
      y += vyC;
      if (y <= chao + 3) {
        y = chao + 3;
        vyC = 0;
      }

      cen.style.bottom = y + "px";

      if (
        !mortoVermelho &&
        checarSobreposicao(
          cen.getBoundingClientRect(),
          magoVermelho.getBoundingClientRect(),
        )
      ) {
        perderVida();
        cen.remove();
        lagostasAtivas = Math.max(0, lagostasAtivas - 1);
        if (lagostasAtivas === 0) pararSomLagosta();
        return;
      }

      requestAnimationFrame(mover);
    })();
  }

  criarUmaCenoura(-1);
  setTimeout(() => {
    if (bossHealth > 0) criarUmaCenoura(1);
  }, 2500);
}

// ===== LOOP PRINCIPAL =====

const fireCooldown = 150;
let lastFireRed = 0;

function andar(tempo = 0) {
  if (jogoPausado || bossHealth <= 0) return;

  if (teclas.KeyD) {
    posX += vel;
    ultimaDirVermelho = "dir";
  }
  if (teclas.KeyA) {
    posX -= vel;
    ultimaDirVermelho = "esq";
  }

  if (teclas.KeyW && !pulando) {
    vy = forca;
    pulando = true;
    tocarPulo();
  }

  vy -= grav;
  posY += vy;
  if (posY <= chao) {
    posY = chao;
    vy = 0;
    pulando = false;
  }

  posX = Math.max(0, Math.min(posX, GAME_W - 535));

  const now = performance.now();
  if (!mortoVermelho && teclas.KeyF && now - lastFireRed > fireCooldown) {
    lastFireRed = now;
    atacarVermelho();
    criarProjetil(
      ultimaDirVermelho === "esq" ? posX - 40 : posX + 60,
      posY + 20,
      ultimaDirVermelho === "esq" ? -1 : 1,
      "assets/images/gelo.gif",
      50,
    );
  }

  // Atualiza sprite de movimento
  const movendo = teclas.KeyA || teclas.KeyD;
  let srcV = movendo
    ? ultimaDirVermelho === "esq"
      ? "assets/images/mago-azul-correndo-esquerdo.gif"
      : "assets/images/mago-azul-correndo.gif"
    : ultimaDirVermelho === "esq"
      ? "assets/images/mago-azul-parado-esquerdo.gif"
      : "assets/images/mago-azul-parado.gif";

  if (!atacandoVermelho && imgVermelho.src.indexOf(srcV) < 0)
    imgVermelho.src = srcV;

  // Boss se move até a posição alvo
  if (bossX > targetBossX) bossX -= bossSpeed;
  boss.style.left = bossX + "px";
  boss.style.bottom = bossY + "px";

  if (
    bossX <= targetBossX &&
    !bossAttackInterval &&
    !mortoVermelho &&
    bossHealth > 0
  ) {
    bossAttackInterval = setInterval(criarProjetilBoss, 700);
  }

  magoVermelho.style.left = posX + "px";
  magoVermelho.style.bottom = posY + "px";

  // Imunidade temporária após dano
  if (imuneVermelho && now - tempoImuneVermelho >= 2000) {
    imuneVermelho = false;
    magoVermelho.classList.remove("imune");
  }

  // Cabeça acompanha direção do mago
  cabecaContainer.style.left =
    ultimaDirVermelho === "esq"
      ? cabecaAleatoria.leftEsq
      : cabecaAleatoria.leftDir;
  cabecaContainer.style.transform =
    ultimaDirVermelho === "esq"
      ? cabecaAleatoria.espelhar
        ? "scaleX(1)"
        : "scaleX(-1)"
      : cabecaAleatoria.espelhar
        ? "scaleX(-1)"
        : "scaleX(1)";

  checarColisao();
  requestAnimationFrame(andar);
}

function atacarVermelho() {
  atacandoVermelho = true;
  somTiro.currentTime = 0;
  somTiro.play();
  imgVermelho.src =
    ultimaDirVermelho === "esq"
      ? "assets/images/mago-azul-atacando-esquerda.gif"
      : "assets/images/mago-azul-atacando.gif";
  setTimeout(() => {
    atacandoVermelho = false;
  }, attackDuration);
}

// ===== VÍDEO FINAL =====

function reproduzirVideoFinal() {
  const fade = document.getElementById("transition-fade");
  const videoOverlay = document.getElementById("video-overlay");
  const video = document.getElementById("video-final");

  // 1. Fade out para preto
  fade.style.transition = "opacity 0.8s ease";
  fade.classList.add("show");

  setTimeout(() => {
    // 2. Para a música e mostra o overlay do vídeo
    somBatalha.pause();
    videoOverlay.style.display = "flex";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        videoOverlay.classList.add("show");

        // 3. Remove o fade preto e começa o vídeo
        setTimeout(() => {
          fade.classList.remove("show");
          video.play();
        }, 800);
      });
    });

    // 4. Quando o vídeo terminar: fade out e redireciona
    video.addEventListener("timeupdate", () => {
      const restante = video.duration - video.currentTime;
      if (restante <= 2 && video.style.opacity !== "0") {
        video.style.transition = "opacity 2s ease";
        video.style.opacity = "0";
      }
    });

    video.addEventListener("ended", () => {
      fade.classList.add("show");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 900);
    });
  }, 850);
}

// ===== BOTÕES DE REINÍCIO / CONTINUAR =====

document.getElementById("restart-button").addEventListener("click", () => {
  tocarClique();
  location.reload();
});

document.getElementById("continue-button").addEventListener("click", () => {
  tocarClique();
  reproduzirVideoFinal();
});

// Enter/Espaço no game over
document.addEventListener("keydown", (e) => {
  if (
    document.getElementById("game-over-overlay").style.display === "flex" &&
    (e.code === "Enter" || e.code === "Space")
  ) {
    tocarClique();
    location.reload();
  }
});

// Enter/Espaço na vitória
document.addEventListener("keydown", (e) => {
  if (
    document.getElementById("victory-overlay").classList.contains("show") &&
    podeContinuarVictory &&
    (e.code === "Enter" || e.code === "Space")
  ) {
    e.preventDefault();
    tocarClique();
    document.getElementById("continue-button").click();
  }
});

// ===== INICIALIZAÇÃO DA CABEÇA NO JOGO =====

cabecaImg.src = cabecaAleatoria.src;
cabecaImg.style.width = cabecaAleatoria.width;
cabecaImg.style.height = cabecaAleatoria.height;
cabecaImg.style.objectPosition = cabecaAleatoria.objectPosition;

cabecaContainer.style.top = cabecaAleatoria.top;
cabecaContainer.style.left = cabecaAleatoria.left;
cabecaContainer.style.width = cabecaAleatoria.width;
cabecaContainer.style.height = cabecaAleatoria.height;
cabecaContainer.style.borderRadius = cabecaAleatoria.borderRadius;

// Posição inicial dos personagens (antes da cutscene)
magoVermelho.style.left = posX + "px";
magoVermelho.style.bottom = posY + "px";
bossX = targetBossX;
boss.style.left = bossX + "px";
boss.style.bottom = bossY + "px";

atualizarBossHp();
