/* ═══════════════════════════════════════════════════════════
   QUIZ ENGINE — Super Compose Bros
   Lê ?fase=N da URL e carrega js/questions/faseN.js
═══════════════════════════════════════════════════════════ */

const TOTAL_FASES = 7;

// Pega o número da fase da URL (?fase=1)
function getFaseFromURL() {
  const params = new URLSearchParams(window.location.search);
  const fase = parseInt(params.get('fase'), 10);
  if (isNaN(fase) || fase < 1 || fase > TOTAL_FASES) return 1;
  return fase;
}

const faseAtual = getFaseFromURL();

// ── CARREGA O ARQUIVO DE PERGUNTAS DA FASE ──────────────────
function carregarQuestoes() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `js/questions/fase${faseAtual}.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Fase ${faseAtual} não encontrada`));
    document.head.appendChild(script);
  });
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS — localStorage
═══════════════════════════════════════════════════════════ */
function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('scb_progress') || '{}');
  } catch { return {}; }
}

function saveProgress(fase, score, total) {
  const progress = getProgress();
  const pct = Math.round((score / total) * 100);
  const isNewBest = !progress[fase] || pct > (progress[fase].pct || 0);
  const scoreGain = isNewBest ? score - (progress[fase] ? progress[fase].score : 0) : 0;

  // Salva resultado da fase (guarda o melhor score)
  if (isNewBest) {
    progress[fase] = { pct, score, total, completedAt: Date.now() };
  }

  // Marca fase como completada para sincronizar com o mapa
  progress[`completed_${fase}`] = true;

  // Desbloqueia próxima fase
  if (fase < TOTAL_FASES) {
    const proxima = fase + 1;
    if (!progress[`unlocked_${proxima}`]) {
      progress[`unlocked_${proxima}`] = true;
    }
  }

  localStorage.setItem('scb_progress', JSON.stringify(progress));

  // Envia score para o backend se o usuário estiver logado e tiver pontuação nova
  if (scoreGain > 0) {
    try {
      const user = JSON.parse(sessionStorage.getItem('scb_user') || 'null');
      if (user && user.id) {
        fetch('http://localhost:3000/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, score: scoreGain }),
        }).then(r => r.json()).then(updated => {
          // Atualiza o user na sessionStorage com o novo score
          if (updated && updated.id) sessionStorage.setItem('scb_user', JSON.stringify(updated));
        }).catch(() => { /* falha silenciosa — score salvo localmente */ });
      }
    } catch (_) { /* ignorar erros de parsing */ }
  }
}

function faseEstaDesbloqueada(fase) {
  if (fase === 1) return true;
  const progress = getProgress();
  return !!progress[`unlocked_${fase}`];
}

/* ═══════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════ */
let current    = 0;
let score      = 0;
let answers    = [];
let locked     = false;
let toastTimer = null;

// Timer
const TIMER_SEGUNDOS = 30;
let timerInterval  = null;
let timerRestante  = TIMER_SEGUNDOS;
let timerAtivo     = false;

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', async () => {
  spawnBubbles();

  // Verifica se a fase está desbloqueada
  if (!faseEstaDesbloqueada(faseAtual)) {
    mostrarFaseBloqueada();
    return;
  }

  // Fase 7 — Boss Final: redireciona para o jogo de batalha
  if (faseAtual === 7) {
    window.location.href = '../index.html';
    return;
  }

  try {
    await carregarQuestoes();
    iniciarQuiz();
  } catch (err) {
    document.getElementById('question-area').innerHTML = `
      <div style="text-align:center;padding:2rem;color:#dc2626">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;margin-bottom:1rem;display:block"></i>
        <strong>Fase não encontrada.</strong><br>
        <a href="mapa.html" style="color:#0e7490;margin-top:1rem;display:inline-block">← Voltar ao mapa</a>
      </div>
    `;
  }
});

function iniciarQuiz() {
  if (typeof FASE_INFO !== 'undefined') {
    document.getElementById('header-title-text').textContent =
      `Fase ${FASE_INFO.id} · ${FASE_INFO.titulo}`;
    document.title = `Fase ${FASE_INFO.id} · ${FASE_INFO.titulo}`;
  }

  // Timer sempre ativo
  timerAtivo = true;

  const total = QUESTIONS.length;
  document.getElementById('score-total').textContent = `/${total}`;
  renderQuestion();
}

