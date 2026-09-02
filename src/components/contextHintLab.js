import { getState, setState } from '../utils/storage.js';
import { scoreContextHint, scoreLabel } from '../utils/heuristics.js';
import { icon } from '../utils/icons.js';

function profile(){ return getState().projects.contextHintLabProfile || { product:'', category:'', audience:'', problem:'', benefits:'', country:'', funnelStage:'Consideration', desiredConversion:'' }; }
function hints(){ return getState().projects.contextHintLabHints || []; }

export function render(){
  const p = profile();
  return `
    <h1 style="margin-bottom:6px">Context Hint Lab</h1>
    <p class="section-sub">Опишите продукт, затем напишите context hints самостоятельно — оценка появится по критериям официальной методологии (модуль 13). Готовых ответов заранее не будет: сначала — ваша попытка.</p>

    <div class="card" style="margin-bottom:20px">
      <h3 class="section-title" style="font-size:16px">1. Профиль продукта</h3>
      <div class="grid grid-2">
        <div><label class="field-label">Продукт</label><input class="input" id="p_product" value="${p.product}"></div>
        <div><label class="field-label">Категория</label><input class="input" id="p_category" value="${p.category}"></div>
        <div><label class="field-label">Аудитория</label><input class="input" id="p_audience" value="${p.audience}"></div>
        <div><label class="field-label">Проблема, которую решает</label><input class="input" id="p_problem" value="${p.problem}"></div>
        <div><label class="field-label">Ключевые преимущества</label><input class="input" id="p_benefits" value="${p.benefits}"></div>
        <div><label class="field-label">Страна</label><input class="input" id="p_country" value="${p.country}"></div>
        <div><label class="field-label">Этап воронки</label>
          <select class="input" id="p_funnel">${['Awareness','Consideration','Conversion','Retention'].map(f=>`<option ${p.funnelStage===f?'selected':''}>${f}</option>`).join('')}</select>
        </div>
        <div><label class="field-label">Желаемая конверсия</label><input class="input" id="p_conversion" value="${p.desiredConversion}"></div>
      </div>
      <button class="btn secondary sm" id="saveProfileBtn" style="margin-top:12px">Сохранить профиль</button>
    </div>

    <div class="card">
      <h3 class="section-title" style="font-size:16px">2. Ваши context hints</h3>
      <p class="section-sub">Контрольный вопрос: что ещё нужно знать об этом продукте, кому он помогает и когда полезен?</p>
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <input class="input" id="hintInput" placeholder="Например: амортизирующие кроссовки для новичков, готовящихся к первому забегу на 5 км">
        <button class="btn sm" id="addHintBtn">Оценить</button>
      </div>
      <div id="hintList">${renderHints()}</div>
    </div>
  `;
}

function renderHints(){
  const list = hints();
  if (!list.length) return `<p style="color:var(--text-soft)">Пока нет ни одного hint — напишите первый.</p>`;
  return list.map((h,i)=>{
    const sc = scoreContextHint(h);
    const lbl = scoreLabel(sc.overall);
    return `<div class="card-sm" style="border:1px solid var(--outline);border-radius:12px;padding:14px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px">
        <div style="font-size:14px">${h}</div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
          <span class="pill ${lbl.cls}">${sc.overall}/100</span>
          <button class="btn secondary sm" data-del-hint="${i}">✕</button>
        </div>
      </div>
      <div class="grid grid-3" style="gap:6px;font-size:12px;color:var(--text-soft);margin-bottom:8px">
        <div>Clarity: <b>${sc.clarity}</b></div><div>Specificity: <b>${sc.specificity}</b></div><div>Relevance: <b>${sc.relevance}</b></div>
        <div>Natural language: <b>${sc.naturalLanguage}</b></div><div>Breadth: <b>${sc.breadth}</b></div><div>Sensitivity: <b>${sc.sensitivity}</b></div>
      </div>
      ${sc.notes.length ? `<ul style="padding-left:18px;font-size:13px;color:var(--text-soft)">${sc.notes.map(n=>`<li>${n}</li>`).join('')}</ul>` : `<div style="font-size:13px;color:var(--mint-d)">Соответствует основным критериям официальной методологии.</div>`}
    </div>`;
  }).join('');
}

export function mount(root){
  root.querySelector('#saveProfileBtn').addEventListener('click', ()=>{
    setState(s=>{ s.projects.contextHintLabProfile = {
      product: root.querySelector('#p_product').value, category: root.querySelector('#p_category').value,
      audience: root.querySelector('#p_audience').value, problem: root.querySelector('#p_problem').value,
      benefits: root.querySelector('#p_benefits').value, country: root.querySelector('#p_country').value,
      funnelStage: root.querySelector('#p_funnel').value, desiredConversion: root.querySelector('#p_conversion').value,
    }; });
    alert('Профиль сохранён');
  });
  root.querySelector('#addHintBtn').addEventListener('click', ()=>{
    const input = root.querySelector('#hintInput');
    const val = input.value.trim();
    if (!val) return;
    setState(s=>{ s.projects.contextHintLabHints = [...(s.projects.contextHintLabHints||[]), val]; });
    input.value='';
    root.querySelector('#hintList').innerHTML = renderHints();
    root.querySelectorAll('[data-del-hint]').forEach(bindDel);
  });
  root.querySelectorAll('[data-del-hint]').forEach(bindDel);
  function bindDel(b){
    b.addEventListener('click', ()=>{
      setState(s=>{ s.projects.contextHintLabHints.splice(Number(b.dataset.delHint),1); });
      root.querySelector('#hintList').innerHTML = renderHints();
      root.querySelectorAll('[data-del-hint]').forEach(bindDel);
    });
  }
}
