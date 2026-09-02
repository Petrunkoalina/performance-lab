import { getState, setState } from '../utils/storage.js';

const PROJECTS = [
  { id:'p1', title:'Проект 1 · Beauty e-commerce', badge:'Spec Project',
    items:['Market overview','Audience research (JTBD, pain points)','Funnel (Awareness→Retention)','Unit economics (AOV, маржа, допустимый CPA)','Conversational intent map','Account structure (Campaign→Ad Group)','Context hints (используйте Context Hint Lab)','15 объявлений (используйте Ad Builder)','Creative testing matrix','Landing page audit','Бюджет и bids','UTM (используйте UTM Builder)','Measurement plan','Launch checklist','Optimization plan','Client report'] },
  { id:'p2', title:'Проект 2 · B2B SaaS lead generation', badge:'Spec Project',
    items:['Сравнение Google Ads vs ChatGPT Ads для этого продукта','Роль каждого канала в воронке','Lead generation strategy','Intent clusters','Campaign structure','Объявления','Допустимый CPL (расчёт)','Итоговый отчёт'] },
  { id:'p3', title:'Проект 3 · Продвижение собственных услуг', badge:'Spec Project',
    items:['Позиционирование ChatGPT Ads Specialist','ICP клиента услуги','Оффер и пакеты услуг','Landing page (описание структуры)','Воронка привлечения клиентов','Campaign structure','Context hints','Объявления','Тестовый бюджет','KPI','Лид-форма (поля)','Tracking plan','План поиска первых 3 клиентов'] },
];

const TEMPLATES = [
  { id:'brief', title:'Client Brief', body:`ПРОДУКТ / ОФФЕР:\n\nЦЕЛЕВАЯ АУДИТОРИЯ:\n\nТЕКУЩИЕ КАНАЛЫ И РЕЗУЛЬТАТЫ:\n\nЭКОНОМИКА (AOV/чек, маржа, LTV):\n\nKPI И ОЖИДАНИЯ:\n\nБЮДЖЕТ:\n\nСРОКИ:\n\nДОСТУПЫ, КОТОРЫЕ ПОНАДОБЯТСЯ:` },
  { id:'proposal', title:'Proposal', body:`ЗАДАЧА КЛИЕНТА:\n\nПРЕДЛАГАЕМОЕ РЕШЕНИЕ:\n\nЧТО ВХОДИТ В ПАКЕТ:\n\nЧТО НЕ ВХОДИТ:\n\nСРОКИ:\n\nСТОИМОСТЬ:\n\nСЛЕДУЮЩИЙ ШАГ:` },
  { id:'sow', title:'Scope of Work', body:`УСЛУГА: \n\nВХОДИТ:\n- \n- \n\nНЕ ВХОДИТ:\n- \n- \n\nОТЧЁТНОСТЬ: (периодичность и формат)\n\nОТВЕТСТВЕННОСТЬ СТОРОН:\n\nUSLOVIYA ИЗМЕНЕНИЯ SCOPE:` },
  { id:'onboarding', title:'Client Onboarding Checklist', body:`☐ Подписан договор / SOW\n☐ Получен доступ к рекламному аккаунту (роль Member)\n☐ Получен доступ к сайту/CMS для проверки tracking\n☐ Получен доступ к аналитике (GA4/CRM)\n☐ Согласован measurement plan\n☐ Согласован формат и периодичность отчётов\n☐ Определён канал коммуникации\n☐ Назначена дата первого отчёта` },
  { id:'access', title:'Access Checklist', body:`☐ ChatGPT Ads Manager — роль Member\n☐ Billing — не требуется (остаётся у клиента)\n☐ Доступ к лендингу для проверки UTM/тегов\n☐ Доступ к GA4 (или созданный отдельный аккаунт)\n☐ Доступ к CRM/таблице лидов (если lead gen)\n☐ Контакт для экстренной связи` },
  { id:'campaignplan', title:'Campaign Plan', body:`ЦЕЛЬ БИЗНЕСА:\n\nРЕКЛАМНАЯ ЦЕЛЬ (objective):\n\nБЮДЖЕТ (тестовый / основной):\n\nСТРУКТУРА (кампании / ad groups):\n\nCONTEXT HINTS (ключевые кластеры):\n\nОБЪЯВЛЕНИЯ (углы подачи):\n\nTRACKING:\n\nСРОК ПЕРВОЙ ОЦЕНКИ РЕЗУЛЬТАТОВ:` },
  { id:'weeklyreport', title:'Weekly Report', body:`ПЕРИОД:\n\nKEY RESULTS: Spend / Impressions / Clicks / CTR / Conversions / CPA / ROAS\n\nЧТО ИЗМЕНИЛИ НА ЭТОЙ НЕДЕЛЕ:\n\nПОЧЕМУ:\n\nПЛАН НА СЛЕДУЮЩУЮ НЕДЕЛЮ:` },
  { id:'monthlyreport', title:'Monthly Report', body:`EXECUTIVE SUMMARY:\n\nПЛАН VS ФАКТ:\n\nСРАВНЕНИЕ С ПРОШЛЫМ МЕСЯЦЕМ:\n\nЧТО СРАБОТАЛО:\n\nЧТО НЕ СРАБОТАЛО И ПОЧЕМУ:\n\nРЕКОМЕНДАЦИИ НА СЛЕДУЮЩИЙ МЕСЯЦ:\n\nTEST BACKLOG:` },
  { id:'audit', title:'Audit Template', body:`СТРУКТУРА АККАУНТА: (оценка)\n\nCONTEXT HINTS: (оценка, пересечения, качество)\n\nОБЪЯВЛЕНИЯ: (relevance, benefit-focused)\n\nTRACKING: (что настроено / что отсутствует)\n\nБЮДЖЕТ И СТАВКИ: (адекватность)\n\nГЛАВНЫЕ НАХОДКИ:\n\nРЕКОМЕНДАЦИИ (приоритизированные):` },
  { id:'outreach', title:'Outreach Message', body:`Здравствуйте, [Имя]!\n\nЗаметил(а), что [компания] [конкретное наблюдение о бизнесе]. Я помогаю бизнесам в нише [ниша] настраивать и вести рекламу в ChatGPT Ads — новом канале, который [короткая польза].\n\nЕсли интересно — могу за 15 минут показать, как бы выглядела структура кампании конкретно для [компания]. Удобно на этой неделе?\n\n[Имя]` },
  { id:'servicedesc', title:'Описание услуги', body:`УСЛУГА: ChatGPT Ads Setup & Management\n\nДЛЯ КОГО: \n\nЧТО ВХОДИТ:\n- Аудит/настройка структуры аккаунта\n- Context hints и объявления\n- Tracking\n- Еженедельная оптимизация\n- Отчётность\n\nСТОИМОСТЬ: \n\nСРОК ПЕРВЫХ РЕЗУЛЬТАТОВ: ` },
  { id:'casestudy', title:'Portfolio Case Study', body:`[SPEC PROJECT] Название проекта\n\nЗАДАЧА:\n\nЧТО СДЕЛАНО:\n- Исследование аудитории\n- Структура кампании\n- Context hints и объявления\n- Tracking\n\nРЕЗУЛЬТАТ (учебная симуляция):\n\nЧЕМУ НАУЧИЛСЯ/НАУЧИЛАСЬ:` },
];

