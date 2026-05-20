/* ═══════════════════════════════════════════════════════════
   QUESTIONS — edite aqui facilmente!
   Cada objeto: { question, options: [a,b,c,d], correct (0-indexed) }
═══════════════════════════════════════════════════════════ */
const QUESTIONS = [
  {
    question: "Qual comando inicia todos os serviços definidos em um arquivo docker-compose.yml em modo detached (background)?",
    options: [
      "docker-compose start -d",
      "docker-compose up --detach",
      "docker-compose run -d",
      "docker-compose launch --background"
    ],
    correct: 1
  },
  {
    question: "No docker-compose.yml, qual chave define a política de reinicialização de um serviço para reiniciar sempre, exceto quando parado manualmente?",
    options: [
      "restart: always",
      "restart: on-failure",
      "restart: unless-stopped",
      "restart: on-exit"
    ],
    correct: 2
  },
  {
    question: "Qual diretiva no docker-compose.yml permite que um serviço acesse variáveis de ambiente definidas em um arquivo externo (como .env)?",
    options: [
      "environment_file:",
      "env:",
      "env_file:",
      "dotenv:"
    ],
    correct: 2
  }
];

/* ═══════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════ */
let current  = 0;
let score    = 0;
let answers  = [];
let locked   = false;
let toastTimer = null;

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  spawnBubbles();
  renderQuestion();
});

