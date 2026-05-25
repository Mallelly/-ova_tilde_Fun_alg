/* =============================================
   OVA: Aprendamos a usar correctamente la tilde
   Archivo: js/aplicacion.js
   ============================================= */

/* =============================================
   1. NAVEGACIÓN SPA - Cambio de secciones
   ============================================= */

/**
 * Muestra la sección indicada y oculta las demás.
 * @param {string} sectionId - ID sin el prefijo "section-"
 */
function showSection(sectionId) {
  // Ocultar todas las secciones
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.remove('active');
  });

  // Mostrar la sección solicitada
  const target = document.getElementById('section-' + sectionId);
  if (target) {
    target.classList.add('active');
    // Scroll al inicio del contenido
    document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Actualizar estado visual del menú
  updateMenuState(sectionId);
}

/**
 * Actualiza clases .active en los ítems del menú según la sección activa.
 */
function updateMenuState(sectionId) {
  // Quitar activo de todos
  document.querySelectorAll('.nav-item, .nav-subitem').forEach(el => {
    el.classList.remove('active');
  });

  // Ítems directos (Inicio, Evaluación)
  document.querySelectorAll('.nav-direct').forEach(btn => {
    if (btn.dataset.section === sectionId) btn.classList.add('active');
  });

  // Subítems
  document.querySelectorAll('.nav-subitem').forEach(btn => {
    if (btn.dataset.section === sectionId) {
      btn.classList.add('active');
      // También abrir el grupo padre
      const submenu = btn.closest('.nav-submenu');
      if (submenu) {
        submenu.classList.add('open');
        const toggle = document.querySelector(`[data-group="${submenu.id.replace('submenu-', '')}"]`);
        if (toggle) toggle.classList.add('open');
      }
    }
  });
}

/* =============================================
   2. MENÚ ACORDEÓN - Submenús desplegables
   ============================================= */

function initAccordionMenu() {
  document.querySelectorAll('.nav-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const groupId = toggle.dataset.group;
      const submenu = document.getElementById('submenu-' + groupId);
      if (!submenu) return;

      const isOpen = submenu.classList.contains('open');

      // Cerrar todos los submenús (comportamiento acordeón)
      document.querySelectorAll('.nav-submenu').forEach(sm => sm.classList.remove('open'));
      document.querySelectorAll('.nav-toggle').forEach(t => t.classList.remove('open'));

      // Abrir el clicado si estaba cerrado
      if (!isOpen) {
        submenu.classList.add('open');
        toggle.classList.add('open');
      }
    });
  });
}

/* =============================================
   3. REGISTRO DE CLICS EN BOTONES DE NAVEGACIÓN
   ============================================= */

function initNavButtons() {
  // Botones directos del sidebar
  document.querySelectorAll('.nav-direct').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });

  // Subítems del sidebar
  document.querySelectorAll('.nav-subitem').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });

  // Botones siguiente/anterior dentro del contenido
  document.querySelectorAll('.btn-next, .btn-prev').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });

  // Tarjetas de unidad en el inicio
  document.querySelectorAll('.unit-card[data-section]').forEach(card => {
    card.addEventListener('click', () => showSection(card.dataset.section));
  });
}

/* =============================================
   4. ACTIVIDAD UNIDAD 1 - Completar oraciones
   ============================================= */

const actividadU1 = [
  {
    oracion: 'El niño juega con el ___ en el parque.',
    respuesta: 'balón',
    pista: 'Palabra aguda: ba-LÓN'
  },
  {
    oracion: 'Tomé un rico ___ con leche esta mañana.',
    respuesta: 'café',
    pista: 'Palabra aguda: ca-FÉ'
  },
  {
    oracion: 'La banda tocó una hermosa ___ en el concierto.',
    respuesta: 'canción',
    pista: 'Palabra aguda: can-CIÓN'
  },
  {
    oracion: 'Mi ___ me preparó una deliciosa sopa.',
    respuesta: 'mamá',
    pista: 'Palabra aguda: ma-MÁ'
  },
  {
    oracion: 'El músico marcaba el ritmo con su ___.',
    respuesta: 'compás',
    pista: 'Palabra aguda: com-PÁS'
  }
];