function mostrarEmBreve() {
  document.getElementById('header-title-text').textContent = 'Fase 7 · Boss Final';
  document.title = 'Fase 7 · Boss Final';
  document.getElementById('card-footer').style.display = 'none';
  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('question-area').innerHTML = `
    <div style="text-align:center;padding:3rem 1.5rem">
      <div style="font-size:4rem;margin-bottom:1rem;animation:bobbing 3s ease-in-out infinite;display:inline-block">👑</div>
      <div style="font-family:'Press Start 2P',monospace;font-size:0.75rem;color:#0f172a;margin-bottom:0.75rem;line-height:1.8">
        EM CONSTRUÇÃO
      </div>
      <div style="font-size:0.9rem;color:#475569;line-height:1.6;margin-bottom:0.5rem">
        O Boss Final está sendo preparado pelo time.
      </div>
      <div style="font-size:0.85rem;color:#94a3b8;margin-bottom:2rem">
        Volte em breve. 🐋
      </div>
      <a href="mapa.html" class="btn btn-primary" style="display:inline-flex;text-decoration:none;max-width:200px;margin:0 auto">
        <i class="fa-solid fa-map"></i> Voltar ao mapa
      </a>
    </div>
  `;
}

function mostrarFaseBloqueada() {
  document.getElementById('question-area').innerHTML = `
    <div style="text-align:center;padding:2.5rem 1.5rem">
      <div style="font-size:3rem;margin-bottom:1rem">🔒</div>
      <div style="font-size:1.1rem;font-weight:700;color:#0f172a;margin-bottom:0.5rem">
        Fase bloqueada
      </div>
      <div style="font-size:0.9rem;color:#475569;margin-bottom:1.5rem">
        Complete a fase anterior para desbloquear esta.
      </div>
      <a href="mapa.html" class="btn btn-primary" style="display:inline-flex;text-decoration:none;max-width:220px;margin:0 auto">
        <i class="fa-solid fa-map"></i> Ver mapa de fases
      </a>
    </div>
  `;
  document.getElementById('card-footer').style.display = 'none';
}

/* ═══════════════════════════════════════════════════════════
   TIMER
═══════════════════════════════════════════════════════════ */
function iniciarTimer() {
  pararTimer();
  if (!timerAtivo) return;

  timerRestante = TIMER_SEGUNDOS;
  atualizarTimerUI();

  timerInterval = setInterval(() => {
    timerRestante--;
    atualizarTimerUI();

    if (timerRestante <= 0) {
      pararTimer();
      onTimerEsgotado();
    }
  }, 1000);
}

function pararTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function atualizarTimerUI() {
  const el = document.getElementById('timer-display');
  if (!el) return;

  el.textContent = timerRestante;

  // Remove classes anteriores
  el.className = 'timer-display';
  if (timerRestante <= 10) el.classList.add('timer-danger');
  else if (timerRestante <= 20) el.classList.add('timer-warning');

  // Atualiza anel SVG
  const ring = document.getElementById('timer-ring');
  if (ring) {
    const circumference = 2 * Math.PI * 16; // r=16
    const offset = circumference - (timerRestante / TIMER_SEGUNDOS) * circumference;
    ring.style.strokeDasharray  = circumference;
    ring.style.strokeDashoffset = offset;

    if (timerRestante <= 10)      ring.style.stroke = '#ef4444';
    else if (timerRestante <= 20) ring.style.stroke = '#f97316';
    else                          ring.style.stroke = '#22d3ee';
  }
}

function onTimerEsgotado() {
  if (locked) return;
  locked = true;

  const q = QUESTIONS[current];

  // Conta como errada (sem resposta)
  answers.push({ questionIdx: current, chosen: -1, correct: q.correct, right: false });

  // Desabilita opções e revela a correta
  document.querySelectorAll('.option').forEach(el => el.classList.add('disabled'));
  const correctEl = document.querySelector(`.option[data-idx="${q.correct}"]`);
  if (correctEl) {
    correctEl.classList.add('reveal-correct');
    correctEl.querySelector('.option-circle').innerHTML = '<i class="fa-solid fa-check"></i>';
  }

  document.getElementById('footer-hint').textContent = '⏱ Tempo esgotado!';
  showToast(false, `Tempo! Certa: "${q.options[q.correct]}"`);

  setTimeout(() => {
    if (current < QUESTIONS.length - 1) {
      transitionTo(current + 1);
    } else {
      saveProgress(faseAtual, score, QUESTIONS.length);
      transitionToReport();
    }
  }, 1800);
}

