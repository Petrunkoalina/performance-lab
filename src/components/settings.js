import { getState, setState, resetState } from '../utils/storage.js';
import { renderSidePanel } from './sidePanel.js';

export function render(){
  const s = getState();
  return `
    <h1 style="margin-bottom:6px">Settings</h1>
    <p class="section-sub">Профиль, данные и экспорт. Всё хранится локально в вашем браузере (localStorage) — архитектура готова к будущему подключению аккаунта и базы данных.</p>

    <div class="card" style="margin-bottom:20px">
      <h3 class="section-title" style="font-size:16px">Профиль</h3>
      <div class="grid grid-2">
        <div><label class="field-label">Имя</label><input class="input" id="s_name" value="${s.profile.name||''}"></div>
        <div><label class="field-label">Ниша для практики</label><input class="input" id="s_niche" value="${s.profile.niche||''}"></div>
        <div><label class="field-label">Часов в неделю</label><input class="input" id="s_hours" type="number" value="${s.profile.hoursPerWeek||5}"></div>
        <div><label class="field-label">Цель</label><input class="input" id="s_goal" value="${s.profile.goal||''}"></div>
      </div>
      <button class="btn secondary sm" id="saveProfileBtn" style="margin-top:12px">Сохранить</button>
    </div>

    <div class="card" style="margin-bottom:20px">
      <h3 class="section-title" style="font-size:16px">Данные</h3>
      <button class="btn secondary sm" id="exportBtn">Экспортировать все данные (JSON)</button>
      <button class="btn secondary sm" id="resetBtn" style="margin-left:10px;border-color:var(--coral);color:var(--coral)">Сбросить весь прогресс</button>
    </div>

    <div class="card">
      <h3 class="section-title" style="font-size:16px">О платформе</h3>
      <p style="font-size:13px;color:var(--text-soft)">Performance Lab — учебная платформа для подготовки Performance Marketing Specialist с фокусом на ChatGPT Ads. Симуляторы используют искусственные данные и не отражают реальную эффективность рекламы. Факты о ChatGPT Ads помечены статусами Confirmed/Beta/Limited/Strategic Hypothesis и сверены с help.openai.com и openai.com/policies/ad-policies по состоянию на 01.09.2026.</p>
    </div>
  `;
}

export function mount(root){
  root.querySelector('#saveProfileBtn').addEventListener('click', ()=>{
    setState(s=>{
      s.profile.name = root.querySelector('#s_name').value;
      s.profile.niche = root.querySelector('#s_niche').value;
      s.profile.hoursPerWeek = parseFloat(root.querySelector('#s_hours').value)||5;
      s.profile.goal = root.querySelector('#s_goal').value;
    });
    const navRail = document.getElementById('navRail');
    const sideCol = document.getElementById('sideCol');
    if (navRail) navRail.querySelector('.nav-avatar').textContent = (root.querySelector('#s_name').value||'?').slice(0,1).toUpperCase();
    if (sideCol) sideCol.innerHTML = renderSidePanel();
    const savedTag = document.createElement('span');
    savedTag.textContent = ' Сохранено ✓';
    savedTag.style.cssText = 'color:var(--mint-d);font-size:13px;margin-left:10px';
    root.querySelector('#saveProfileBtn').after(savedTag);
    setTimeout(()=>savedTag.remove(), 2000);
  });
  root.querySelector('#exportBtn').addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(getState(), null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'performance-lab-data.json'; a.click();
  });
  root.querySelector('#resetBtn').addEventListener('click', ()=>{
    if (!confirm('Точно сбросить весь прогресс? Это действие необратимо.')) return;
    resetState();
    location.hash = '#/onboarding';
    location.reload();
  });
}