function buildActivityU1() {
  const container = document.getElementById('activity-u1');
  if (!container) return;
  container.innerHTML = '';

  actividadU1.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
      <p class="activity-question">${i + 1}. ${item.oracion}</p>
      <div class="activity-input">
        <input type="text" id="u1-input-${i}" placeholder="Escribe la palabra..."
          autocomplete="off" autocorrect="off" spellcheck="false" />
        <button class="btn-check" onclick="checkU1(${i})">✔ Verificar</button>
        <button class="btn-check" style="background:#6b8099" onclick="resetU1(${i})">↺ Reintentar</button>
      </div>
      <div class="feedback" id="u1-feedback-${i}"></div>
      <small style="color:#9ab0c2;font-size:12px;margin-top:6px;display:block">💡 Pista: ${item.pista}</small>
    `;
    container.appendChild(card);
  });
}

function checkU1(index) {
  const input = document.getElementById(`u1-input-${index}`);
  const feedback = document.getElementById(`u1-feedback-${index}`);
  const userVal = input.value.trim().toLowerCase();
  const correct = actividadU1[index].respuesta.toLowerCase();

  // Quitar tildes para comparación flexible
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (normalize(userVal) === normalize(correct)) {
    feedback.className = 'feedback correct';
    feedback.textContent = `✅ ¡Excelente! La respuesta correcta es "${actividadU1[index].respuesta}".`;
    input.disabled = true;
  } else if (userVal === '') {
    feedback.className = 'feedback wrong';
    feedback.textContent = '⚠️ Por favor escribe una respuesta.';
  } else {
    feedback.className = 'feedback wrong';
    feedback.textContent = `❌ Respuesta incorrecta. Intenta de nuevo. Recuerda que es una palabra aguda.`;
  }
}

function resetU1(index) {
  const input = document.getElementById(`u1-input-${index}`);
  const feedback = document.getElementById(`u1-feedback-${index}`);
  input.disabled = false;
  input.value = '';
  feedback.className = 'feedback';
  feedback.textContent = '';
}

/* =============================================
   5. ACTIVIDAD UNIDAD 2 - Verdadero o Falso
   ============================================= */

const actividadU2 = [
  {
    afirmacion: 'La palabra "árbol" lleva tilde porque termina en "l" (no es vocal, n ni s).',
    correcto: true,
    explicacion: '¡Correcto! "árbol" es grave y termina en "l", por eso lleva tilde.'
  },
  {
    afirmacion: 'La palabra "mesa" lleva tilde porque es grave.',
    correcto: false,
    explicacion: 'Incorrecto. "mesa" es grave pero termina en vocal "a", así que NO lleva tilde.'
  },
  {
    afirmacion: 'La palabra "lápiz" lleva tilde porque no termina en vocal, n ni s.',
    correcto: true,
    explicacion: '¡Correcto! "lápiz" es grave y termina en "z", por eso lleva tilde.'
  },
  {
    afirmacion: 'La palabra "perro" necesita tilde porque es grave.',
    correcto: false,
    explicacion: 'Incorrecto. "perro" es grave pero termina en vocal "o", así que NO lleva tilde.'
  },
  {
    afirmacion: 'La palabra "difícil" lleva tilde porque termina en "l".',
    correcto: true,
    explicacion: '¡Correcto! "difícil" es grave y termina en "l", por eso lleva tilde.'
  }
];

function buildActivityU2() {
  const container = document.getElementById('activity-u2');
  if (!container) return;
  container.innerHTML = '';

  actividadU2.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
      <p class="activity-question">${i + 1}. ${item.afirmacion}</p>
      <div class="tf-buttons">
        <button class="btn-tf" id="u2-true-${i}" onclick="checkU2(${i}, true)">✅ Verdadero</button>
        <button class="btn-tf" id="u2-false-${i}" onclick="checkU2(${i}, false)">❌ Falso</button>
      </div>
      <div class="feedback" id="u2-feedback-${i}"></div>
    `;
    container.appendChild(card);
  });
}