/* ═══════════════════════════════════════════════════════════
   RENDER QUESTION
═══════════════════════════════════════════════════════════ */
function renderQuestion() {
  locked = false;
  const q     = QUESTIONS[current];
  const total = QUESTIONS.length;

  document.getElementById('prog-badge').textContent    = `Pergunta ${current + 1}/${total}`;
  document.getElementById('score-val').textContent      = score;
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

  // Timer widget (só para não-admins)
  const timerHtml = timerAtivo ? `
    <div class="timer-wrap">
      <svg class="timer-svg" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>
        <circle id="timer-ring" cx="20" cy="20" r="16" fill="none"
          stroke="#22d3ee" stroke-width="3" stroke-linecap="round"
          style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 0.9s linear, stroke 0.3s"/>
      </svg>
      <span class="timer-display" id="timer-display">${TIMER_SEGUNDOS}</span>
    </div>` : '';

  const labels   = ['A', 'B', 'C', 'D'];
  const optsHtml = q.options.map((opt, i) => `
    <div class="option" data-idx="${i}" onclick="chooseOption(${i})">
      <div class="option-circle">${labels[i]}</div>
      <div class="option-text">${opt}</div>
    </div>
  `).join('');

  document.getElementById('question-area').innerHTML = `
    <div class="question-header">
      <div class="question-num">Pergunta ${current + 1} de ${total}</div>
      ${timerHtml}
    </div>
    <div class="question-text">${q.question}</div>
    <div class="options">${optsHtml}</div>
  `;

  // Inicia o timer depois de montar o DOM
  iniciarTimer();
}

/* ═══════════════════════════════════════════════════════════
   CHOOSE OPTION
═══════════════════════════════════════════════════════════ */
function chooseOption(idx) {
  if (locked) return;
  locked = true;
  pararTimer();

  const q       = QUESTIONS[current];
  const correct = q.correct;
  const isRight = idx === correct;

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

  // Mostra explicação se disponível
  if (q.explanation) {
    setTimeout(() => {
      const area = document.getElementById('question-area');
      const explanationEl = document.createElement('div');
      explanationEl.className = 'explanation ' + (isRight ? 'explanation-correct' : 'explanation-wrong');
      explanationEl.innerHTML = `<i class="fa-solid fa-lightbulb"></i> ${q.explanation}`;
      area.appendChild(explanationEl);
    }, 300);
  }

  // Footer hint
  document.getElementById('footer-hint').textContent = isRight ? '✓ Correto!' : '✗ Resposta errada';

  // Toast
  showToast(isRight, isRight ? 'Correto! Muito bem! 🎉' : `Errado. Certa: "${q.options[correct]}"`);

  // Auto-advance after 1.8s (um pouco mais para ler a explicação)
  setTimeout(() => {
    if (current < QUESTIONS.length - 1) {
      transitionTo(current + 1);
    } else {
      saveProgress(faseAtual, score, QUESTIONS.length);
      transitionToReport();
    }
  }, 1800);
}

