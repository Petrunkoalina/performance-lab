import { setState } from '../utils/storage.js';

const PROFILE_QUESTIONS = [
  { key:'level', q:'Какой у вас сейчас уровень digital marketing?', type:'choice', options:['Полный новичок','Базовые знания (читал/смотрел, не работал руками)','Есть небольшой практический опыт','Работаю в маркетинге, хочу узкую специализацию'] },
  { key:'hasAdAccounts', q:'Вы когда-нибудь работали внутри рекламных кабинетов (Google Ads, Meta Ads и т.п.)?', type:'bool' },
  { key:'knowsGoogleAds', q:'Насколько хорошо вы знаете Google Ads?', type:'choice', options:['Совсем не знаю','Слышал(а) базовые термины','Настраивал(а) кампании','Уверенно работаю'] },
  { key:'knowsMetaAds', q:'Насколько хорошо вы знаете Meta Ads (Facebook/Instagram)?', type:'choice', options:['Совсем не знаю','Слышал(а) базовые термины','Настраивал(а) кампании','Уверенно работаю'] },
  { key:'knowsMetrics', q:'Понимаете ли вы разницу между CTR, CPC, CPA и ROAS?', type:'bool' },
  { key:'hasAnalytics', q:'Есть ли у вас опыт работы с аналитикой (GA4, UTM, отчёты)?', type:'bool' },
  { key:'hoursPerWeek', q:'Сколько часов в неделю вы готовы уделять обучению?', type:'choice', options:['2-3 часа','5-7 часов','8-12 часов','12+ часов'] },
  { key:'startTimeline', q:'Когда вы планируете начать предлагать услуги performance-специалиста?', type:'choice', options:['Уже предлагаю / есть клиенты','Через 1-2 месяца','После полного прохождения курса','Пока не уверен(а)'] },
  { key:'niche', q:'В какой нише вам интереснее всего практиковаться?', type:'choice', options:['Beauty / e-commerce','B2B SaaS','Локальные услуги','Своя ниша (укажу в заметках)'] },
  { key:'goal', q:'Какая у вас основная цель?', type:'choice', options:['Устроиться в компанию','Работать на фрилансе','Открыть своё агентство','Пока изучаю варианты'] },
];

const PLACEMENT_QUESTIONS = [
  { q:'CTR рассчитывается как:', options:['Clicks ÷ Conversions','Clicks ÷ Impressions × 100%','Spend ÷ Clicks','Revenue ÷ Spend'], correct:1 },
  { q:'ROAS показывает:', options:['Прибыль в процентах','Выручку на единицу рекламных затрат','Количество показов','Стоимость клика'], correct:1 },
  { q:'CPA — это:', options:['Cost Per Action, стоимость целевого действия','Клики за час','Аудитория конкурента','Тип объявления'], correct:0 },
  { q:'Break-even ROAS зависит в первую очередь от:', options:['Времени суток','Маржинальности товара','Цвета креатива','Названия кампании'], correct:1 },
  { q:'В классической воронке "Awareness → Consideration → Conversion → Retention" LTV важнее всего на этапе:', options:['Awareness','Consideration','Conversion','Retention'], correct:3 },
  { q:'Negative keywords в Google Ads нужны, чтобы:', options:['Увеличить бюджет','Исключить нерелевантные показы','Ускорить модерацию','Повысить CTR искусственно'], correct:1 },
  { q:'Custom Audience в рекламных кабинетах строится на основе:', options:['Случайного списка интересов','Собственных данных бизнеса','Только возраста','Названия бренда'], correct:1 },
  { q:'UTM_medium обычно обозначает:', options:['Название кампании','Тип канала (например, cpc)','Вариант креатива','Дату запуска'], correct:1 },
  { q:'Если у кампании высокий CTR, но нет конверсий, в первую очередь стоит проверить:', options:['Landing page и message match','Логотип компании','Название домена','Курс валют'], correct:0 },
  { q:'Учиться в разговорном интерфейсе (например, ChatGPT) пользователь чаще всего раскрывает намерение через:', options:['Один короткий поисковый запрос','Контекст всего диалога','Клик по баннеру','Систему тегов'], correct:1 },
  { q:'Daily budget в большинстве рекламных платформ — это:', options:['Абсолютный лимит на каждый день без исключений','Целевой средний расход, который может колебаться день ото дня','Плата за один клик','Комиссия платформы'], correct:1 },
  { q:'CAC отличается от CPA тем, что:', options:['Это одно и то же','CAC шире и включает все затраты на привлечение клиента, а не только рекламу','CAC всегда меньше CPA','CAC применим только к B2B'], correct:1 },
];

