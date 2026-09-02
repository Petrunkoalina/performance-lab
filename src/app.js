import { getState, touchStreak } from './utils/storage.js';
import { icon } from './utils/icons.js';

import * as onboarding from './components/onboarding.js';
import * as dashboard from './components/dashboard.js';
import * as learningPath from './components/learningPath.js';
import * as lessonView from './components/lesson.js';
import * as calculators from './components/calculators.js';
import * as chatgptLab from './components/chatgptAdsLab.js';
import * as contextHintLab from './components/contextHintLab.js';
import * as adBuilder from './components/adBuilder.js';
import * as archBuilder from './components/archBuilder.js';
import * as ppcLab from './components/ppcLab.js';
import * as analyticsTools from './components/analyticsTools.js';
import * as diagnosticsLab from './components/diagnosticsLab.js';
import * as launchSim from './components/launchSim.js';
import * as projects from './components/projects.js';
import * as glossary from './components/glossary.js';
import * as notes from './components/notes.js';
import * as examView from './components/exam.js';
import * as settingsView from './components/settings.js';
import { renderSidePanel } from './components/sidePanel.js';

const NAV = [
  { key:'dashboard', label:'Dashboard', icon:'dashboard', route:'#/dashboard' },
  { key:'learning-path', label:'Learning Path', icon:'path', route:'#/learning-path' },
  { key:'chatgpt-lab', label:'ChatGPT Ads Lab', icon:'chatgpt', route:'#/chatgpt-lab' },
  { key:'ppc-lab', label:'PPC Lab', icon:'ppc', route:'#/ppc-lab' },
  { key:'analytics', label:'Analytics', icon:'analytics', route:'#/analytics' },
  { key:'projects', label:'Projects', icon:'projects', route:'#/projects' },
  { key:'glossary', label:'Glossary', icon:'glossary', route:'#/glossary' },
  { key:'notes', label:'Notes', icon:'notes', route:'#/notes' },
  { key:'settings', label:'Settings', icon:'settings', route:'#/settings' },
];

const ROUTES = [
  { test:/^#\/dashboard\/?$/, view:dashboard, navKey:'dashboard', side:true },
  { test:/^#\/learning-path\/?$/, view:learningPath, navKey:'learning-path', side:true },
  { test:/^#\/lesson\/([\w-]+)\/?$/, view:lessonView, navKey:'learning-path', side:false, params:m=>({id:m[1]}) },
  { test:/^#\/calculators\/?$/, view:calculators, navKey:'learning-path', side:true },
  { test:/^#\/chatgpt-lab\/?$/, view:chatgptLab, navKey:'chatgpt-lab', side:true },
  { test:/^#\/context-hint-lab\/?$/, view:contextHintLab, navKey:'chatgpt-lab', side:true },
  { test:/^#\/ad-builder\/?$/, view:adBuilder, navKey:'chatgpt-lab', side:true },
  { test:/^#\/arch-builder\/?$/, view:archBuilder, navKey:'chatgpt-lab', side:true },
  { test:/^#\/diagnostics-lab\/?$/, view:diagnosticsLab, navKey:'chatgpt-lab', side:true },
  { test:/^#\/launch-sim\/?$/, view:launchSim, navKey:'chatgpt-lab', side:true },
  { test:/^#\/ppc-lab\/?$/, view:ppcLab, navKey:'ppc-lab', side:true },
  { test:/^#\/analytics\/?$/, view:analyticsTools, navKey:'analytics', side:true },
  { test:/^#\/projects\/?$/, view:projects, navKey:'projects', side:true },
  { test:/^#\/glossary\/?$/, view:glossary, navKey:'glossary', side:true },
  { test:/^#\/notes\/?$/, view:notes, navKey:'notes', side:true },
  { test:/^#\/exam\/?$/, view:examView, navKey:'projects', side:false },
  { test:/^#\/settings\/?$/, view:settingsView, navKey:'settings', side:true },
];

function initial(name){ return (name||'?').trim().slice(0,1).toUpperCase() || '?'; }

function renderShell(){
  const app = document.getElementById('app');
  const s = getState();
  app.innerHTML = `
    <nav class="nav-rail" id="navRail"></nav>
    <div class="main-col">
      <main class="content" id="content"></main>
      <aside class="side-col" id="sideCol"></aside>
    </div>
  `;
  renderNavRail();
}

function renderNavRail(){
  const rail = document.getElementById('navRail');
  const route = (location.hash || '#/dashboard').split('?')[0];
  const active = ROUTES.find(r=>r.test.test(route));
  const activeKey = active ? active.navKey : 'dashboard';
  const s = getState();
  rail.innerHTML = `
    <div class="nav-logo">P</div>
    ${NAV.map(item => `
      <button class="nav-item ${item.key===activeKey?'active':''}" data-route="${item.route}" title="${item.label}">
        ${icon(item.icon)}
        <span class="tip">${item.label}</span>
      </button>
    `).join('')}
    <div class="nav-avatar" title="${s.profile.name||'Ученик'}">${initial(s.profile.name)}</div>
  `;
  rail.querySelectorAll('[data-route]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ location.hash = btn.dataset.route; });
  });
}

function route(){
  const s = getState();
  if (!s.onboarded && location.hash !== '#/onboarding'){
    location.hash = '#/onboarding';
    return;
  }
  const hash = location.hash || '#/dashboard';

  if (hash === '#/onboarding'){
    document.getElementById('app').innerHTML = `<main style="width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px"><div id="onboardingRoot" style="width:100%;max-width:720px"></div></main>`;
    onboarding.mount(document.getElementById('onboardingRoot'), {
      onDone: ()=>{ location.hash = '#/dashboard'; }
    });
    return;
  }

  if (!document.getElementById('navRail')) renderShell();
  touchStreak();
  renderNavRail();

  const hashPath = hash.split('?')[0];
  const match = ROUTES.find(r=>r.test.test(hashPath));
  const content = document.getElementById('content');
  const sideCol = document.getElementById('sideCol');

  if (!match){
    content.innerHTML = `<div class="card"><h2>Страница не найдена</h2><p class="section-sub">Похоже, такого раздела не существует.</p><a class="btn" href="#/dashboard">На Dashboard</a></div>`;
    sideCol.style.display='none';
    return;
  }

  const m = hashPath.match(match.test);
  const params = match.params ? match.params(m) : {};
  content.innerHTML = match.view.render(params);
  match.view.mount?.(content, params);

  if (match.side !== false){
    sideCol.style.display='';
    sideCol.innerHTML = renderSidePanel();
  } else {
    sideCol.style.display='none';
  }
  window.scrollTo(0,0);
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
if (document.readyState !== 'loading') route();
