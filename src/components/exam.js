import { getState, setState } from '../utils/storage.js';
import * as calc from '../utils/calc.js';

const QUESTIONS = [
  { skill:'strategy', type:'mcq', q:'Performance marketing отличается от brand marketing тем, что:', options:['Дороже стоит','Привязан к измеримому действию и его стоимости','Не использует рекламу','Работает только в B2B'], correct:1 },
  { skill:'analytics', type:'calc', q:'Spend = €480, Conversions = 24. Чему равен CPA?', answer:20, tolerance:0.5, compute:(v)=>calc.cpa(480,24) },
  { skill:'analytics', type:'calc', q:'Revenue = €3600, Spend = €900. Чему равен ROAS?', answer:4, tolerance:0.1 },
  { skill:'strategy', type:'calc', q:'Маржа товара — 20%. Чему равен Break-even ROAS?', answer:5, tolerance:0.2 },
  { skill:'strategy', type:'mcq', q:'Новый продукт без истории конверсий — какой objective ChatGPT Ads запускать разумнее для начала тестирования спроса?', options:['oCPC','CPM или CPC','Только oCPC','Ни один из вариантов'], correct:1 },
  { skill:'chatgptAds', type:'mcq', q:'Context hints — это:', options:['Exact-match ключевые слова','Описания продукта, аудитории и ситуации использования, не гарантирующие точный показ','Правило таргетинга по возрасту','Синоним объявления'], correct:1 },
  { skill:'chatgptAds', type:'mcq', q:'Сильный context hint скорее всего:', options:['Состоит из одного слова','Описывает конкретную ситуацию использования естественной фразой','Это список ключевых слов через запятую','Всегда указывает точный возраст пользователя'], correct:1 },
  { skill:'chatgptAds', type:'mcq', q:'Maximum bid в ChatGPT Ads задаётся на уровне:', options:['Аккаунта','Ad group','Отдельного объявления','Страны'], correct:1 },
  { skill:'analytics', type:'mcq', q:'Расхождение данных Ads Manager и GA4:', options:['Всегда ошибка','Нормальная ситуация из-за разных моделей атрибуции','Означает мошенничество','Невозможно в принципе'], correct:1 },
  { skill:'strategy', type:'mcq', q:'После резкого увеличения бюджета в 4 раза кампания вероятнее всего:', options:['Мгновенно улучшит результаты','Временно ухудшит результаты из-за сброса learning phase','Не изменится вообще','Автоматически остановится'], correct:1 },
  { skill:'clientComm', type:'mcq', q:'Правильная формула честного сообщения клиенту о проблеме:', options:['Молчать до планового отчёта','Факт → причина → что сделано → что предлагается','Только извинения','Сразу снижать цену услуги'], correct:1 },
  { skill:'clientComm', type:'mcq', q:'Каждый рекламодатель в ChatGPT Ads должен иметь:', options:['Общий аккаунт агентства','Собственный отдельный верифицированный аккаунт','Доступ только через API без аккаунта','Ничего из перечисленного'], correct:1 },
];

function saved(){ return getState().examResult; }

export function render(){
  const prev = saved();
  return `
    <h1 style="margin-bottom:6px">Финальный экзамен</h1>
    <p class="section-sub">${QUESTIONS.length} заданий: теория, расчёты, стратегия ChatGPT Ads, аналитика и клиентская коммуникация.</p>
    ${prev ? renderReport(prev) : `
      <div class="card">
        <div id="examWrap">${QUESTIONS.map((q,i)=>renderQ(q,i)).join('')}</div>
        <button class="btn" id="submitExamBtn" style="margin-top:16px">Завершить экзамен</button>
      </div>
      <div class="card" style="margin-top:16px">
        <h4 style="margin-bottom:8px">Практическая часть (не оценивается автоматически)</h4>
        <p class="section-sub">Перед защитой стратегии убедитесь, что вы прошли: Context Hint Lab, Ad Builder, Campaign Architecture Builder, UTM Builder и Diagnostics Lab — это часть полноценной подготовки к защите стратегии.</p>
      </div>
    `}
  `;
}

function renderQ(q,i){
  if (q.type==='mcq'){
    return `<div class="card-sm" style="border:1px solid var(--outline);border-radius:12px;padding:14px;margin-bottom:10px" data-q="${i}">
      <p style="font-weight:600;margin-bottom:8px">${i+1}. ${q.q}</p>
      ${q.options.map((o,oi)=>`<button class="quiz-option" data-idx="${oi}">${o}</button>`).join('')}
    </div>`;
  }
  return `<div class="card-sm" style="border:1px solid var(--outline);border-radius:12px;padding:14px;margin-bottom:10px" data-q="${i}">
    <p style="font-weight:600;margin-bottom:8px">${i+1}. ${q.q}</p>
    <input class="input calc-answer" type="number" step="any" style="max-width:160px">
  </div>`;
}