function optionRow(key, idx, label, selected){
  return `<button class="quiz-option ${selected===idx?'selected':''}" data-key="${key}" data-idx="${idx}">${label}</button>`;
}

export function mount(root, { onDone }){
  let step = 0; // 0..profileQuestions-1 = profile, then placement
  const answers = {};
  const placementAnswers = new Array(PLACEMENT_QUESTIONS.length).fill(null);
  const totalSteps = 1 + PROFILE_QUESTIONS.length + 1 + 1; // intro + profile + placement + result

  function renderIntro(){
    root.innerHTML = `
      <div class="card" style="text-align:center">
        <div class="pill tag-chatgpt" style="margin-bottom:16px">Performance Lab</div>
        <h1 style="font-size:34px;margin-bottom:14px">Добро пожаловать в вашу персональную школу performance-маркетинга</h1>
        <p class="section-sub" style="max-width:520px;margin:0 auto 24px">Ответьте на несколько вопросов о вашем опыте — мы построим маршрут обучения именно под вас, с фокусом на ChatGPT Ads Manager.</p>
        <button class="btn" id="startBtn">Начать (2 минуты)</button>
      </div>`;
    root.querySelector('#startBtn').onclick = ()=>{ step=1; renderProfileQuestion(0); };
  }

  function renderProfileQuestion(i){
    const item = PROFILE_QUESTIONS[i];
    const pct = Math.round(((i+1)/(PROFILE_QUESTIONS.length+PLACEMENT_QUESTIONS.length))*100);
    root.innerHTML = `
      <div class="card">
        <div class="progress-track" style="margin-bottom:20px"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="section-sub">Вопрос ${i+1} из ${PROFILE_QUESTIONS.length} · О вас</div>
        <h2 style="margin-bottom:18px">${item.q}</h2>
        <div id="optionsWrap">
          ${item.type==='bool'
            ? [true,false].map(v=>optionRow('x', v?1:0, v?'Да':'Нет', answers[item.key]===v?(v?1:0):null)).join('')
            : item.options.map((o,idx)=>optionRow('x', idx, o, answers[item.key]===idx?idx:null)).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:20px">
          <button class="btn secondary" id="backBtn" ${i===0?'disabled':''}>Назад</button>
          <button class="btn" id="nextBtn" disabled>Далее</button>
        </div>
      </div>`;
    const opts = root.querySelectorAll('.quiz-option');
    const nextBtn = root.querySelector('#nextBtn');
    opts.forEach(btn=>{
      btn.onclick = ()=>{
        opts.forEach(o=>o.classList.remove('selected'));
        btn.classList.add('selected');
        const idx = Number(btn.dataset.idx);
        answers[item.key] = item.type==='bool' ? !!idx : idx;
        nextBtn.disabled = false;
      };
    });
    if (answers[item.key] !== undefined){ nextBtn.disabled=false; }
    root.querySelector('#backBtn').onclick = ()=>{ if(i>0) renderProfileQuestion(i-1); else renderIntro(); };
    nextBtn.onclick = ()=>{
      if (i+1 < PROFILE_QUESTIONS.length) renderProfileQuestion(i+1);
      else renderPlacementQuestion(0);
    };
  }

  function renderPlacementQuestion(i){
    const item = PLACEMENT_QUESTIONS[i];
    const pct = Math.round(((PROFILE_QUESTIONS.length+i+1)/(PROFILE_QUESTIONS.length+PLACEMENT_QUESTIONS.length))*100);
    root.innerHTML = `
      <div class="card">
        <div class="progress-track" style="margin-bottom:20px"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="section-sub">Входной тест · вопрос ${i+1} из ${PLACEMENT_QUESTIONS.length}</div>
        <h2 style="margin-bottom:18px">${item.q}</h2>
        <div id="optionsWrap">${item.options.map((o,idx)=>optionRow('x', idx, o, placementAnswers[i]===idx?idx:null)).join('')}</div>
        <div style="display:flex;justify-content:space-between;margin-top:20px">
          <button class="btn secondary" id="backBtn">Назад</button>
          <button class="btn" id="nextBtn" ${placementAnswers[i]===null?'disabled':''}>${i+1<PLACEMENT_QUESTIONS.length?'Далее':'Завершить тест'}</button>
        </div>
      </div>`;
    const opts = root.querySelectorAll('.quiz-option');
    const nextBtn = root.querySelector('#nextBtn');
    opts.forEach(btn=>{
      btn.onclick = ()=>{
        opts.forEach(o=>o.classList.remove('selected'));
        btn.classList.add('selected');
        placementAnswers[i] = Number(btn.dataset.idx);
        nextBtn.disabled = false;
      };
    });
    root.querySelector('#backBtn').onclick = ()=>{ if(i>0) renderPlacementQuestion(i-1); else renderProfileQuestion(PROFILE_QUESTIONS.length-1); };
    nextBtn.onclick = ()=>{
      if (i+1 < PLACEMENT_QUESTIONS.length) renderPlacementQuestion(i+1);
      else finish();
    };
  }

  function finish(){
    const correct = placementAnswers.filter((a,i)=>a===PLACEMENT_QUESTIONS[i].correct).length;
    const scorePct = Math.round(correct/PLACEMENT_QUESTIONS.length*100);
    let level = 'Starter';
    if (scorePct>=75) level='Confident Beginner';
    if (scorePct>=90) level='Junior+';
    const hoursMap = {0:2,1:6,2:10,3:14};
    setState(s=>{
      s.onboarded = true;
      s.profile = {
        ...s.profile,
        level: PROFILE_QUESTIONS[0].options[answers.level] || 'не указан',
        hasAdAccounts: !!answers.hasAdAccounts,
        knowsGoogleAds: PROFILE_QUESTIONS.find(q=>q.key==='knowsGoogleAds').options[answers.knowsGoogleAds],
        knowsMetaAds: PROFILE_QUESTIONS.find(q=>q.key==='knowsMetaAds').options[answers.knowsMetaAds],
        knowsMetrics: !!answers.knowsMetrics,
        hasAnalytics: !!answers.hasAnalytics,
        hoursPerWeek: hoursMap[answers.hoursPerWeek] ?? 5,
        startTimeline: PROFILE_QUESTIONS.find(q=>q.key==='startTimeline').options[answers.startTimeline],
        niche: PROFILE_QUESTIONS.find(q=>q.key==='niche').options[answers.niche],
        goal: PROFILE_QUESTIONS.find(q=>q.key==='goal').options[answers.goal],
      };
      s.placementScore = { score: scorePct, correct, total: PLACEMENT_QUESTIONS.length, level };
    });

    root.innerHTML = `
      <div class="card" style="text-align:center">
        <div class="pill tag-completed" style="margin-bottom:16px">Готово</div>
        <h2 style="margin-bottom:10px">Ваш стартовый уровень: ${level}</h2>
        <p class="section-sub">Правильных ответов во входном тесте: ${correct} из ${PLACEMENT_QUESTIONS.length} (${scorePct}%)</p>
        <p style="max-width:520px;margin:0 auto 20px;font-size:14px;color:var(--text-soft)">Незнание интерфейса ChatGPT Ads не влияет на этот результат — большинство вопросов проверяли общие принципы маркетинга и метрик. Ваш персональный маршрут учитывает ${(hoursMap[answers.hoursPerWeek] ?? 5)} ч/нед и цель: «${PROFILE_QUESTIONS.find(q=>q.key==='goal').options[answers.goal]}».</p>
        <button class="btn" id="goDash">Перейти на Dashboard</button>
      </div>`;
    root.querySelector('#goDash').onclick = onDone;
  }

  renderIntro();
}

export function render(){ return ''; }