/* ═══════════════════════════════════════════════════════════
   RENDER QUESTION
═══════════════════════════════════════════════════════════ */
function renderQuestion() {
  locked = false;
  const q = QUESTIONS[current];
  const total = QUESTIONS.length;

  // Header
  document.getElementById('prog-badge').textContent = `Pergunta ${current + 1}/${total}`;
  document.getElementById('score-val').textContent   = score;
  document.getElementById('progress-fill').style.width = `${(current / total) * 100}%`;

  // Dots
  const dotsEl = document.getElementById('footer-dots');
  dotsEl.innerHTML = '';
  QUESTIONS.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i < current ? ' done' : i === current ? ' active' : '');
    dotsEl.appendChild(d);
  });
  document.getElementById('footer-hint').textContent = 'Selecione uma opção para continuar';

  // Options HTML
  const labels = ['A', 'B', 'C', 'D'];
  const optsHtml = q.options.map((opt, i) => `
    <div class="option" data-idx="${i}" onclick="chooseOption(${i})">
      <div class="option-circle">${labels[i]}</div>
      <div class="option-text">${opt}</div>
    </div>
  `).join('');

  document.getElementById('question-area').innerHTML = `
    <div class="question-num">Pergunta ${current + 1} de ${total}</div>
    <div class="question-text">${q.question}</div>
    <div class="options">${optsHtml}</div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   CHOOSE OPTION
═══════════════════════════════════════════════════════════ */
function chooseOption(idx) {
  if (locked) return;
  locked = true;

  const q        = QUESTIONS[current];
  const correct  = q.correct;
  const isRight  = idx === correct;

  if (isRight) score++;
  document.getElementById('score-val').textContent = score;

  answers.push({ questionIdx: current, chosen: idx, correct: correct, right: isRight });

  // Disable all options
  document.querySelectorAll('.option').forEach(el => el.classList.add('disabled'));

  // Highlight chosen
  const chosenEl = document.querySelector(`.option[data-idx="${idx}"]`);
  const circleEl = chosenEl.querySelector('.option-circle');
  if (isRight) {
    chosenEl.classList.add('correct');
    circleEl.innerHTML = '<i class="fa-solid fa-check"></i>';
  } else {
    chosenEl.classList.add('wrong');
    circleEl.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    // Reveal correct
    const correctEl = document.querySelector(`.option[data-idx="${correct}"]`);
    const cCircle   = correctEl.querySelector('.option-circle');
    setTimeout(() => {
      correctEl.classList.add('reveal-correct');
      cCircle.innerHTML = '<i class="fa-solid fa-check"></i>';
    }, 250);
  }

  // Footer hint
  document.getElementById('footer-hint').textContent = isRight ? '✓ Correto!' : '✗ Resposta errada';

  // Toast
  if (isRight) {
    showToast(true, 'Correto! Muito bem! 🎉');
  } else {
    const correctText = q.options[correct];
    showToast(false, `Errado. Certa: "${correctText}"`);
  }

  // Auto-advance after 500ms
  setTimeout(() => {
    if (current < QUESTIONS.length - 1) {
      transitionTo(current + 1);
    } else {
      transitionToReport();
    }
  }, 700);
}

/* ═══════════════════════════════════════════════════════════
   TRANSITIONS
═══════════════════════════════════════════════════════════ */
function transitionTo(next) {
  const card = document.getElementById('card');
  card.classList.add('fade-out');
  setTimeout(() => {
    current = next;
    card.classList.remove('fade-out');
    card.classList.add('fade-in');
    renderQuestion();
    setTimeout(() => card.classList.remove('fade-in'), 400);
  }, 300);
}

function transitionToReport() {
  const card = document.getElementById('card');
  card.classList.add('fade-out');
  setTimeout(() => {
    card.classList.remove('fade-out');
    card.classList.add('fade-in');
    renderReport();
    setTimeout(() => card.classList.remove('fade-in'), 400);
  }, 300);
}

/* ═══════════════════════════════════════════════════════════
   REPORT
═══════════════════════════════════════════════════════════ */
function renderReport() {
  const total = QUESTIONS.length;
  const pct   = Math.round((score / total) * 100);

  let msg, sub;
  if (pct === 100) { msg = '🏆 Excelente!';          sub = 'Pontuação perfeita — você domina Docker Compose!'; }
  else if (pct >= 67) { msg = '👍 Bom trabalho!';    sub = 'Quase lá! Revise os pontos que errou.'; }
  else if (pct >= 33) { msg = '📚 Continue estudando'; sub = 'Vale revisar a documentação do Docker Compose.'; }
  else             { msg = '🔄 Vamos tentar novamente?'; sub = 'Não desista! A prática leva à perfeição.'; }

  // Header update
  document.getElementById('prog-badge').textContent = 'Resultado Final';
  document.getElementById('score-val').textContent  = score;
  document.getElementById('progress-fill').style.width = '100%';
  document.getElementById('footer-hint').textContent   = 'Quiz concluído!';

  const dotsEl = document.getElementById('footer-dots');
  dotsEl.innerHTML = '';
  QUESTIONS.forEach(() => {
    const d = document.createElement('div');
    d.className = 'dot done';
    dotsEl.appendChild(d);
  });

  // Details
  const detailsHtml = answers.map((a, i) => {
    const q = QUESTIONS[a.questionIdx];
    const cls = a.right ? 'item-correct' : 'item-wrong';
    const icon = a.right
      ? '<i class="fa-solid fa-circle-check detail-icon" style="color:#16a34a"></i>'
      : '<i class="fa-solid fa-circle-xmark detail-icon" style="color:#dc2626"></i>';
    return `
      <div class="detail-item ${cls}">
        <div class="detail-q">${icon} ${q.question}</div>
        <div class="detail-row">
          <span class="detail-label">Sua resp.</span>
          <span class="detail-val ${a.right ? 'is-correct-val' : 'is-wrong-val'}">${q.options[a.chosen]}</span>
        </div>
        ${!a.right ? `<div class="detail-row">
          <span class="detail-label">Correta</span>
          <span class="detail-val is-correct-val">${q.options[a.correct]}</span>
        </div>` : ''}
      </div>
    `;
  }).join('');

  document.getElementById('question-area').innerHTML = `
    <div class="report">
      <div class="report-hero">
        <div class="score-ring">
          <svg viewBox="0 0 80 80" width="90" height="90">
            <circle class="score-ring-bg" cx="40" cy="40" r="34"/>
            <circle class="score-ring-fill" id="ring-fill" cx="40" cy="40" r="34"/>
          </svg>
          <div class="score-ring-text">
            <div class="score-big">${score}/${total}</div>
            <div class="score-label">acertos</div>
          </div>
        </div>
        <div class="report-message">${msg}</div>
        <div class="report-sub">${sub}</div>
        <div class="perf-bar-wrap">
          <div class="perf-bar-fill" id="perf-bar"></div>
        </div>
        <div class="perf-pct">${pct}% de acertos</div>
      </div>

      <div class="detail-list">${detailsHtml}</div>

      <div class="btn-row">
        <button class="btn btn-primary" onclick="restartQuiz()">
          <i class="fa-solid fa-rotate-left"></i> Recomeçar
        </button>
        <button class="btn btn-secondary" onclick="restartQuiz()">
          <i class="fa-solid fa-shuffle"></i> Novo Quiz
        </button>
      </div>
    </div>
  `;

  // Hide default footer content, show different
  document.getElementById('footer-hint').textContent = `${pct}% de aproveitamento`;

  // Animate ring & bar after short delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      const circumference = 2 * Math.PI * 34;
      const offset = circumference - (pct / 100) * circumference;
      const ringEl = document.getElementById('ring-fill');
      if (ringEl) {
        ringEl.style.strokeDasharray = circumference;
        ringEl.style.strokeDashoffset = offset;
        ringEl.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s';
      }
      const barEl = document.getElementById('perf-bar');
      if (barEl) barEl.style.width = pct + '%';
    }, 80);
  });
}

/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function showToast(correct, message) {
  const toast   = document.getElementById('toast');
  const iconEl  = document.getElementById('toast-icon');
  const msgEl   = document.getElementById('toast-msg');

  clearTimeout(toastTimer);
  toast.classList.remove('show', 'correct-toast', 'wrong-toast');

  iconEl.className = 'fa-solid toast-icon ' + (correct ? 'fa-circle-check' : 'fa-circle-xmark');
  msgEl.textContent = message;
  toast.classList.add(correct ? 'correct-toast' : 'wrong-toast');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

/* ═══════════════════════════════════════════════════════════
   RESTART
═══════════════════════════════════════════════════════════ */
function restartQuiz() {
  current = 0;
  score   = 0;
  answers = [];
  locked  = false;

  const card = document.getElementById('card');
  card.classList.add('fade-out');
  setTimeout(() => {
    card.classList.remove('fade-out');
    card.classList.add('fade-in');
    renderQuestion();
    setTimeout(() => card.classList.remove('fade-in'), 400);
  }, 300);
}

/* ═══════════════════════════════════════════════════════════
   BUBBLES
═══════════════════════════════════════════════════════════ */
function spawnBubbles() {
  const container = document.getElementById('bubbles');
  const count = 28;

  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';

    const size  = 4 + Math.random() * 18;
    const left  = Math.random() * 100;
    const delay = Math.random() * 18;
    const dur   = 12 + Math.random() * 22;
    const drift = (Math.random() - 0.5) * 80;
    const swell = 0.8 + Math.random() * 0.5;

    b.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      --drift: ${drift}px;
      --swell: ${swell};
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(b);
  }
}