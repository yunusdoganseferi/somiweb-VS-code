/* =========================================
   VIBES PAGE — vibes.js
   ========================================= */

// ---- MOOD TRACKER ----

const STORAGE_KEY = 'somilab_mood_log';
const TODAY = new Date().toISOString().slice(0, 10);

const EMOJI_MAP = [
  { max: 2,  emoji: '😩' },
  { max: 4,  emoji: '😕' },
  { max: 6,  emoji: '😐' },
  { max: 8,  emoji: '🙂' },
  { max: 10, emoji: '🤩' },
];

function scoreToEmoji(score) {
  return EMOJI_MAP.find(e => score <= e.max)?.emoji ?? '🙂';
}

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLog(log) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

function todaysEntry(log) {
  return log.find(e => e.date === TODAY);
}

function logMood(score) {
  const log = loadLog().filter(e => e.date !== TODAY);
  log.push({ date: TODAY, score });
  if (log.length > 14) log.splice(0, log.length - 14);
  saveLog(log);
}

function showDonePanel(score) {
  document.getElementById('moodInputPanel').style.display = 'none';
  const done = document.getElementById('moodDonePanel');
  done.style.display = 'block';
  document.getElementById('moodDoneEmoji').textContent = scoreToEmoji(score);
  document.getElementById('moodDoneScore').textContent = score;
}

function showInputPanel() {
  document.getElementById('moodDonePanel').style.display = 'none';
  document.getElementById('moodInputPanel').style.display = 'block';
}

function renderHistory() {
  const log = loadLog();
  const wrap = document.getElementById('moodHistoryDots');
  if (!wrap) return;

  wrap.innerHTML = '';

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const entry = log.find(e => e.date === dateStr);

    const dot = document.createElement('div');
    dot.className = 'mood-dot';

    if (entry) {
      const ratio = (entry.score - 1) / 9;
      const r = Math.round(166 + (221 - 166) * ratio);
      const g = Math.round(92 + (131 - 92) * ratio);
      const b = Math.round(92 + (131 - 92) * ratio);
      dot.style.background = `rgb(${r},${g},${b})`;
      dot.textContent = entry.score;
      dot.title = `${dateStr}: ${entry.score}/10 ${scoreToEmoji(entry.score)}`;
    } else {
      dot.style.background = 'var(--gold-pale)';
      dot.style.border = '1px solid var(--border-light)';
      dot.title = dateStr;
    }

    wrap.appendChild(dot);
  }
}

function initMoodTracker() {
  const slider = document.getElementById('moodSlider');
  const scoreNum = document.getElementById('moodScoreNum');
  const submitBtn = document.getElementById('moodSubmit');
  const resetBtn = document.getElementById('moodReset');
  const emojiBtns = document.querySelectorAll('.mood-emoji-btn');

  if (!slider) return;

  const log = loadLog();
  const existing = todaysEntry(log);

  if (existing) {
    showDonePanel(existing.score);
  } else {
    showInputPanel();
  }

  renderHistory();

  // Sync slider fill gradient
  function updateSliderFill(val) {
    const pct = ((val - 1) / 9) * 100;
    slider.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
  }

  updateSliderFill(slider.value);
  scoreNum.textContent = slider.value;

  slider.addEventListener('input', () => {
    const val = parseInt(slider.value, 10);
    scoreNum.textContent = val;
    updateSliderFill(val);
    // Sync emoji buttons
    emojiBtns.forEach(btn => {
      btn.classList.toggle('selected', parseInt(btn.dataset.score) === nearestEmojiScore(val));
    });
  });

  function nearestEmojiScore(val) {
    const scores = [1, 3, 5, 7, 9];
    return scores.reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);
  }

  emojiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const score = parseInt(btn.dataset.score, 10);
      slider.value = score;
      slider.dispatchEvent(new Event('input'));
    });
  });

  submitBtn?.addEventListener('click', () => {
    const score = parseInt(slider.value, 10);
    logMood(score);
    showDonePanel(score);
    renderHistory();
  });

  resetBtn?.addEventListener('click', () => {
    // Remove today's entry to allow re-logging
    const updated = loadLog().filter(e => e.date !== TODAY);
    saveLog(updated);
    showInputPanel();
    renderHistory();
  });
}

// ---- SCIENCE FACTS ----

