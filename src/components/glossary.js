import { allTerms, CATEGORY_LABEL, CATEGORY_TAG_CLASS } from '../data/curriculum.js';

export function render(){
  const terms = allTerms().sort((a,b)=>a.term.localeCompare(b.term,'ru'));
  return `
    <h1 style="margin-bottom:6px">Glossary</h1>
    <p class="section-sub">${terms.length} терминов курса — на русском и английском, со ссылкой на исходный урок.</p>
    <div class="search-bar" style="max-width:420px;margin-bottom:20px">
      <input id="glossarySearch" placeholder="Искать термин…">
    </div>
    <div id="glossaryList" class="grid grid-2">${termsHtml(terms)}</div>
  `;
}

function termsHtml(terms){
  if (!terms.length) return `<p style="color:var(--text-soft)">Ничего не найдено</p>`;
  return terms.map(t=>`<div class="card-sm card">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
      <b>${t.term}</b>
      <span class="pill ${CATEGORY_TAG_CLASS[t.category]}" style="font-size:11px">${CATEGORY_LABEL[t.category]}</span>
    </div>
    <div style="font-size:12px;color:var(--text-soft);margin-bottom:6px">${t.en}</div>
    <p style="font-size:13.5px;margin-bottom:8px">${t.def}</p>
    <a href="#/lesson/${t.lessonId}" style="font-size:12px">Урок: ${t.lessonTitle}</a>
  </div>`).join('');
}

export function mount(root){
  const all = allTerms().sort((a,b)=>a.term.localeCompare(b.term,'ru'));
  root.querySelector('#glossarySearch').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase().trim();
    const filtered = !q ? all : all.filter(t=>t.term.toLowerCase().includes(q)||t.en.toLowerCase().includes(q)||t.def.toLowerCase().includes(q));
    root.querySelector('#glossaryList').innerHTML = termsHtml(filtered);
  });
}