/* ═══════════════════════════════════════════════════════════
   TRANSITIONS
═══════════════════════════════════════════════════════════ */
function transitionTo(next) {
  pararTimer();
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
  pararTimer();
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
  if (pct === 100)      { msg = '🏆 Perfeito!';             sub = 'Pontuação máxima! Você domina este conteúdo!'; }
  else if (pct >= 80)   { msg = '⭐ Excelente!';            sub = 'Quase perfeito — muito bem!'; }
  else if (pct >= 60)   { msg = '👍 Bom trabalho!';         sub = 'Revise os pontos que errou e siga em frente.'; }
  else if (pct >= 40)   { msg = '📚 Continue estudando';    sub = 'Vale revisar a documentação antes de avançar.'; }
  else                  { msg = '🔄 Vamos tentar de novo?'; sub = 'Não desista! Releia o conteúdo e tente novamente.'; }

  const temProxima = faseAtual < TOTAL_FASES;

  // Header update
  document.getElementById('prog-badge').textContent      = 'Resultado Final';
  document.getElementById('score-val').textContent       = score;
  document.getElementById('progress-fill').style.width  = '100%';
  document.getElementById('footer-hint').textContent    = 'Quiz concluído!';

  const dotsEl = document.getElementById('footer-dots');
  dotsEl.innerHTML = '';
  QUESTIONS.forEach(() => {
    const d = document.createElement('div');
    d.className = 'dot done';
    dotsEl.appendChild(d);
  });

  // Detalhes por questão
  const detailsHtml = answers.map((a) => {
    const q   = QUESTIONS[a.questionIdx];
    const cls  = a.right ? 'item-correct' : 'item-wrong';
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
        ${q.explanation ? `<div class="detail-row">
          <span class="detail-label">Dica</span>
          <span class="detail-val">${q.explanation}</span>
        </div>` : ''}
      </div>
    `;
  }).join('');

  // Botões — próxima fase, boss final ou voltar ao mapa
  const isBossNext = faseAtual + 1 === TOTAL_FASES;
  const botoesHtml = temProxima
    ? `<div class="btn-row">
        <button class="btn btn-primary" onclick="irParaProximaFase()">
          <i class="fa-solid fa-${isBossNext ? 'skull-crossbones' : 'chevron-right'}"></i> ${isBossNext ? 'Enfrentar o Boss!' : 'Próxima Fase'}
        </button>
        <button class="btn btn-secondary" onclick="restartQuiz()">
          <i class="fa-solid fa-rotate-left"></i> Refazer
        </button>
      </div>
      <div style="text-align:center;margin-top:0.8rem">
        <a href="mapa.html" style="font-size:0.8rem;color:#94a3b8;text-decoration:none">
          <i class="fa-solid fa-map" style="margin-right:4px"></i>Ver mapa de fases
        </a>
      </div>`
    : `<div class="btn-row">
        <button class="btn btn-primary" onclick="window.location.href='mapa.html'">
          <i class="fa-solid fa-trophy"></i> Ver mapa completo
        </button>
        <button class="btn btn-secondary" onclick="restartQuiz()">
          <i class="fa-solid fa-rotate-left"></i> Refazer
        </button>
      </div>`;

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

      ${botoesHtml}
    </div>
  `;

  document.getElementById('footer-hint').textContent = `${pct}% de aproveitamento`;

  // Anima anel e barra
  requestAnimationFrame(() => {
    setTimeout(() => {
      const circumference = 2 * Math.PI * 34;
      const offset = circumference - (pct / 100) * circumference;
      const ringEl = document.getElementById('ring-fill');
      if (ringEl) {
        ringEl.style.strokeDasharray  = circumference;
        ringEl.style.strokeDashoffset = offset;
        ringEl.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s';
      }
      const barEl = document.getElementById('perf-bar');
      if (barEl) barEl.style.width = pct + '%';
    }, 80);
  });
}

function irParaProximaFase() {
  const proxima = faseAtual + 1;
  if (proxima === TOTAL_FASES) {
    // Fase 7 é o Boss Final — vai direto pro jogo
    window.location.href = '../index.html';
  } else if (proxima < TOTAL_FASES) {
    window.location.href = `quiz.html?fase=${proxima}`;
  }
}

/* ═══════════════════════════════════════════════════════════
   RESTART
═══════════════════════════════════════════════════════════ */
function restartQuiz() {
  pararTimer();
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
   TOAST
═══════════════════════════════════════════════════════════ */
function showToast(correct, message) {
  const toast  = document.getElementById('toast');
  const iconEl = document.getElementById('toast-icon');
  const msgEl  = document.getElementById('toast-msg');

  clearTimeout(toastTimer);
  toast.classList.remove('show', 'correct-toast', 'wrong-toast');

  iconEl.className  = 'fa-solid toast-icon ' + (correct ? 'fa-circle-check' : 'fa-circle-xmark');
  msgEl.textContent = message;
  toast.classList.add(correct ? 'correct-toast' : 'wrong-toast');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
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
      width: ${size}px; height: ${size}px;
      left: ${left}%;
      --drift: ${drift}px; --swell: ${swell};
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(b);
  }
}