function renderReport(result){
  const labels = { chatgptAds:'ChatGPT Ads', ppc:'PPC', analytics:'Analytics', strategy:'Strategy', clientComm:'Client communication' };
  const readiness = result.overall>=75 ? 'Готовы к первому пилотному клиенту' : result.overall>=55 ? 'Близки к готовности — повторите слабые темы' : 'Нужно больше практики перед первым клиентом';
  const price = result.overall>=75 ? '€250–400 за pilot campaign' : result.overall>=55 ? '€150–250 за pilot campaign (с расширенным сопровождением)' : 'Начните с бесплатного или символического spec-проекта для портфолио';
  return `
    <div class="card" style="margin-bottom:20px;text-align:center">
      <div class="section-sub">Общий балл</div>
      <div style="font-family:var(--font-display);font-weight:800;font-size:48px">${result.overall}%</div>
      <p style="margin-top:8px">${readiness}</p>
    </div>
    <div class="grid grid-2" style="margin-bottom:20px">
      ${Object.entries(result.bySkill).map(([k,v])=>`<div class="card-sm card">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span>${labels[k]}</span><b>${v}%</b></div>
        <div class="progress-track"><div class="progress-fill" style="width:${v}%"></div></div>
      </div>`).join('')}
    </div>
    <div class="grid grid-2" style="margin-bottom:20px">
      <div class="card"><h4 style="margin-bottom:8px">Сильные стороны</h4><ul style="padding-left:18px">${result.strengths.map(s=>`<li>${s}</li>`).join('')||'<li>Пройдите больше уроков для оценки</li>'}</ul></div>
      <div class="card"><h4 style="margin-bottom:8px">Пробелы для повторения</h4><ul style="padding-left:18px">${result.gaps.map(s=>`<li>${s}</li>`).join('')||'<li>Существенных пробелов не найдено</li>'}</ul></div>
    </div>
    <div class="card" style="margin-bottom:20px">
      <h4 style="margin-bottom:8px">Рекомендуемая стоимость первого пилота</h4>
      <p>${price}</p>
    </div>
    <div class="card">
      <h4 style="margin-bottom:8px">План развития на 30 дней</h4>
      <ol style="padding-left:20px;line-height:1.9">
        <li>Неделя 1: повторить темы из «Пробелов» выше через Learning Path</li>
        <li>Неделя 2: завершить все 3 spec-проекта в разделе Projects</li>
        <li>Неделя 3: пройти Diagnostics Lab и Launch Simulator до 100%</li>
        <li>Неделя 4: подготовить outreach-сообщения и связаться с 5 потенциальными клиентами</li>
      </ol>
    </div>
    <div class="no-print" style="display:flex;gap:10px;margin-top:16px">
      <button class="btn secondary sm" id="retakeBtn">Пройти экзамен заново</button>
      <button class="btn secondary sm" id="printExamBtn">Экспорт в PDF (печать)</button>
    </div>
  `;
}

export function mount(root){
  if (saved()){
    root.querySelector('#retakeBtn')?.addEventListener('click', ()=>{
      setState(s=>{ s.examResult=null; });
      root.innerHTML = render(); mount(root);
    });
    root.querySelector('#printExamBtn')?.addEventListener('click', ()=>window.print());
    return;
  }
  const answers = new Array(QUESTIONS.length).fill(null);
  root.querySelectorAll('[data-q]').forEach(block=>{
    const i = Number(block.dataset.q);
    if (QUESTIONS[i].type==='mcq'){
      block.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click', ()=>{
        block.querySelectorAll('.quiz-option').forEach(o=>o.classList.remove('selected'));
        btn.classList.add('selected');
        answers[i] = Number(btn.dataset.idx);
      }));
    } else {
      block.querySelector('.calc-answer').addEventListener('input', (e)=>{ answers[i] = parseFloat(e.target.value); });
    }
  });

  root.querySelector('#submitExamBtn').addEventListener('click', ()=>{
    const bySkillCorrect = {}; const bySkillTotal = {};
    let strengths=[], gaps=[];
    QUESTIONS.forEach((q,i)=>{
      bySkillTotal[q.skill] = (bySkillTotal[q.skill]||0)+1;
      let ok;
      if (q.type==='mcq') ok = answers[i]===q.correct;
      else ok = answers[i]!=null && Math.abs(answers[i]-q.answer) <= q.tolerance;
      if (ok) bySkillCorrect[q.skill] = (bySkillCorrect[q.skill]||0)+1;
    });
    const bySkill = {};
    ['chatgptAds','ppc','analytics','strategy','clientComm'].forEach(k=>{
      const total = bySkillTotal[k]||0;
      bySkill[k] = total ? Math.round((bySkillCorrect[k]||0)/total*100) : Math.round(getState().scores[k]||0);
    });
    Object.entries(bySkill).forEach(([k,v])=>{
      const label = {chatgptAds:'ChatGPT Ads',ppc:'PPC',analytics:'Analytics',strategy:'Strategy',clientComm:'Client communication'}[k];
      if (v>=75) strengths.push(label); else if (v<55) gaps.push(label);
    });
    const overall = Math.round(Object.values(bySkill).reduce((a,b)=>a+b,0)/Object.values(bySkill).length);
    const result = { overall, bySkill, strengths, gaps, at:Date.now() };
    setState(s=>{ s.examResult = result; });
    root.innerHTML = render(); mount(root);
  });
}