const FACTS = [
  {
    text: 'The "curse of knowledge" makes it nearly impossible to remember what it felt like not to know something — the very expertise that makes you good at your job can make you a worse teacher.',
    source: 'Cognitive bias research',
  },
  {
    text: 'People reliably mispredict how long they\'ll feel bad after a negative event. We return to baseline happiness much faster than we expect — a phenomenon called affective forecasting error.',
    source: 'Wilson & Gilbert, 2005',
  },
  {
    text: 'Working memory capacity — typically 4 ± 1 "chunks" — predicts academic achievement better than general IQ in several longitudinal studies.',
    source: 'Cowan, 2010',
  },
  {
    text: 'The mere act of writing down a worry before a high-stakes test can free up working memory and measurably improve performance.',
    source: 'Ramirez & Beilock, 2011 · Science',
  },
  {
    text: 'Emotions are partly constructed: the brain uses past experience to predict what you\'re feeling, which means the same racing heart can be interpreted as excitement or anxiety depending on context.',
    source: 'Lisa Feldman Barrett, 2017',
  },
  {
    text: 'Memory is reconstructive, not reproductive. Every time you recall a memory you subtly alter it — and then store the altered version back.',
    source: 'Bartlett, 1932; Loftus, 1974',
  },
  {
    text: 'People consistently underestimate how much others notice and think about them — the "spotlight effect" makes us feel far more observed than we actually are.',
    source: 'Gilovich et al., 2000',
  },
  {
    text: 'Social pain — rejection, ostracism, loss — activates the same neural regions as physical pain. Your brain literally "hurts" when you\'re left out.',
    source: 'Eisenberger et al., 2003 · Science',
  },
  {
    text: 'The brain uses about 20% of the body\'s energy despite being only 2% of its mass — much of that going to the default mode network, which is most active when you\'re doing "nothing."',
    source: 'Raichle & Gusnard, 2002',
  },
  {
    text: 'People in individualist cultures tend to attribute behavior to stable personality traits; people in collectivist cultures tend to attribute the same behavior to situational context.',
    source: 'Cross-cultural social cognition research',
  },
  {
    text: 'You have a "second brain": the enteric nervous system in your gut contains around 500 million neurons and communicates bidirectionally with the brain via the vagus nerve.',
    source: 'Gershon, 1998',
  },
  {
    text: 'Sleep doesn\'t just consolidate memories — it also selectively prunes synapses, keeping strong connections and weakening weak ones. You literally forget things overnight on purpose.',
    source: 'Synaptic homeostasis hypothesis, Tononi & Cirelli',
  },
  {
    text: 'The "generation effect": you remember information far better when you produce it yourself — even if what you generate is wrong — than when you simply read it.',
    source: 'Slamecka & Graf, 1978',
  },
  {
    text: 'People unconsciously synchronize their posture, speech rhythms, and even blinking rates with conversation partners — a phenomenon that predicts how much they like each other.',
    source: 'Behavioral synchrony research',
  },
  {
    text: 'Your sense of "now" is actually about 80 ms in the past. The brain stitches together sensory signals with different processing delays into a unified present moment.',
    source: 'Temporal binding research, Haggard et al.',
  },
  {
    text: 'Moral judgments made in a foreign language are more utilitarian: the emotional distance of a non-native language reduces the "yuck" factor that normally biases us toward deontological thinking.',
    source: 'Keysar et al., 2012 · Psychological Science',
  },
  {
    text: 'People who are asked to carry a warm cup of coffee rate a stranger\'s personality as warmer than people asked to hold a cold drink. Physical temperature bleeds into social warmth.',
    source: 'Williams & Bargh, 2008 · Science',
  },
  {
    text: 'Introspection is surprisingly unreliable: people often confabulate explanations for their choices, unaware of the actual causes — even when experimenters secretly swapped the options they "chose."',
    source: 'Choice blindness · Hall et al., 2005',
  },
  {
    text: 'Expertise doesn\'t just mean "knowing more" — experts perceive the world differently. A chess grandmaster sees meaningful clusters where a novice sees scattered pieces.',
    source: 'Chase & Simon, 1973',
  },
  {
    text: 'The human brain has a negativity bias baked in: negative events activate larger neural responses, are remembered more vividly, and influence behavior more than equally intense positive events.',
    source: 'Baumeister et al., 2001 · Review of General Psychology',
  },
];

