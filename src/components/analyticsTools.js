import { getState, setState } from '../utils/storage.js';

const CHECKLIST_ITEMS = [
  'Conversion tracking настроен и протестирован (тестовая конверсия прошла)',
  'UTM-параметры добавлены в целевой URL каждого креатива',
  'Формат UTM единый для всех кампаний (регистр, разделители)',
  'Лендинг не блокирует OAI-AdsBot/OAI-SearchBot и краулеры аналитики',
  'Macro и micro conversions разделены и задокументированы в measurement plan',
  'Нет дублирования событий (double counting) на thank-you page',
  'Источник истины для каждой метрики согласован с клиентом (Ads Manager vs GA4)',
  'Данные по расхождению Ads Manager / GA4 объяснены клиенту заранее',
];

function utmState(){ return getState().projects.utmBuilder || { url:'', source:'chatgpt', medium:'cpc', campaign:'', content:'', term:'' }; }
function planState(){ return getState().projects.measurementPlan || { macro:'', micro:'', tool:'GA4', notes:'' }; }
function checklistState(){ return getState().projects.trackingChecklist || {}; }

function buildUrl(u){
  if (!u.url) return '';
  const sep = u.url.includes('?') ? '&' : '?';
  const params = [
    u.source && `utm_source=${encodeURIComponent(u.source)}`,
    u.medium && `utm_medium=${encodeURIComponent(u.medium)}`,
    u.campaign && `utm_campaign=${encodeURIComponent(u.campaign)}`,
    u.content && `utm_content=${encodeURIComponent(u.content)}`,
    u.term && `utm_term=${encodeURIComponent(u.term)}`,
  ].filter(Boolean).join('&');
  return u.url + sep + params;
}

export function render(){
  const u = utmState(); const plan = planState(); const cl = checklistState();
  const done = CHECKLIST_ITEMS.filter((_,i)=>cl[i]).length;

  return `
    <h1 style="margin-bottom:6px">Analytics Toolkit</h1>
    <p class="section-sub">UTM Builder, Measurement Plan Builder и Tracking Checklist — практика модуля 17.</p>

    <div class="card" style="margin-bottom:20px">
      <h3 class="section-title" style="font-size:16px">UTM Builder</h3>
      <div class="grid grid-2">
        <div><label class="field-label">Landing page URL</label><input class="input" id="u_url" value="${u.url}"></div>
        <div><label class="field-label">utm_source</label><input class="input" id="u_source" value="${u.source}"></div>
        <div><label class="field-label">utm_medium</label><input class="input" id="u_medium" value="${u.medium}"></div>
        <div><label class="field-label">utm_campaign</label><input class="input" id="u_campaign" value="${u.campaign}"></div>
        <div><label class="field-label">utm_content</label><input class="input" id="u_content" value="${u.content}"></div>
        <div><label class="field-label">utm_term (опционально)</label><input class="input" id="u_term" value="${u.term}"></div>
      </div>
      <div class="callout term" style="margin-top:14px;word-break:break-all;font-size:13px" id="u_result">${buildUrl(u) || 'Введите URL, чтобы увидеть результат'}</div>
      <button class="btn secondary sm" id="copyUrlBtn" style="margin-top:10px">Скопировать ссылку</button>
    </div>

    <div class="card" style="margin-bottom:20px">
      <h3 class="section-title" style="font-size:16px">Measurement Plan Builder</h3>
      <div class="grid grid-2">
        <div><label class="field-label">Macro conversions</label><textarea class="input" id="m_macro" rows="2">${plan.macro}</textarea></div>
        <div><label class="field-label">Micro conversions</label><textarea class="input" id="m_micro" rows="2">${plan.micro}</textarea></div>
        <div><label class="field-label">Источник истины</label>
          <select class="input" id="m_tool"><option ${plan.tool==='GA4'?'selected':''}>GA4</option><option ${plan.tool==='Ads Manager'?'selected':''}>Ads Manager</option><option ${plan.tool==='CRM'?'selected':''}>CRM</option></select>
        </div>
        <div><label class="field-label">Заметки по атрибуции</label><textarea class="input" id="m_notes" rows="2">${plan.notes}</textarea></div>
      </div>
      <button class="btn secondary sm" id="savePlanBtn" style="margin-top:10px">Сохранить план</button>
    </div>

    <div class="card">
      <h3 class="section-title" style="font-size:16px">Tracking Checklist (${done}/${CHECKLIST_ITEMS.length})</h3>
      <div class="progress-track" style="margin-bottom:14px"><div class="progress-fill" style="width:${done/CHECKLIST_ITEMS.length*100}%"></div></div>
      ${CHECKLIST_ITEMS.map((item,i)=>`<label style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid var(--outline)">
        <input type="checkbox" data-check="${i}" ${cl[i]?'checked':''} style="margin-top:3px">
        <span style="font-size:13.5px">${item}</span>
      </label>`).join('')}
    </div>
  `;
}

export function mount(root){
  const ids = ['url','source','medium','campaign','content','term'];
  function refreshUrl(){
    const u = { url:root.querySelector('#u_url').value, source:root.querySelector('#u_source').value, medium:root.querySelector('#u_medium').value, campaign:root.querySelector('#u_campaign').value, content:root.querySelector('#u_content').value, term:root.querySelector('#u_term').value };
    setState(s=>{ s.projects.utmBuilder = u; });
    root.querySelector('#u_result').textContent = buildUrl(u) || 'Введите URL, чтобы увидеть результат';
  }
  ids.forEach(id=>root.querySelector('#u_'+id).addEventListener('input', refreshUrl));
  root.querySelector('#copyUrlBtn').addEventListener('click', ()=>{
    const text = root.querySelector('#u_result').textContent;
    navigator.clipboard?.writeText(text).catch(()=>{});
  });

  root.querySelector('#savePlanBtn').addEventListener('click', ()=>{
    setState(s=>{ s.projects.measurementPlan = { macro:root.querySelector('#m_macro').value, micro:root.querySelector('#m_micro').value, tool:root.querySelector('#m_tool').value, notes:root.querySelector('#m_notes').value }; });
    alert('План сохранён');
  });

  root.querySelectorAll('[data-check]').forEach(cb=>cb.addEventListener('change', ()=>{
    setState(s=>{ s.projects.trackingChecklist = s.projects.trackingChecklist||{}; s.projects.trackingChecklist[cb.dataset.check] = cb.checked; });
    root.innerHTML = render(); mount(root);
  }));
}