function checkU2(index, userAnswer) {
  const feedback = document.getElementById(`u2-feedback-${index}`);
  const btnTrue  = document.getElementById(`u2-true-${index}`);
  const btnFalse = document.getElementById(`u2-false-${index}`);
  const item = actividadU2[index];

  // Deshabilitar botones
  btnTrue.disabled  = true;
  btnFalse.disabled = true;

  if (userAnswer === item.correcto) {
    feedback.className = 'feedback correct';
    feedback.textContent = `✅ ¡Correcto! ${item.explicacion}`;
    (userAnswer ? btnTrue : btnFalse).classList.add('selected-correct');
  } else {
    feedback.className = 'feedback wrong';
    feedback.textContent = `❌ Incorrecto. ${item.explicacion}`;
    (userAnswer ? btnTrue : btnFalse).classList.add('selected-wrong');
  }
}

/* =============================================
   6. ACTIVIDAD UNIDAD 3 - Opción múltiple (esdrújulas)
   ============================================= */

const actividadU3 = [
  {
    pregunta: '¿Cuál de estas palabras es esdrújula?',
    opciones: ['canción', 'pájaro', 'árbol', 'papel'],
    correcta: 1,
    explicacion: '"pájaro" es esdrújula: PÁ-ja-ro (acento en la antepenúltima sílaba).'
  },
  {
    pregunta: 'Selecciona la palabra esdrújula:',
    opciones: ['café', 'casa', 'música', 'balón'],
    correcta: 2,
    explicacion: '"música" es esdrújula: MÚ-si-ca.'
  },
  {
    pregunta: '¿Cuál de estas opciones es una palabra esdrújula?',
    opciones: ['difícil', 'miércoles', 'compás', 'azúcar'],
    correcta: 1,
    explicacion: '"miércoles" es esdrújula: MIÉR-co-les.'
  },
  {
    pregunta: 'Identifica la palabra esdrújula:',
    opciones: ['mamá', 'plátano', 'lápiz', 'doctor'],
    correcta: 1,
    explicacion: '"plátano" es esdrújula: PLÁ-ta-no.'
  }
];

function buildActivityU3() {
  const container = document.getElementById('activity-u3');
  if (!container) return;
  container.innerHTML = '';

  actividadU3.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'activity-card';

    const opcionesHTML = item.opciones.map((op, j) => `
      <button class="btn-option" id="u3-opt-${i}-${j}" onclick="checkU3(${i}, ${j})">
        ${String.fromCharCode(65 + j)}. ${op}
      </button>
    `).join('');

    card.innerHTML = `
      <p class="activity-question">${i + 1}. ${item.pregunta}</p>
      <div class="options-list">${opcionesHTML}</div>
      <div class="feedback" id="u3-feedback-${i}"></div>
    `;
    container.appendChild(card);
  });
}

function checkU3(questionIndex, selectedIndex) {
  const item = actividadU3[questionIndex];
  const feedback = document.getElementById(`u3-feedback-${questionIndex}`);

  // Deshabilitar todos los botones de esta pregunta
  item.opciones.forEach((_, j) => {
    const btn = document.getElementById(`u3-opt-${questionIndex}-${j}`);
    btn.disabled = true;
  });

  const selectedBtn = document.getElementById(`u3-opt-${questionIndex}-${selectedIndex}`);
  const correctBtn  = document.getElementById(`u3-opt-${questionIndex}-${item.correcta}`);

  if (selectedIndex === item.correcta) {
    selectedBtn.classList.add('correct');
    feedback.className = 'feedback correct';
    feedback.textContent = `✅ ¡Muy bien! ${item.explicacion}`;
  } else {
    selectedBtn.classList.add('wrong');
    correctBtn.classList.add('correct');
    feedback.className = 'feedback wrong';
    feedback.textContent = `❌ No es correcto. ${item.explicacion}`;
  }
}

/* =============================================
   7. ACTIVIDAD UNIDAD 4 - Construir sobreesdrújulas
   ============================================= */

const actividadU4 = [
  { verbo: 'compra', pronombres: ['te', 'lo'], resultado: 'cómpratelo' },
  { verbo: 'escribe', pronombres: ['se', 'lo'], resultado: 'escríbeselo' },
  { verbo: 'gana',   pronombres: ['te', 'la'], resultado: 'gánatela' },
  { verbo: 'repite', pronombres: ['se', 'lo'], resultado: 'repíteselo' }
];

