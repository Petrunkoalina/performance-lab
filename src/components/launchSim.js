import { getState, setState } from '../utils/storage.js';

const SCENARIOS = [
  {
    id:'ls1', title:'Сценарий 1: новая кампания не показывается',
    fields:[
      { k:'verification', label:'Account verification', value:'Pending', bug:true, why:'Верификация ещё не завершена — без неё показ невозможен независимо от остальных настроек.' },
      { k:'billing', label:'Billing profile', value:'Не заполнен', bug:true, why:'Без billing profile и payment method кампания не может начать расходовать бюджет.' },
      { k:'objective', label:'Objective', value:'oCPC', bug:false },
      { k:'budget', label:'Daily budget', value:'€40', bug:false },
      { k:'dates', label:'Start date', value:'2026-09-01 (сегодня)', bug:false },
    ],
  },
  {
    id:'ls2', title:'Сценарий 2: показы есть, но объявления не одобрены',
    fields:[
      { k:'verification', label:'Account verification', value:'Verified', bug:false },
      { k:'billing', label:'Billing profile', value:'Заполнен', bug:false },
      { k:'ad_status', label:'Ad review status', value:'In review (3 дня)', bug:true, why:'Объявления, застрявшие в review необычно долго, стоит проверить на соответствие Ads Policies — возможно, есть нарушение baseline-стандартов.' },
      { k:'landing', label:'Landing page', value:'Блокирует OAI-AdsBot в robots.txt', bug:true, why:'Заблокированный краулер мешает системе оценить и одобрить лендинг — это частая скрытая причина долгой модерации.' },
      { k:'bid', label:'Maximum bid', value:'$4 CPC', bug:false },
    ],
  },
  {
    id:'ls3', title:'Сценарий 3: кампания активна, но данные выглядят странно',
    fields:[
      { k:'utm', label:'UTM на объявлениях', value:'Отсутствуют на 2 из 5 креативов', bug:true, why:'Без UTM на части креативов сквозная аналитика теряет часть трафика — расхождение с GA4 гарантировано.' },
      { k:'conversion', label:'Conversion event', value:'Purchase (настроен дважды: Pixel + ручной тег)', bug:true, why:'Дублирующаяся настройка конверсионного события — классическая причина double counting.' },
      { k:'naming', label:'Naming convention', value:'Brand_Kitchen_oCPC_2026-09', bug:false },
      { k:'countries', label:'Countries', value:'Germany, Austria', bug:false },
    ],
  },
];

function saved(){ return getState().projects.launchSim || {}; }

export function render(){
  const s = saved();
  return `
    <h1 style="margin-bottom:6px">Launch Simulator</h1>
    <p class="section-sub">В каждом сценарии намеренно скрыто 2 ошибки запуска. Отметьте поля, которые считаете проблемными, и проверьте себя.</p>
    ${SCENARIOS.map(sc=>renderScenario(sc, s[sc.id])).join('')}
  `;
}

function renderScenario(sc, state){
  const checked = state?.checked || [];
  const revealed = !!state?.revealed;
  return `<div class="card" style="margin-bottom:18px" data-sc="${sc.id}">
    <h3 style="margin-bottom:14px">${sc.title}</h3>
    <table class="data-table" style="margin-bottom:14px">
      <tr><th></th><th>Поле</th><th>Значение</th></tr>
      ${sc.fields.map(f=>`<tr class="${revealed && f.bug ? 'flag-bug':''}" style="${revealed && f.bug ? 'background:#FBEDE7':''}">
        <td><input type="checkbox" data-field="${f.k}" ${checked.includes(f.k)?'checked':''} ${revealed?'disabled':''}></td>
        <td>${f.label}</td><td>${f.value}</td>
      </tr>`).join('')}
    </table>
    ${!revealed ? `<button class="btn secondary sm" data-check>Проверить</button>` :
      `<div class="callout term">
        ${sc.fields.filter(f=>f.bug).map(f=>`<div style="margin-bottom:8px"><b>${f.label}:</b> ${f.why}</div>`).join('')}
      </div>
      <div style="margin-top:10px;font-weight:700">Найдено верно: ${state.correctFound}/${sc.fields.filter(f=>f.bug).length}${state.falsePositive?` · Лишних отметок: ${state.falsePositive}`:''}</div>`}
  </div>`;
}

export function mount(root){
  root.querySelectorAll('[data-sc]').forEach(card=>{
    const id = card.dataset.sc;
    const sc = SCENARIOS.find(s=>s.id===id);
    const checkBtn = card.querySelector('[data-check]');
    if (!checkBtn) return;
    checkBtn.addEventListener('click', ()=>{
      const checked = [...card.querySelectorAll('[data-field]:checked')].map(c=>c.dataset.field);
      const bugKeys = sc.fields.filter(f=>f.bug).map(f=>f.k);
      const correctFound = checked.filter(k=>bugKeys.includes(k)).length;
      const falsePositive = checked.filter(k=>!bugKeys.includes(k)).length;
      setState(s=>{
        s.projects.launchSim = s.projects.launchSim||{};
        s.projects.launchSim[id] = { checked, revealed:true, correctFound, falsePositive };
      });
      root.innerHTML = render();
      mount(root);
    });
  });
}
