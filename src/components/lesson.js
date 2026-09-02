import { getLesson, nextLessonAfter, MODULES } from '../data/curriculum.js';
import { getState, setState, markLessonComplete, isLessonComplete, logMinutes, addWeakTopic, clearWeakTopic } from '../utils/storage.js';
import { icon } from '../utils/icons.js';
import { formatExplanation } from '../utils/textFormat.js';

const SOURCE_BADGE = { confirmed:'source-confirmed', beta:'source-beta', limited:'source-limited', hypothesis:'source-hypothesis' };
const SOURCE_LABEL = { confirmed:'Confirmed', beta:'Beta', limited:'Limited', hypothesis:'Strategic Hypothesis' };

export function render(params){
  const lesson = getLesson(params.id);
  if (!lesson) return `<div class="card"><h2>Урок не найден</h2><a class="btn" href="#/learning-path">К Learning Path</a></div>`;
  const alreadyDone = isLessonComplete(lesson.id);

  return `
  <a href="#/learning-path" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-soft);font-size:13px;margin-bottom:14px;text-decoration:none">${icon('arrowLeft')} К модулю «${lesson.moduleTitle}»</a>

  ${lesson.sourceLevel ? `<div style="margin-bottom:10px"><span class="source-badge ${SOURCE_BADGE[lesson.sourceLevel]}">${SOURCE_LABEL[lesson.sourceLevel]}</span> <span style="font-size:12px;color:var(--text-soft)">${lesson.sourceNote||''}</span></div>` : ''}

  <h1 style="margin-bottom:6px">${lesson.title}</h1>
  <p class="section-sub">${lesson.duration} минут ${alreadyDone?'· <span class="pill tag-completed">Пройдено</span>':''}</p>

  <div class="lesson-block">
    <h4>1 · Введение</h4>
    <p class="lesson-lede">${lesson.intro}</p>
    <div class="lesson-body">${formatExplanation(lesson.explanation)}</div>
  </div>

  <div class="lesson-block">
    <h4>2 · Терминология</h4>
    <div class="grid grid-2">
      ${lesson.terms.map(t=>`<div class="callout term"><b>${t.term}</b> <span style="color:var(--text-soft);font-size:12px">(${t.en})</span><br><span style="font-size:13.5px">${t.def}</span></div>`).join('')}
    </div>
  </div>

  ${lesson.visualHtml ? `<div class="lesson-block"><h4>3 · Схема</h4>${lesson.visualHtml}</div>` : ''}

  <div class="lesson-block">
    <h4>4 · Пример из практики</h4>
    <div class="callout example">${lesson.example}</div>
  </div>

  <div class="lesson-block">
    <h4>5 · Типичная ошибка новичка</h4>
    <div class="callout mistake">${lesson.mistake}</div>
  </div>

  <div class="lesson-block">
    <h4>6 · Мини-упражнение</h4>
    <div class="card-sm card">
      <p style="margin-bottom:12px">${lesson.miniExercise.prompt}</p>
      <div id="miniExOptions">${lesson.miniExercise.options.map((o,idx)=>`<button class="quiz-option" data-idx="${idx}">${o}</button>`).join('')}</div>
      <div id="miniExFeedback" style="margin-top:8px;font-size:13px"></div>
    </div>
  </div>

  <div class="lesson-block">
    <h4>7 · Проверка: тест</h4>
    <div id="quizWrap">
      ${lesson.quiz.map((q,qi)=>`<div class="card-sm card" style="margin-bottom:12px" data-qidx="${qi}">
        <p style="margin-bottom:10px;font-weight:600">${qi+1}. ${q.q}</p>
        <div class="quizOptions">${q.options.map((o,idx)=>`<button class="quiz-option" data-idx="${idx}">${o}</button>`).join('')}</div>
        <div class="quizExplain" style="display:none;margin-top:8px;font-size:13px;color:var(--text-soft)"></div>
      </div>`).join('')}
      <button class="btn" id="checkQuizBtn">Проверить ответы</button>
      <span id="quizScore" style="margin-left:10px;font-weight:700"></span>
    </div>
  </div>

  <div class="lesson-block">
    <h4>8 · Резюме</h4>
    <p>${lesson.summary}</p>
  </div>

  <div class="lesson-block">
    <h4>9 · Карточки для повторения</h4>
    <div class="grid grid-2">
      ${lesson.flashcards.map((f,i)=>`<div class="flashcard" data-i="${i}" data-side="front">${f.front}</div>`).join('')}
    </div>
  </div>

  <div class="lesson-block">
    <h4>10 · Связь с ChatGPT Ads</h4>
    <div class="callout term" style="background:var(--mint)">${lesson.chatgptLink}</div>
  </div>

  <div class="lesson-block">
    <h4>11 · Что изучать дальше</h4>
    <p style="color:var(--text-soft)">${lesson.nextUp}</p>
  </div>

  <div class="card" style="text-align:center;background:var(--surface)">
    <button class="btn" id="completeBtn" ${alreadyDone?'disabled':'disabled'}>${alreadyDone?'Урок уже пройден ✓':'Сначала пройдите тест выше'}</button>
  </div>
  `;
}

