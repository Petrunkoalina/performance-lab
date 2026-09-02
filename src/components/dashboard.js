import { getState } from '../utils/storage.js';
import { MODULES, allLessons, getLesson, firstIncompleteLesson, categoryProgress, CATEGORY_LABEL, searchLessons } from '../data/curriculum.js';
import { icon } from '../utils/icons.js';

const CATS = [
  { key:'chatgpt', label:'ChatGPT Ads', color:'mint' },
  { key:'ppc', label:'PPC / Google / Amazon Ads', color:'peach' },
  { key:'meta', label:'Meta Ads', color:'lavender' },
  { key:'analytics', label:'Analytics', color:'pink' },
  { key:'career', label:'Career', color:'yellow' },
];

export function render(){
  const s = getState();
  const next = firstIncompleteLesson(s.progress.completedLessons);
  const doneIds = s.progress.completedLessons;

  return `
    <div style="margin-bottom:28px">
      <div class="section-sub">Привет, ${s.profile.name || 'ученик'}! Уровень: ${s.profile.level || '—'}</div>
      <h1 style="font-size:40px;margin-bottom:16px">Продолжим обучение</h1>
      <div class="search-bar" style="max-width:520px;margin-bottom:14px">
        ${icon('search')}
        <input id="dashSearch" placeholder="Искать урок или термин…" />
      </div>
      <div id="searchResults"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${CATS.map(c=>`<span class="filter-chip" data-cat="${c.key}">${c.label}</span>`).join('')}
      </div>
    </div>

    <div class="card" style="margin-bottom:24px;background:var(--mint)">
      <div class="section-sub" style="color:#1b4d3a">Текущий урок</div>
      <h2 style="margin-bottom:6px">${next.title}</h2>
      <p style="font-size:13px;color:#1b4d3a;margin-bottom:16px">${next.moduleTitle} · ${next.duration} мин</p>
      <a class="btn" href="#/lesson/${next.id}">Продолжить ${icon('arrowRight')}</a>
    </div>

    <h3 class="section-title">Направления</h3>
    <div class="grid grid-3" style="margin-bottom:28px">
      ${CATS.map(c=>{
        const p = categoryProgress(c.key, doneIds);
        return `<a href="#/learning-path?cat=${c.key}" class="card" style="background:var(--${c.color});text-decoration:none;color:var(--text);display:block">
          <div style="font-weight:800;font-family:var(--font-display);margin-bottom:6px">${c.label}</div>
          <div style="font-size:12px;margin-bottom:10px">${p.done}/${p.total} уроков</div>
          <div class="progress-track" style="background:rgba(0,0,0,.12)"><div class="progress-fill" style="width:${p.pct}%;background:#111"></div></div>
        </a>`;
      }).join('')}
    </div>

    <h3 class="section-title">Недельный план</h3>
    <p class="section-sub">На основе ${s.profile.hoursPerWeek || 5} ч/нед — вот что стоит успеть на этой неделе</p>
    <div class="card" style="margin-bottom:28px">
      <table class="data-table">
        <tr><th>Модуль</th><th>Урок</th><th>Время</th><th>Статус</th></tr>
        ${weekPlan(s).map(l=>`<tr>
          <td>${l.moduleTitle}</td>
          <td><a href="#/lesson/${l.id}">${l.title}</a></td>
          <td>${l.duration} мин</td>
          <td>${doneIds[l.id]?'<span class="pill tag-completed">Готово</span>':'<span class="pill">В плане</span>'}</td>
        </tr>`).join('')}
      </table>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3 class="section-title" style="font-size:18px">Рекомендуемое повторение</h3>
        ${s.weakTopics.length ? `<ul>${s.weakTopics.slice(0,4).map(t=>`<li class="pill" style="margin:0 6px 6px 0;background:#FBEDE7;display:inline-flex">${t}</li>`).join('')}</ul><p class="section-sub">Вернитесь к этим урокам через Learning Path и пройдите тест ещё раз.</p>` : `<p class="section-sub">Пока нет тем для повторения — так держать!</p>`}
        <a class="btn secondary sm" href="#/learning-path">Открыть Learning Path</a>
      </div>
      <div class="card">
        <h3 class="section-title" style="font-size:18px">Проекты для портфолио</h3>
        <p class="section-sub">3 spec-проекта: Beauty e-commerce, B2B SaaS, Собственные услуги</p>
        <a class="btn secondary sm" href="#/projects">Перейти в Projects</a>
      </div>
    </div>
  `;
}

function weekPlan(s){
  const flat = allLessons();
  const incomplete = flat.filter(l=>!s.progress.completedLessons[l.id]);
  const targetMinutes = (s.profile.hoursPerWeek||5)*60;
  let acc=0; const plan=[];
  for (const l of incomplete){
    if (acc>=targetMinutes && plan.length>=3) break;
    plan.push(l); acc+=l.duration;
    if (plan.length>=8) break;
  }
  return plan;
}

export function mount(root){
  const input = root.querySelector('#dashSearch');
  const resultsBox = root.querySelector('#searchResults');
  input.addEventListener('input', ()=>{
    const q = input.value;
    if (!q.trim()){ resultsBox.innerHTML=''; return; }
    const results = searchLessons(q);
    resultsBox.innerHTML = results.length ? `<div class="card-sm card" style="margin-bottom:14px">
      ${results.map(r=>`<a href="#/lesson/${r.id}" style="display:block;padding:6px 0;border-bottom:1px solid var(--outline)">${r.title} <span style="color:var(--text-soft);font-size:12px">· ${r.moduleTitle}</span></a>`).join('')}
    </div>` : `<div class="card-sm card" style="margin-bottom:14px;color:var(--text-soft)">Ничего не найдено</div>`;
  });
  root.querySelectorAll('.filter-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{ location.hash = `#/learning-path?cat=${chip.dataset.cat}`; });
  });
}
