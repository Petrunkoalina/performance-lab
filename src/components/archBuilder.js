import { getState, setState } from '../utils/storage.js';

function tree(){ return getState().projects.archTree || []; }
function uid(p){ return p+'_'+Math.random().toString(36).slice(2,8); }

function evaluate(campaigns){
  const notes = [];
  let score = 100;
  const allGroupNames = campaigns.flatMap(c=>c.groups.map(g=>g.name.toLowerCase().trim()));
  const dup = allGroupNames.filter((n,i)=>allGroupNames.indexOf(n)!==i);
  if (dup.length){ score-=20; notes.push(`Пересечение имён ad groups между кампаниями: ${[...new Set(dup)].join(', ')}`); }

  const generic = allGroupNames.filter(n=>/^(test|тест|group ?\d*|new|новая)/i.test(n));
  if (generic.length){ score-=15; notes.push('Слишком общий нейминг ad groups (test/новая) — используйте тему/продукт/намерение.'); }

  campaigns.forEach(c=>{
    if (!c.groups.length){ score-=10; notes.push(`Кампания «${c.name}» без ad groups — структура не завершена.`); }
    if (c.groups.length>8){ score-=8; notes.push(`Кампания «${c.name}» содержит очень много ad groups (${c.groups.length}) — возможно, стоит разделить на несколько кампаний.`); }
    if (!/[a-zа-я]/i.test(c.name) || c.name.trim().length<3){ score-=8; notes.push(`Название кампании «${c.name}» слишком короткое/неинформативное.`); }
  });

  if (!campaigns.length){ score=0; notes.push('Структура пуста — добавьте хотя бы одну кампанию.'); }
  score = Math.max(0, Math.min(100, score));
  return { score, notes };
}

export function render(){
  const campaigns = tree();
  const evalResult = evaluate(campaigns);
  return `
    <h1 style="margin-bottom:6px">Campaign Architecture Builder</h1>
    <p class="section-sub">Постройте структуру Campaign → Ad Group для своего проекта. Оценка ниже проверяет фокус, пересечения и нейминг (модуль 12).</p>

    <div class="card" style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:13px;color:var(--text-soft)">Оценка структуры</div>
          <div style="font-family:var(--font-display);font-weight:800;font-size:28px">${evalResult.score}/100</div>
        </div>
        <button class="btn sm" id="addCampaignBtn">+ Кампания</button>
      </div>
      ${evalResult.notes.length ? `<ul style="padding-left:18px;margin-top:12px;font-size:13px;color:var(--text-soft)">${evalResult.notes.map(n=>`<li>${n}</li>`).join('')}</ul>` : `<p style="margin-top:12px;color:var(--mint-d)">Структура выглядит логично: нет пересечений, нейминг понятен.</p>`}
    </div>

    <div id="treeWrap">${campaigns.map((c,ci)=>`
      <div class="card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <input class="input" data-camp-name="${ci}" value="${c.name}" style="max-width:320px;font-weight:700">
          <div style="display:flex;gap:8px">
            <button class="btn secondary sm" data-add-group="${ci}">+ Ad group</button>
            <button class="btn secondary sm" data-del-camp="${ci}">Удалить кампанию</button>
          </div>
        </div>
        ${c.groups.map((g,gi)=>`<div style="display:flex;gap:8px;align-items:center;padding:8px 0;border-top:1px solid var(--outline)">
          <span class="pill" style="flex-shrink:0">Ad group</span>
          <input class="input" data-group-name="${ci}|${gi}" value="${g.name}">
          <button class="btn secondary sm" data-del-group="${ci}|${gi}">✕</button>
        </div>`).join('') || `<p style="color:var(--text-soft);font-size:13px">Пока нет ad groups</p>`}
      </div>
    `).join('') || `<div class="card" style="color:var(--text-soft)">Начните с добавления первой кампании.</div>`}
  `;
}

export function mount(root){
  function persist(campaigns){ setState(s=>{ s.projects.archTree = campaigns; }); }
  function rerender(){ root.innerHTML = render(); mount(root); }

  root.querySelector('#addCampaignBtn').addEventListener('click', ()=>{
    const campaigns = tree();
    campaigns.push({ id:uid('c'), name:'Новая кампания', groups:[] });
    persist(campaigns); rerender();
  });
  root.querySelectorAll('[data-add-group]').forEach(b=>b.addEventListener('click', ()=>{
    const campaigns = tree();
    campaigns[Number(b.dataset.addGroup)].groups.push({ id:uid('g'), name:'Новая ad group' });
    persist(campaigns); rerender();
  }));
  root.querySelectorAll('[data-del-camp]').forEach(b=>b.addEventListener('click', ()=>{
    const campaigns = tree(); campaigns.splice(Number(b.dataset.delCamp),1); persist(campaigns); rerender();
  }));
  root.querySelectorAll('[data-del-group]').forEach(b=>b.addEventListener('click', ()=>{
    const [ci,gi] = b.dataset.delGroup.split('|').map(Number);
    const campaigns = tree(); campaigns[ci].groups.splice(gi,1); persist(campaigns); rerender();
  }));
  root.querySelectorAll('[data-camp-name]').forEach(inp=>inp.addEventListener('change', ()=>{
    const campaigns = tree(); campaigns[Number(inp.dataset.campName)].name = inp.value; persist(campaigns); rerender();
  }));
  root.querySelectorAll('[data-group-name]').forEach(inp=>inp.addEventListener('change', ()=>{
    const [ci,gi] = inp.dataset.groupName.split('|').map(Number);
    const campaigns = tree(); campaigns[ci].groups[gi].name = inp.value; persist(campaigns); rerender();
  }));
}