export function mount(root, params){
  const lesson = getLesson(params.id);
  const startTime = Date.now();
  let miniExDone = false;
  let quizChecked = false;
  let quizScore = 0;

  // mini exercise
  const miniWrap = root.querySelector('#miniExOptions');
  miniWrap.querySelectorAll('.quiz-option').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = Number(btn.dataset.idx);
      miniWrap.querySelectorAll('.quiz-option').forEach(o=>o.classList.remove('selected','correct','incorrect'));
      const fb = root.querySelector('#miniExFeedback');
      if (idx === lesson.miniExercise.correct){
        btn.classList.add('correct');
        fb.innerHTML = `<span style="color:var(--mint-d)">✓ Верно.</span> ${lesson.miniExercise.hint}`;
      } else {
        btn.classList.add('incorrect');
        fb.innerHTML = `<span style="color:var(--coral)">Не совсем.</span> ${lesson.miniExercise.hint}`;
      }
      miniExDone = true;
    });
  });

  // flashcards flip
  root.querySelectorAll('.flashcard').forEach(card=>{
    card.addEventListener('click', ()=>{
      const i = Number(card.dataset.i);
      const isFront = card.dataset.side==='front';
      card.dataset.side = isFront ? 'back' : 'front';
      card.textContent = isFront ? lesson.flashcards[i].back : lesson.flashcards[i].front;
      card.style.background = isFront ? 'var(--yellow)' : 'var(--surface)';
    });
  });

  // quiz
  const quizAnswers = new Array(lesson.quiz.length).fill(null);
  root.querySelectorAll('#quizWrap [data-qidx]').forEach(block=>{
    const qi = Number(block.dataset.qidx);
    block.querySelectorAll('.quiz-option').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if (quizChecked) return;
        block.querySelectorAll('.quiz-option').forEach(o=>o.classList.remove('selected'));
        btn.classList.add('selected');
        quizAnswers[qi] = Number(btn.dataset.idx);
      });
    });
  });

  root.querySelector('#checkQuizBtn').addEventListener('click', ()=>{
    if (quizAnswers.some(a=>a===null)){ alert('Ответьте на все вопросы теста.'); return; }
    quizChecked = true;
    let correct = 0;
    root.querySelectorAll('#quizWrap [data-qidx]').forEach(block=>{
      const qi = Number(block.dataset.qidx);
      const q = lesson.quiz[qi];
      block.querySelectorAll('.quiz-option').forEach((btn,idx)=>{
        if (idx===q.correct) btn.classList.add('correct');
        else if (idx===quizAnswers[qi]) btn.classList.add('incorrect');
      });
      if (quizAnswers[qi]===q.correct) correct++;
      const ex = block.querySelector('.quizExplain');
      ex.style.display='block';
      ex.textContent = q.explain;
    });
    quizScore = Math.round(correct/lesson.quiz.length*100);
    root.querySelector('#quizScore').textContent = `${correct}/${lesson.quiz.length} (${quizScore}%)`;
    root.querySelector('#checkQuizBtn').disabled = true;

    const completeBtn = root.querySelector('#completeBtn');
    completeBtn.disabled = false;
    completeBtn.textContent = 'Завершить урок';
  });

  root.querySelector('#completeBtn').addEventListener('click', ()=>{
    if (isLessonComplete(lesson.id)) return;
    markLessonComplete(lesson.id, quizScore);
    const minutes = Math.max(3, Math.round((Date.now()-startTime)/60000));
    logMinutes(minutes);

    setState(s=>{
      const key = lesson.category==='chatgpt' ? 'chatgptAds' : lesson.category==='ppc' ? 'ppc' : lesson.category==='analytics' ? 'analytics' : lesson.category==='career' ? 'clientComm' : 'strategy';
      s.scores[key] = Math.min(100, (s.scores[key]||0) + 3);
      s.scores.strategy = Math.min(100, (s.scores.strategy||0) + 1);
    });

    if (quizScore < 70) addWeakTopic(lesson.title);
    else clearWeakTopic(lesson.title);

    const next = nextLessonAfter(lesson.id);
    root.querySelector('.card[style*="text-align:center"]').innerHTML = `
      <div class="pill tag-completed" style="margin-bottom:12px">Урок завершён</div>
      <p style="margin-bottom:16px">${quizScore>=70 ? 'Отличный результат!' : 'Тема пока даётся непросто — она добавлена в очередь повторения.'}</p>
      ${next ? `<a class="btn" href="#/lesson/${next.id}">Следующий урок: ${next.title} ${icon('arrowRight')}</a>` : `<a class="btn" href="#/learning-path">К Learning Path</a>`}
    `;
  });
}