let u4Seleccionados = {};

function buildActivityU4() {
  const container = document.getElementById('activity-u4');
  if (!container) return;
  container.innerHTML = '';

  actividadU4.forEach((item, i) => {
    u4Seleccionados[i] = [];

    const card = document.createElement('div');
    card.className = 'activity-card';

    const pronomsHTML = item.pronombres.map((p, j) => `
      <button class="pronoun-btn" id="u4-pron-${i}-${j}"
        onclick="togglePronoun(${i}, ${j}, '${p}', '${item.verbo}', '${item.resultado}')">
        + ${p}
      </button>
    `).join('');

    card.innerHTML = `
      <p class="activity-question">${i + 1}. Agrega los pronombres al verbo para formar la sobreesdrújula:</p>
      <div class="verb-builder">
        <span class="verb-base">${item.verbo}</span>
        ${pronomsHTML}
        <span style="color:#9ab0c2;font-size:18px">→</span>
        <span class="word-result" id="u4-result-${i}">${item.verbo}...</span>
      </div>
      <div class="feedback" id="u4-feedback-${i}"></div>
    `;
    container.appendChild(card);
  });
}

function togglePronoun(qi, pi, pronoun, verbBase, expected) {
  const sel = u4Seleccionados[qi];
  const resultEl   = document.getElementById(`u4-result-${qi}`);
  const feedbackEl = document.getElementById(`u4-feedback-${qi}`);
  const btn = document.getElementById(`u4-pron-${qi}-${pi}`);

  const idx = sel.indexOf(pronoun);
  if (idx === -1) {
    sel.push(pronoun);
    btn.classList.add('selected');
  } else {
    sel.splice(idx, 1);
    btn.classList.remove('selected');
  }

  const composed = verbBase + sel.join('');
  resultEl.textContent = composed.length > verbBase.length ? composed : verbBase + '...';

  // Normalizar sin tildes para comparar
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (sel.length === actividadU4[qi].pronombres.length) {
    if (normalize(composed) === normalize(expected)) {
      feedbackEl.className = 'feedback correct';
      feedbackEl.textContent = `✅ ¡Perfecto! La sobreesdrújula es: "${expected}"`;
      resultEl.textContent = expected;
    } else {
      feedbackEl.className = 'feedback wrong';
      feedbackEl.textContent = `❌ El orden de los pronombres no es correcto. Intenta otra combinación.`;
    }
  } else {
    feedbackEl.className = 'feedback';
  }
}

/* =============================================
   8. EVALUACIÓN FINAL - Quiz de 5 preguntas
   ============================================= */

const quizPreguntas = [
  {
    texto: '¿En qué sílaba tiene el acento una palabra AGUDA?',
    opciones: ['En la primera sílaba', 'En la última sílaba', 'En la penúltima sílaba', 'En la antepenúltima sílaba'],
    correcta: 1,
    unidad: 'Unidad 1'
  },
  {
    texto: 'La palabra "balón" lleva tilde porque es aguda y termina en:',
    opciones: ['Consonante "l"', 'Vocal', 'La letra "n"', 'La letra "s"'],
    correcta: 2,
    unidad: 'Unidad 1'
  },
  {
    texto: '¿Cuál de estas palabras es GRAVE y lleva tilde correctamente?',
    opciones: ['casa', 'papel', 'árbol', 'canción'],
    correcta: 2,
    unidad: 'Unidad 2'
  },
  {
    texto: 'Las palabras ESDRÚJULAS:',
    opciones: [
      'Solo llevan tilde si terminan en vocal',
      'Nunca llevan tilde',
      'Siempre llevan tilde, sin excepción',
      'Llevan tilde solo si terminan en "n" o "s"'
    ],
    correcta: 2,
    unidad: 'Unidad 3'
  },
  {
    texto: '¿Cuál de las siguientes es una palabra SOBREESDRÚJULA?',
    opciones: ['plátano', 'café', 'cómpratelo', 'árbol'],
    correcta: 2,
    unidad: 'Unidad 4'
  }
];

function buildQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  container.innerHTML = '';

  quizPreguntas.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';

    const opcionesHTML = q.opciones.map((op, j) => `
      <label class="quiz-option" id="quiz-label-${i}-${j}">
        <input type="radio" name="q${i}" value="${j}" />
        ${op}
      </label>
    `).join('');

    div.innerHTML = `
      <p class="quiz-question-text">
        <span class="quiz-q-num">${q.unidad}</span>
        ${i + 1}. ${q.texto}
      </p>
      <div class="quiz-options">${opcionesHTML}</div>
    `;
    container.appendChild(div);
  });

  // Botón enviar
  const btnSubmit = document.createElement('button');
  btnSubmit.className = 'btn-submit';
  btnSubmit.textContent = '📩 Enviar Evaluación';
  btnSubmit.onclick = submitQuiz;
  container.appendChild(btnSubmit);

  // Div de resultados
  const resultDiv = document.createElement('div');
  resultDiv.className = 'quiz-result';
  resultDiv.id = 'quiz-result';
  container.appendChild(resultDiv);
}

function submitQuiz() {
  let score = 0;
  let allAnswered = true;

  quizPreguntas.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) { allAnswered = false; return; }

    const selectedVal = parseInt(selected.value);

    // Marcar respuestas visualmente
    q.opciones.forEach((_, j) => {
      const label = document.getElementById(`quiz-label-${i}-${j}`);
      if (j === q.correcta) {
        label.classList.add('correct-ans');
      } else if (j === selectedVal && selectedVal !== q.correcta) {
        label.classList.add('wrong-ans');
      }
    });

    // Deshabilitar radios
    document.querySelectorAll(`input[name="q${i}"]`).forEach(r => r.disabled = true);

    if (selectedVal === q.correcta) score++;
  });

  if (!allAnswered) {
    alert('⚠️ Por favor responde todas las preguntas antes de enviar.');
    return;
  }

  // Ocultar botón
  document.querySelector('.btn-submit').style.display = 'none';

  // Mostrar resultado
  showQuizResult(score);
}

function showQuizResult(score) {
  const total = quizPreguntas.length;
  const percent = (score / total) * 100;
  const resultDiv = document.getElementById('quiz-result');

  let emoji, message, subMessage, scoreClass;

  if (percent === 100) {
    emoji = '🏆'; scoreClass = 'high';
    message = '¡Felicitaciones! ¡Puntaje perfecto!';
    subMessage = 'Eres un experto en el uso de la tilde. ¡Sigue así!';
  } else if (percent >= 80) {
    emoji = '🌟'; scoreClass = 'high';
    message = '¡Excelente trabajo!';
    subMessage = 'Conoces muy bien las reglas de acentuación. ¡Casi perfecto!';
  } else if (percent >= 60) {
    emoji = '😊'; scoreClass = 'mid';
    message = '¡Buen esfuerzo!';
    subMessage = 'Vas por buen camino. Repasa las unidades que te generaron dudas.';
  } else if (percent >= 40) {
    emoji = '📚'; scoreClass = 'mid';
    message = 'Necesitas repasar un poco más.';
    subMessage = 'Revisa de nuevo las unidades y vuelve a intentarlo. ¡Tú puedes!';
  } else {
    emoji = '💪'; scoreClass = 'low';
    message = '¡No te rindas!';
    subMessage = 'Regresa al inicio y estudia cada unidad con calma. ¡La práctica hace al maestro!';
  }

  resultDiv.innerHTML = `
    <div class="result-emoji">${emoji}</div>
    <div class="result-score ${scoreClass}">${score} / ${total}</div>
    <p class="result-message">${message}</p>
    <p class="result-sub">${subMessage}</p>
    <button class="btn-retry" onclick="retryQuiz()">↺ Intentar de nuevo</button>
  `;

  resultDiv.classList.add('show');
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function retryQuiz() {
  // Reconstruir el quiz limpio
  buildQuiz();
  document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
}

/* =============================================
   9. INICIALIZACIÓN - Todo arranca aquí
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Iniciar menú acordeón
  initAccordionMenu();

  // Iniciar botones de navegación
  initNavButtons();

  // Construir actividades interactivas
  buildActivityU1();
  buildActivityU2();
  buildActivityU3();
  buildActivityU4();

  // Construir evaluación final
  buildQuiz();

  // Mostrar sección de inicio por defecto
  showSection('inicio');
});