function projectState(id){ return getState().projects[id] || {}; }

export function render(){
  return `
    <h1 style="margin-bottom:6px">Projects & Portfolio</h1>
    <p class="section-sub">Три spec-проекта для портфолио + готовые шаблоны документов. Все работы честно маркированы как Spec Project.</p>

    ${PROJECTS.map(p=>renderProject(p)).join('')}

    <h3 class="section-title" style="margin-top:32px">Готовые шаблоны</h3>
    <div class="grid grid-2">
      ${TEMPLATES.map(t=>`<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <b>${t.title}</b>
          <button class="btn secondary sm" data-copy="${t.id}">Копировать</button>
        </div>
        <pre style="white-space:pre-wrap;font-family:var(--font-body);font-size:12.5px;color:var(--text-soft);max-height:120px;overflow-y:auto;margin:0">${t.body}</pre>
      </div>`).join('')}
    </div>

    <div class="no-print" style="text-align:center;margin-top:32px;display:flex;gap:10px;justify-content:center">
      <a class="btn" href="#/exam">Готовы к финальному экзамену?</a>
      <button class="btn secondary" id="printProjectsBtn">Экспорт прогресса в PDF (печать)</button>
    </div>
  `;
}

function renderProject(p){
  const state = projectState(p.id);
  const done = p.items.filter((_,i)=>state[i]).length;
  return `<div class="card" style="margin-bottom:18px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <h3 style="margin:0">${p.title}</h3>
      <span class="pill tag-warning">${p.badge}</span>
    </div>
    <div class="progress-track" style="margin:10px 0"><div class="progress-fill" style="width:${done/p.items.length*100}%"></div></div>
    <div class="section-sub" style="margin-bottom:10px">${done}/${p.items.length} готово</div>
    <div data-project="${p.id}">
      ${p.items.map((item,i)=>`<label style="display:flex;gap:10px;align-items:center;padding:6px 0;border-top:1px solid var(--outline)">
        <input type="checkbox" data-item="${i}" ${state[i]?'checked':''}>
        <span style="font-size:13.5px">${item}</span>
      </label>`).join('')}
    </div>
  </div>`;
}

export function mount(root){
  root.querySelectorAll('[data-project]').forEach(box=>{
    const pid = box.dataset.project;
    box.querySelectorAll('[data-item]').forEach(cb=>cb.addEventListener('change', ()=>{
      setState(s=>{ s.projects[pid] = s.projects[pid]||{}; s.projects[pid][cb.dataset.item] = cb.checked; });
      root.innerHTML = render(); mount(root);
    }));
  });
  root.querySelector('#printProjectsBtn')?.addEventListener('click', ()=>window.print());
  root.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click', ()=>{
    const t = TEMPLATES.find(x=>x.id===btn.dataset.copy);
    navigator.clipboard?.writeText(t.body).catch(()=>{});
    btn.textContent = 'Скопировано ✓';
    setTimeout(()=>{ btn.textContent='Копировать'; }, 1500);
  }));
}
