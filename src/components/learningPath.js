import { getState } from '../utils/storage.js';
import { MODULES, moduleProgress, CATEGORY_LABEL, CATEGORY_TAG_CLASS } from '../data/curriculum.js';
import { icon } from '../utils/icons.js';

function currentCatFilter(){
  const q = location.hash.split('?')[1];
  if (!q) return null;
  const params = new URLSearchParams(q);
  return params.get('cat');
}

export function render(){
  const s = getState();
  const doneIds = s.progress.completedLessons;
  const filter = currentCatFilter();
  const cats = ['chatgpt','ppc','meta','analytics','career'];

  return `
    <h1 style="margin-bottom:6px">Learning Path</h1>
    <p class="section-sub">${MODULES.length} модуля, включая базовый модуль «Основы рекламы» · далее специализация: 50% ChatGPT Ads, 20% PPC/Google/Amazon Ads, 10% Meta Ads, 15% Analytics, 5% Career</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px">
      <span class="filter-chip ${!filter?'active':''}" data-cat="">Все</span>
      ${cats.map(c=>`<span class="filter-chip ${filter===c?'active':''}" data-cat="${c}">${CATEGORY_LABEL[c]}</span>`).join('')}
      <a href="#/calculators" class="filter-chip" style="text-decoration:none">Калькуляторы</a>
    </div>

    <div id="modulesWrap">
      ${MODULES.filter(m=>!filter||m.category===filter).map(m=>{
        const p = moduleProgress(m.id, doneIds);
        return `<div class="card" style="margin-bottom:14px">
          <div class="module-header" data-module="${m.id}" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer">
            <div>
              <span class="pill ${CATEGORY_TAG_CLASS[m.category]}" style="margin-bottom:8px">${CATEGORY_LABEL[m.category]}</span>
              <h3 style="margin:6px 0 2px">${m.title}</h3>
              <p class="section-sub" style="margin:0">${m.short}</p>
            </div>
            <div style="text-align:right;min-width:120px">
              <div style="font-size:13px;font-weight:700">${p.done}/${p.total}</div>
              <div class="progress-track" style="width:100px;margin-top:4px"><div class="progress-fill" style="width:${p.pct}%"></div></div>
            </div>
          </div>
          <div class="module-lessons" id="lessons-${m.id}" style="display:none;margin-top:16px;border-top:1px solid var(--outline);padding-top:12px">
            ${m.lessons.map((l,i)=>`<a href="#/lesson/${l.id}" style="display:flex;justify-content:space-between;align-items:center;padding:10px 4px;text-decoration:none;color:var(--text);border-bottom:1px solid var(--outline)">
              <span>${doneIds[l.id]?icon('check'):`<span style="display:inline-flex;width:16px;height:16px;color:var(--text-soft)">${i+1}</span>`} &nbsp; ${l.title}</span>
              <span style="font-size:12px;color:var(--text-soft)">${l.duration} мин</span>
            </a>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

export function mount(root){
  root.querySelectorAll('.filter-chip[data-cat]').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const cat = chip.dataset.cat;
      location.hash = cat ? `#/learning-path?cat=${cat}` : '#/learning-path';
    });
  });
  root.querySelectorAll('.module-header').forEach(h=>{
    h.addEventListener('click', ()=>{
      const box = root.querySelector(`#lessons-${h.dataset.module}`);
      box.style.display = box.style.display==='none' ? 'block' : 'none';
    });
  });
}
