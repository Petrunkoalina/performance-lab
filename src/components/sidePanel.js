import { getState } from '../utils/storage.js';
import { allLessons, totalLessonCount, categoryProgress, CATEGORY_LABEL } from '../data/curriculum.js';
import { icon } from '../utils/icons.js';

function last7Days(activityLog){
  const days=[]; const now = new Date();
  for(let i=6;i>=0;i--){
    const d = new Date(now); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    days.push({ key, label:'ПВСЧПСВ'[d.getDay()===0?6:d.getDay()-1], min: activityLog[key]||0 });
  }
  return days;
}

export function renderSidePanel(){
  const s = getState();
  const total = totalLessonCount();
  const done = Object.keys(s.progress.completedLessons).length;
  const pct = total? Math.round(done/total*100):0;
  const days = last7Days(s.progress.activityLog);
  const maxMin = Math.max(10, ...days.map(d=>d.min));
  const chatgptScore = s.scores.chatgptAds;

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="width:44px;height:44px;border-radius:50%;background:var(--yellow);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:16px">${(s.profile.name||'?').slice(0,1).toUpperCase()}</div>
      <div>
        <div style="font-weight:700">${s.profile.name || 'Ученик Performance Lab'}</div>
        <div style="font-size:12px;color:var(--text-soft)">Уровень: ${s.profile.level || 'не определён'}</div>
      </div>
    </div>

    <div class="grid grid-2" style="margin-bottom:16px">
      <div class="stat-tile"><div class="num">${icon('flame')} ${s.progress.streak}</div><div class="lbl">Streak, дней</div></div>
      <div class="stat-tile"><div class="num">${s.progress.hoursLogged.toFixed(1)}</div><div class="lbl">Часов обучения</div></div>
    </div>

    <div class="card-sm card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px"><b>Прогресс курса</b><span>${pct}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div style="font-size:12px;color:var(--text-soft);margin-top:6px">${done} из ${total} уроков</div>
    </div>

    <div class="card-sm card" style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:10px">Активность за 7 дней</div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:60px">
        ${days.map(d=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
          <div style="width:100%;background:${d.min>0?'var(--mint)':'var(--outline)'};border-radius:4px;height:${Math.max(4,(d.min/maxMin)*44)}px"></div>
          <span style="font-size:10px;color:var(--text-soft)">${d.label}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="card-sm card" style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:10px">Readiness score</div>
      ${['chatgptAds','ppc','analytics','strategy','clientComm'].map(k=>{
        const labels = {chatgptAds:'ChatGPT Ads', ppc:'PPC', analytics:'Analytics', strategy:'Strategy', clientComm:'Client comm'};
        const v = s.scores[k]||0;
        return `<div style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>${labels[k]}</span><span>${v}%</span></div>
          <div class="progress-track" style="height:5px"><div class="progress-fill" style="width:${v}%"></div></div>
        </div>`;
      }).join('')}
    </div>

    ${s.weakTopics.length ? `<div class="card-sm card" style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px">Слабые темы</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${s.weakTopics.slice(0,6).map(t=>`<span class="pill" style="background:#FBEDE7">${t}</span>`).join('')}
      </div>
    </div>` : ''}

    <div class="card-sm card">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px">Ближайшая цель</div>
      <div style="font-size:13px;color:var(--text-soft)">${s.profile.hoursPerWeek||5} ч/нед · ${s.profile.goal || 'учиться регулярно'}</div>
      <a href="#/learning-path" class="btn secondary sm" style="margin-top:10px;width:100%">Продолжить обучение</a>
    </div>
  `;
}