let currentFactIndex = -1;

function getDailyFactIndex() {
  const start = new Date('2025-01-01');
  const now = new Date();
  const daysDiff = Math.floor((now - start) / 86400000);
  return daysDiff % FACTS.length;
}

function showFact(index) {
  const f = FACTS[index];
  const numEl = document.getElementById('factNumber');
  const textEl = document.getElementById('factText');
  const sourceEl = document.getElementById('factSource');

  if (!textEl) return;

  // Fade out
  textEl.style.opacity = '0';
  textEl.style.transform = 'translateY(8px)';
  if (numEl) { numEl.style.opacity = '0'; }
  if (sourceEl) { sourceEl.style.opacity = '0'; }

  setTimeout(() => {
    if (numEl) numEl.textContent = String(index + 1).padStart(2, '0');
    textEl.textContent = f.text;
    if (sourceEl) sourceEl.textContent = f.source;

    textEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    textEl.style.opacity = '1';
    textEl.style.transform = 'translateY(0)';
    if (numEl) { numEl.style.transition = 'opacity 0.4s ease'; numEl.style.opacity = '1'; }
    if (sourceEl) { sourceEl.style.transition = 'opacity 0.4s 0.1s ease'; sourceEl.style.opacity = '1'; }
  }, 250);

  currentFactIndex = index;
}

function initFacts() {
  const nextBtn = document.getElementById('factNext');
  if (!nextBtn) return;

  const daily = getDailyFactIndex();
  showFact(daily);

  nextBtn.addEventListener('click', () => {
    const next = (currentFactIndex + 1) % FACTS.length;
    showFact(next);
  });
}

// ---- ENHANCE YOUR VIBE ----

const MEOW_FILES = [
  'sounds/729021__redjamie7__cat-festus-meow-1.mp3',
  'sounds/729022__redjamie7__cat-festus-meow-2.mp3',
  'sounds/729023__redjamie7__cat-festus-meow-3.mp3',
  'sounds/729024__redjamie7__cat-festus-meow-4.mp3',
  'sounds/729025__redjamie7__cat-festus-meow-5.mp3',
  'sounds/729026__redjamie7__cat-festus-meow-6.mp3',
  'sounds/729027__redjamie7__cat-festus-meow-7.mp3',
  'sounds/729031__redjamie7__cat-smokey-meow-1.mp3',
  'sounds/729032__redjamie7__cat-smokey-meow-2.mp3',
];

const _meowPool = MEOW_FILES.map(src => {
  const a = new Audio(src);
  a.preload = 'auto';
  return a;
});

let _meowIndex = 0;

function playMeow() {
  try {
    const audio = _meowPool[_meowIndex];
    audio.currentTime = 0;
    audio.play();
    _meowIndex = (_meowIndex + 1) % _meowPool.length;
  } catch (e) {
    // audio not available
  }
}

const CAT_EMOJIS = ['🐱', '🐈', '😸', '😻', '🐾', '😹', '🙀'];

function launchCats(originEl) {
  const rect = originEl.getBoundingClientRect();
  const ox = rect.left + rect.width / 2;
  const oy = rect.top + rect.height / 2;

  const el = document.createElement('div');
  el.className = 'flying-cat';
  el.textContent = CAT_EMOJIS[Math.floor(Math.random() * CAT_EMOJIS.length)];
  el.style.left = ox + 'px';
  el.style.top  = oy + 'px';

  const angle    = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
  const distance = 180 + Math.random() * 120;
  const tx  = Math.cos(angle) * distance;
  const ty  = Math.sin(angle) * distance;
  const rot = (Math.random() * 360 - 180) + 'deg';

  el.style.setProperty('--tx',  tx  + 'px');
  el.style.setProperty('--ty',  ty  + 'px');
  el.style.setProperty('--rot', rot);

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

function initEnhanceVibe() {
  const btn = document.getElementById('enhanceVibe');
  if (!btn) return;

  btn.addEventListener('click', () => {
    playMeow();
    launchCats(btn);
  });
}

// ---- BOOT ----
document.addEventListener('DOMContentLoaded', () => {
  initMoodTracker();
  initFacts();
  initEnhanceVibe();
});
