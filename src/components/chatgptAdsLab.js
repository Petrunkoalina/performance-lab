import { getState, setState, logChange } from '../utils/storage.js';
import { scoreContextHint, scoreAdCopy, scoreLabel } from '../utils/heuristics.js';
import { simulateCampaignReport } from '../utils/sim.js';
import { fmt, fmtMoney, fmtPct } from '../utils/calc.js';
import { icon } from '../utils/icons.js';

const TABS = ['home','campaigns','audiences','conversions','reports','billing','users','settings','changelog'];
const TAB_LABELS = { home:'Home', campaigns:'Campaigns', audiences:'Audiences', conversions:'Conversions', reports:'Reports', billing:'Billing', users:'Users', settings:'Account Settings', changelog:'Change Log' };

let ui = { tab:'home', campaignId:null, adGroupId:null, view:'list' };

function uid(p){ return p+'_'+Math.random().toString(36).slice(2,9); }

function getCampaigns(){ return getState().savedCampaigns.chatgpt; }
function getCampaign(id){ return getCampaigns().find(c=>c.id===id); }

function shell(inner){
  return `
    <div style="margin-bottom:18px">
      <h1 style="margin-bottom:4px">ChatGPT Ads Lab</h1>
      <p class="section-sub">Учебный симулятор ключевой логики Ads Manager Beta. Все данные и результаты — искусственные.</p>
      <div class="warn-banner" style="margin-bottom:16px">⚠ Это не копия реального интерфейса и не прогноз фактической эффективности рекламы — только учебная модель для отработки принципов.</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
        ${TABS.map(t=>`<span class="filter-chip labtab ${ui.tab===t?'active':''}" data-tab="${t}">${TAB_LABELS[t]}</span>`).join('')}
      </div>
    </div>
    <div id="labBody">${inner}</div>
  `;
}

// ---------- HOME ----------
function renderHome(){
  const acc = getState().chatgptAccount;
  const campaigns = getCampaigns();
  const active = campaigns.filter(c=>c.status==='active').length;
  return `
    <div class="grid grid-4" style="margin-bottom:20px">
      <div class="stat-tile"><div class="num">${campaigns.length}</div><div class="lbl">Кампаний</div></div>
      <div class="stat-tile"><div class="num">${active}</div><div class="lbl">Активных</div></div>
      <div class="stat-tile"><div class="num">${acc.verification==='verified'?'✓':'—'}</div><div class="lbl">Верификация</div></div>
      <div class="stat-tile"><div class="num">${acc.billingProfile?'✓':'—'}</div><div class="lbl">Billing готов</div></div>
    </div>
    <div class="card">
      <h3 class="section-title" style="font-size:18px">С чего начать</h3>
      <ol style="padding-left:20px;line-height:2">
        <li>Заполните <a href="#" data-goto="settings">Account Settings</a> и пройдите верификацию</li>
        <li>Настройте <a href="#" data-goto="billing">Billing</a></li>
        <li>Создайте первую кампанию во вкладке <a href="#" data-goto="campaigns">Campaigns</a></li>
        <li>Добавьте Ad Group с context hints и объявления</li>
        <li>Посмотрите симулированные результаты во вкладке <a href="#" data-goto="reports">Reports</a></li>
      </ol>
    </div>
  `;
}

// ---------- CAMPAIGNS ----------
function statusPill(status){
  const map = { draft:['Draft','pill'], review:['In review','pill tag-warning'], active:['Serving','pill tag-completed'], not_serving:['Not serving','pill tag-error'] };
  const [label,cls] = map[status]||map.draft;
  return `<span class="${cls}">${label}</span>`;
}

function computeStatus(c, acc){
  if (!acc.billingProfile || acc.verification!=='verified') return 'not_serving';
  if (!c.adGroups.length || !c.adGroups.some(ag=>ag.ads.length)) return 'draft';
  const allAdsReady = c.adGroups.every(ag=>ag.ads.length>0 && ag.contextHints.length>0 && ag.maxBid>0);
  return allAdsReady ? 'active' : 'review';
}

function renderCampaignList(){
  const campaigns = getCampaigns();
  const acc = getState().chatgptAccount;
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 class="section-title" style="margin:0">Campaigns</h3>
      <button class="btn sm" id="newCampaignBtn">${icon('plus')} Новая кампания</button>
    </div>
    ${!campaigns.length ? `<div class="card" style="text-align:center;color:var(--text-soft)">Пока нет кампаний. Создайте первую.</div>` : `
    <div class="card" style="padding:0;overflow-x:auto">
      <table class="data-table">
        <tr><th>Название</th><th>Objective</th><th>Бюджет</th><th>Ad groups</th><th>Статус</th><th></th></tr>
        ${campaigns.map(c=>`<tr>
          <td><a href="#" data-open="${c.id}">${c.title}</a></td>
          <td>${c.objective}</td>
          <td>${c.budgetType==='daily'?'Daily':'Total'} ${fmtMoney(c.budgetAmount)}</td>
          <td>${c.adGroups.length}</td>
          <td>${statusPill(computeStatus(c,acc))}</td>
          <td><button class="btn secondary sm" data-del="${c.id}">${icon('trash')}</button></td>
        </tr>`).join('')}
      </table>
    </div>`}
  `;
}

function fieldRow(label, inputHtml, help){
  return `<div style="margin-bottom:14px"><label class="field-label">${label}</label>${inputHtml}${help?`<div style="font-size:12px;color:var(--text-soft);margin-top:4px">${help}</div>`:''}</div>`;
}

function renderCampaignForm(){
  return `
    <button class="btn secondary sm" id="backToList" style="margin-bottom:14px">${icon('arrowLeft')} К списку</button>
    <div class="card">
      <h3 class="section-title" style="font-size:20px">Новая кампания</h3>
      ${fieldRow('Campaign title', `<input class="input" id="f_title" placeholder="Brand_Kitchen_oCPC_2026-09">`, 'Единый нейминг облегчает отчётность (модуль 12).')}
      ${fieldRow('Objective', `<select class="input" id="f_objective">
          <option value="CPM">CPM — охват и узнаваемость (оплата за 1000 показов)</option>
          <option value="CPC">CPC — трафик и вовлечённость (оплата за клик)</option>
          <option value="oCPC">oCPC — конверсии (оплата за клик, оптимизация под конверсию)</option>
        </select>`, 'Нельзя изменить после создания кампании (модуль 11).')}
      <div id="convEventWrap" style="display:none">${fieldRow('Conversion event', `<select class="input" id="f_convEvent"></select>`)}</div>
      ${fieldRow('Тип бюджета', `<select class="input" id="f_budgetType"><option value="daily">Daily budget</option><option value="total">Campaign-total budget</option></select>`)}
      ${fieldRow('Сумма бюджета, €', `<input class="input" id="f_budget" type="number" placeholder="50">`, 'Daily budget может расходоваться до ×2 в отдельный день и не более ×7 за неделю.')}
      <div class="grid grid-2">
        ${fieldRow('Start date', `<input class="input" id="f_start" type="date">`)}
        ${fieldRow('End date (опционально)', `<input class="input" id="f_end" type="date">`)}
      </div>
      ${fieldRow('Countries', `<input class="input" id="f_countries" placeholder="Germany, Austria, Netherlands">`)}
      ${fieldRow('Platforms', `<div style="display:flex;gap:14px">
          <label><input type="checkbox" class="f_platform" value="iOS App" checked> iOS App</label>
          <label><input type="checkbox" class="f_platform" value="Android App" checked> Android App</label>
          <label><input type="checkbox" class="f_platform" value="Web" checked> Web</label>
        </div>`)}
      <button class="btn" id="saveCampaignBtn">Создать кампанию</button>
    </div>
  `;
}

function renderCampaignDetail(c){
  const acc = getState().chatgptAccount;
  return `
    <button class="btn secondary sm" id="backToList" style="margin-bottom:14px">${icon('arrowLeft')} К списку кампаний</button>
    <div class="card" style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <h3 style="margin-bottom:4px">${c.title}</h3>
          <p class="section-sub">Objective: ${c.objective} · ${c.budgetType==='daily'?'Daily':'Total'} budget ${fmtMoney(c.budgetAmount)} · ${statusPill(computeStatus(c,acc))}</p>
        </div>
        <button class="btn secondary sm" data-del="${c.id}">${icon('trash')} Удалить</button>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <h4 style="margin:0">Ad Groups</h4>
      <button class="btn sm" id="newAdGroupBtn">${icon('plus')} Новая ad group</button>
    </div>
    <div id="newAdGroupForm" style="display:none;margin-bottom:14px">
      <div style="display:flex;gap:8px">
        <input class="input" id="newAdGroupName" placeholder="Название ad group (тема/продукт)">
        <button class="btn secondary sm" id="confirmAdGroupBtn">Добавить</button>
      </div>
    </div>
    ${!c.adGroups.length ? `<div class="card" style="color:var(--text-soft)">Добавьте ad group с context hints, чтобы кампания могла начать показ.</div>` :
      c.adGroups.map(ag=>renderAdGroupCard(c, ag)).join('')}
  `;
}

function renderAdGroupCard(c, ag){
  const hintScores = ag.contextHints.map(h=>scoreContextHint(h));
  const avgHint = hintScores.length ? Math.round(hintScores.reduce((a,b)=>a+b.overall,0)/hintScores.length) : 0;
  return `
  <div class="card" style="margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div><b>${ag.title}</b> <span class="pill sm" style="margin-left:8px">Max bid: ${ag.maxBid?fmtMoney(ag.maxBid):'—'}</span></div>
      <button class="btn secondary sm" data-del-ag="${ag.id}">${icon('trash')}</button>
    </div>
    <div style="margin-bottom:12px">
      <label class="field-label">Context hints (${ag.contextHints.length}) — средняя оценка: ${avgHint}/100</label>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${ag.contextHints.map((h,i)=>{
          const sc = scoreContextHint(h); const lbl = scoreLabel(sc.overall);
          return `<div class="callout ${sc.overall>=70?'term':sc.overall>=45?'example':'mistake'}" style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <span style="font-size:13px">${h}</span>
            <span style="display:flex;align-items:center;gap:8px;flex-shrink:0">
              <span class="pill ${lbl.cls}" style="font-size:11px">${sc.overall}/100</span>
              <button class="btn secondary sm" data-del-hint="${ag.id}|${i}">✕</button>
            </span>
          </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:8px">
        <input class="input" placeholder="Опишите продукт, кому помогает и когда полезен…" data-hint-input="${ag.id}">
        <button class="btn secondary sm" data-add-hint="${ag.id}">Добавить</button>
      </div>
    </div>
    <div style="margin-bottom:12px;max-width:200px">
      <label class="field-label">Maximum bid, €</label>
      <input class="input" type="number" step="0.1" value="${ag.maxBid||''}" data-bid="${ag.id}" placeholder="${c.objective==='CPM'?'8 (за 1000 показов)':'3-5'}">
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <label class="field-label" style="margin:0">Ads (${ag.ads.length})</label>
      <button class="btn secondary sm" data-new-ad="${ag.id}">${icon('plus')} Ad</button>
    </div>
    ${ag.ads.map(ad=>renderAdRow(ag, ad)).join('')}
  </div>`;
}

function renderAdRow(ag, ad){
  const sc = scoreAdCopy(ad); const lbl = scoreLabel(sc.overall);
  return `<div class="card-sm" style="border:1px solid var(--outline);border-radius:12px;padding:12px;margin-bottom:8px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
      <div style="flex:1">
        <div style="font-weight:700;font-size:14px">${ad.title||'(без заголовка)'}</div>
        <div style="font-size:13px;color:var(--text-soft);margin:4px 0">${ad.copy||''}</div>
        <div style="font-size:12px;color:var(--text-soft)">${ad.advertiserName||'Advertiser'} · ${ad.landingPage||'нет landing page'}</div>
      </div>
      <span class="pill ${lbl.cls}">${sc.overall}/100</span>
    </div>
    <button class="btn secondary sm" data-del-ad="${ag.id}|${ad.id}" style="margin-top:8px">Удалить</button>
  </div>`;
}

function renderAdForm(agId){
  return `
    <button class="btn secondary sm" id="backToDetail" style="margin-bottom:14px">${icon('arrowLeft')} Назад</button>
    <div class="card">
      <h3 class="section-title" style="font-size:18px">Новое объявление</h3>
      ${fieldRow('Advertiser name', `<input class="input" id="a_advertiser">`)}
      ${fieldRow('Title', `<input class="input" id="a_title" maxlength="60">`, 'До ~60 символов, benefit-focused (модуль 14).')}
      ${fieldRow('Copy', `<textarea class="input" id="a_copy" rows="3" maxlength="150"></textarea>`)}
      ${fieldRow('Landing page URL', `<input class="input" id="a_landing" placeholder="https://example.com/product">`)}
      ${fieldRow('Image (описание креатива)', `<input class="input" id="a_image" placeholder="Например: product-focused, светлый фон">`)}
      <button class="btn" id="saveAdBtn" data-ag="${agId}">Сохранить объявление</button>
    </div>
  `;
}

// ---------- AUDIENCES ----------
function renderAudiences(){
  const acc = getState().chatgptAccount;
  return `
    <div class="card">
      <h3 class="section-title" style="font-size:18px">Custom Audiences</h3>
      <p class="section-sub">Учебная имитация: загрузите условное название списка (например, email-базы или посетителей сайта) — в реальном Ads Manager Custom Audiences настраиваются на уровне кампании (include/exclude).</p>
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <input class="input" id="audienceName" placeholder="Например: Покупатели за 90 дней">
        <button class="btn secondary sm" id="addAudienceBtn">Добавить</button>
      </div>
      <div id="audienceList">
        ${(acc.audiences||[]).map((a,i)=>`<div class="pill" style="margin:0 8px 8px 0;display:inline-flex">${a} <button data-del-audience="${i}" style="border:none;background:none;margin-left:6px;cursor:pointer">✕</button></div>`).join('') || '<span style="color:var(--text-soft)">Пока нет аудиторий</span>'}
      </div>
    </div>
  `;
}

// ---------- CONVERSIONS ----------
function renderConversions(){
  const acc = getState().chatgptAccount;
  return `
    <div class="card">
      <h3 class="section-title" style="font-size:18px">Conversion events</h3>
      <p class="section-sub">Задайте события, которые считаются конверсией для oCPC-кампаний (модуль 17: measurement plan).</p>
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <input class="input" id="convName" placeholder="Например: Sign Up">
        <button class="btn secondary sm" id="addConvBtn">Добавить</button>
      </div>
      <div>${acc.conversionEvents.map((e,i)=>`<span class="pill" style="margin:0 8px 8px 0;display:inline-flex">${e} <button data-del-conv="${i}" style="border:none;background:none;margin-left:6px;cursor:pointer">✕</button></span>`).join('')}</div>
    </div>
  `;
}

// ---------- REPORTS ----------
function renderReports(){
  const campaigns = getCampaigns();
  if (!campaigns.length) return `<div class="card" style="color:var(--text-soft)">Нет кампаний для отчёта.</div>`;
  const reports = campaigns.map(c=>({ c, r: simulateCampaignReport(c) }));
  return `
    <div class="card" style="padding:0;overflow-x:auto;margin-bottom:20px">
      <table class="data-table">
        <tr><th>Campaign</th><th>Impr.</th><th>Clicks</th><th>Spend</th><th>CTR</th><th>Avg. CPC</th><th>Avg. CPM</th><th>Conv.</th><th>CPA</th></tr>
        ${reports.map(({c,r})=>`<tr>
          <td>${c.title}</td><td>${fmt(r.impressions,0)}</td><td>${fmt(r.clicks,0)}</td><td>${fmtMoney(r.spend)}</td>
          <td>${fmtPct(r.ctr)}</td><td>${fmtMoney(r.cpc)}</td><td>${fmtMoney(r.cpm)}</td><td>${fmt(r.conversions,0)}</td><td>${fmtMoney(r.cpa)}</td>
        </tr>`).join('')}
      </table>
    </div>
    <div class="card">
      <h4 style="margin-bottom:12px">Spend по кампаниям</h4>
      <div style="display:flex;align-items:flex-end;gap:14px;height:140px">
        ${(()=>{ const max=Math.max(...reports.map(x=>x.r.spend),1); return reports.map(({c,r})=>`
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
            <div style="font-size:11px">${fmtMoney(r.spend)}</div>
            <div style="width:100%;background:var(--mint);border-radius:6px 6px 0 0;height:${Math.max(4,(r.spend/max)*100)}px"></div>
            <div style="font-size:10px;color:var(--text-soft);text-align:center">${c.title.slice(0,14)}</div>
          </div>`).join(''); })()}
      </div>
    </div>
    <div class="no-print" style="display:flex;gap:10px;margin-top:14px">
      <button class="btn secondary sm" id="exportCsvBtn">${icon('download')} Экспорт CSV</button>
      <button class="btn secondary sm" id="printReportBtn">Экспорт в PDF (печать)</button>
    </div>
  `;
}

// ---------- BILLING ----------
function renderBilling(){
  const acc = getState().chatgptAccount;
  return `
    <div class="grid grid-2">
      <div class="card">
        <h3 class="section-title" style="font-size:18px">Billing profile</h3>
        ${fieldRow('Business name', `<input class="input" id="b_name" value="${acc.billingProfile?.name||''}">`)}
        ${fieldRow('Billing address', `<input class="input" id="b_addr" value="${acc.billingProfile?.addr||''}">`)}
        ${fieldRow('Invoice email', `<input class="input" id="b_email" value="${acc.billingProfile?.email||''}">`)}
        <button class="btn secondary sm" id="saveBillingBtn">Сохранить billing profile</button>
      </div>
      <div class="card">
        <h3 class="section-title" style="font-size:18px">Payment method</h3>
        ${fieldRow('Номер карты (учебный, не сохраняется по-настоящему)', `<input class="input" id="p_card" placeholder="4242 4242 4242 4242" value="${acc.paymentMethod?'•••• •••• •••• '+acc.paymentMethod.last4:''}">`)}
        <button class="btn secondary sm" id="savePaymentBtn">Добавить способ оплаты</button>
        <div class="divider"></div>
        <p style="font-size:13px;color:var(--text-soft)">ChatGPT Ads использует <b>постоплатную модель</b>: списание происходит при достижении payment threshold (учебное значение: €25), а не по бюджету кампании напрямую.</p>
        <div class="stat-tile" style="margin-top:10px"><div class="num">${fmtMoney(25)}</div><div class="lbl">Payment threshold (учебный)</div></div>
      </div>
    </div>
  `;
}

// ---------- USERS ----------
function renderUsers(){
  const acc = getState().chatgptAccount;
  return `
    <div class="card">
      <h3 class="section-title" style="font-size:18px">Users & roles</h3>
      <p class="section-sub">Admin управляет аккаунтом и доступами; Member ведёт кампании; Viewer только просматривает (модуль 9).</p>
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <input class="input" id="userEmail" placeholder="email@agency.com">
        <select class="input" id="userRole" style="max-width:140px"><option>Member</option><option>Admin</option><option>Viewer</option></select>
        <button class="btn secondary sm" id="addUserBtn">Пригласить</button>
      </div>
      <table class="data-table">
        <tr><th>Email</th><th>Роль</th><th></th></tr>
        ${acc.users.map((u,i)=>`<tr><td>${u.email}</td><td><span class="pill">${u.role}</span></td><td><button class="btn secondary sm" data-del-user="${i}">${icon('trash')}</button></td></tr>`).join('') || '<tr><td colspan="3" style="color:var(--text-soft)">Только вы (Admin)</td></tr>'}
      </table>
    </div>
  `;
}

// ---------- ACCOUNT SETTINGS ----------
function renderSettingsTab(){
  const acc = getState().chatgptAccount;
  return `
    <div class="card" style="margin-bottom:16px">
      <h3 class="section-title" style="font-size:18px">Account info</h3>
      ${fieldRow('Account name', `<input class="input" id="s_name" value="${acc.businessName}">`)}
      ${fieldRow('Website', `<input class="input" id="s_site" value="${acc.website}">`)}
      ${fieldRow('Country (нельзя изменить после создания)', `<input class="input" id="s_country" value="${acc.country}" ${acc.country?'disabled':''}>`)}
      <button class="btn secondary sm" id="saveSettingsBtn">Сохранить</button>
    </div>
    <div class="card">
      <h3 class="section-title" style="font-size:18px">Verification</h3>
      <p class="section-sub">Статус: <span class="pill ${acc.verification==='verified'?'tag-completed':'tag-warning'}">${acc.verification}</span></p>
      ${acc.verification!=='verified' ? `<button class="btn" id="verifyBtn">Пройти учебную верификацию</button>` : `<p style="color:var(--mint-d);font-weight:600">Аккаунт верифицирован ✓</p>`}
    </div>
  `;
}

// ---------- CHANGE LOG ----------
function renderChangeLog(){
  const acc = getState().chatgptAccount;
  return `<div class="card">
    <h3 class="section-title" style="font-size:18px">Change Log</h3>
    ${!acc.changeLog.length ? `<p style="color:var(--text-soft)">Пока нет изменений.</p>` :
      `<table class="data-table"><tr><th>Дата</th><th>Действие</th></tr>${acc.changeLog.map(l=>`<tr><td style="white-space:nowrap">${new Date(l.ts).toLocaleString('ru-RU')}</td><td>${l.text}</td></tr>`).join('')}</table>`}
  </div>`;
}

function renderBody(){
  if (ui.tab==='home') return renderHome();
  if (ui.tab==='campaigns'){
    if (ui.view==='form') return renderCampaignForm();
    if (ui.view==='adform') return renderAdForm(ui.adGroupId);
    if (ui.view==='detail'){
      const c = getCampaign(ui.campaignId);
      if (c) return renderCampaignDetail(c);
    }
    return renderCampaignList();
  }
  if (ui.tab==='audiences') return renderAudiences();
  if (ui.tab==='conversions') return renderConversions();
  if (ui.tab==='reports') return renderReports();
  if (ui.tab==='billing') return renderBilling();
  if (ui.tab==='users') return renderUsers();
  if (ui.tab==='settings') return renderSettingsTab();
  if (ui.tab==='changelog') return renderChangeLog();
  return '';
}

export function render(){ return shell(renderBody()); }

export function mount(root){
  function rerender(){ root.innerHTML = shell(renderBody()); mount(root); }

  root.querySelectorAll('.labtab').forEach(t=>t.addEventListener('click', ()=>{ ui.tab=t.dataset.tab; ui.view='list'; rerender(); }));
  root.querySelectorAll('[data-goto]').forEach(a=>a.addEventListener('click',(e)=>{ e.preventDefault(); ui.tab=a.dataset.goto; rerender(); }));

  if (ui.tab==='campaigns'){
    const newBtn = root.querySelector('#newCampaignBtn');
    if (newBtn) newBtn.addEventListener('click', ()=>{ ui.view='form'; rerender(); });

    const backBtn = root.querySelector('#backToList');
    if (backBtn) backBtn.addEventListener('click', ()=>{ ui.view='list'; ui.campaignId=null; rerender(); });

    const backDetail = root.querySelector('#backToDetail');
    if (backDetail) backDetail.addEventListener('click', ()=>{ ui.view='detail'; rerender(); });

    root.querySelectorAll('[data-open]').forEach(a=>a.addEventListener('click',(e)=>{ e.preventDefault(); ui.campaignId=a.dataset.open; ui.view='detail'; rerender(); }));
    root.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',()=>{
      setState(s=>{ s.savedCampaigns.chatgpt = s.savedCampaigns.chatgpt.filter(c=>c.id!==b.dataset.del); });
      logChange('Удалена кампания');
      ui.view='list'; rerender();
    }));

    const objSel = root.querySelector('#f_objective');
    if (objSel) objSel.addEventListener('change', ()=>{
      const wrap = root.querySelector('#convEventWrap');
      const sel = root.querySelector('#f_convEvent');
      if (objSel.value==='oCPC'){
        wrap.style.display='block';
        sel.innerHTML = getState().chatgptAccount.conversionEvents.map(e=>`<option>${e}</option>`).join('');
      } else wrap.style.display='none';
    });

    const saveCampaignBtn = root.querySelector('#saveCampaignBtn');
    if (saveCampaignBtn) saveCampaignBtn.addEventListener('click', ()=>{
      const title = root.querySelector('#f_title').value.trim() || 'Untitled campaign';
      const objective = root.querySelector('#f_objective').value;
      const budgetType = root.querySelector('#f_budgetType').value;
      const budgetAmount = parseFloat(root.querySelector('#f_budget').value)||0;
      const start = root.querySelector('#f_start').value;
      const end = root.querySelector('#f_end').value;
      const countries = root.querySelector('#f_countries').value.split(',').map(s=>s.trim()).filter(Boolean);
      const platforms = [...root.querySelectorAll('.f_platform:checked')].map(c=>c.value);
      const newC = { id:uid('camp'), title, objective, conversionEvent: root.querySelector('#f_convEvent')?.value||null, budgetType, budgetAmount, start, end, countries, platforms, adGroups:[], createdAt:Date.now() };
      setState(s=>{ s.savedCampaigns.chatgpt.push(newC); });
      logChange(`Создана кампания «${title}» (${objective})`);
      ui.view='detail'; ui.campaignId=newC.id; rerender();
    });

    const newAgBtn = root.querySelector('#newAdGroupBtn');
    if (newAgBtn) newAgBtn.addEventListener('click', ()=>{
      const form = root.querySelector('#newAdGroupForm');
      form.style.display = form.style.display==='none' ? 'block' : 'none';
      if (form.style.display==='block') root.querySelector('#newAdGroupName').focus();
    });
    const confirmAgBtn = root.querySelector('#confirmAdGroupBtn');
    if (confirmAgBtn) confirmAgBtn.addEventListener('click', ()=>{
      const title = root.querySelector('#newAdGroupName').value.trim();
      if (!title) return;
      setState(s=>{
        const c = s.savedCampaigns.chatgpt.find(c=>c.id===ui.campaignId);
        c.adGroups.push({ id:uid('ag'), title, contextHints:[], maxBid:0, ads:[] });
      });
      logChange(`Добавлена ad group «${title}»`);
      rerender();
    });

    root.querySelectorAll('[data-del-ag]').forEach(b=>b.addEventListener('click',()=>{
      setState(s=>{ const c=s.savedCampaigns.chatgpt.find(c=>c.id===ui.campaignId); c.adGroups = c.adGroups.filter(a=>a.id!==b.dataset.delAg); });
      rerender();
    }));

    root.querySelectorAll('[data-add-hint]').forEach(b=>b.addEventListener('click',()=>{
      const agId = b.dataset.addHint;
      const input = root.querySelector(`[data-hint-input="${agId}"]`);
      const val = input.value.trim();
      if (!val) return;
      setState(s=>{ const c=s.savedCampaigns.chatgpt.find(c=>c.id===ui.campaignId); c.adGroups.find(a=>a.id===agId).contextHints.push(val); });
      logChange('Добавлен context hint');
      rerender();
    }));
    root.querySelectorAll('[data-del-hint]').forEach(b=>b.addEventListener('click',()=>{
      const [agId, idx] = b.dataset.delHint.split('|');
      setState(s=>{ const c=s.savedCampaigns.chatgpt.find(c=>c.id===ui.campaignId); c.adGroups.find(a=>a.id===agId).contextHints.splice(Number(idx),1); });
      rerender();
    }));
    root.querySelectorAll('[data-bid]').forEach(inp=>inp.addEventListener('change',()=>{
      setState(s=>{ const c=s.savedCampaigns.chatgpt.find(c=>c.id===ui.campaignId); c.adGroups.find(a=>a.id===inp.dataset.bid).maxBid = parseFloat(inp.value)||0; });
      logChange('Изменена ставка Maximum bid');
    }));

    root.querySelectorAll('[data-new-ad]').forEach(b=>b.addEventListener('click',()=>{ ui.adGroupId=b.dataset.newAd; ui.view='adform'; rerender(); }));
    const saveAdBtn = root.querySelector('#saveAdBtn');
    if (saveAdBtn) saveAdBtn.addEventListener('click', ()=>{
      const ad = { id:uid('ad'), advertiserName:root.querySelector('#a_advertiser').value, title:root.querySelector('#a_title').value, copy:root.querySelector('#a_copy').value, landingPage:root.querySelector('#a_landing').value, image:root.querySelector('#a_image').value };
      setState(s=>{ const c=s.savedCampaigns.chatgpt.find(c=>c.id===ui.campaignId); c.adGroups.find(a=>a.id===saveAdBtn.dataset.ag).ads.push(ad); });
      logChange(`Создано объявление «${ad.title}»`);
      ui.view='detail'; rerender();
    });
    root.querySelectorAll('[data-del-ad]').forEach(b=>b.addEventListener('click',()=>{
      const [agId, adId] = b.dataset.delAd.split('|');
      setState(s=>{ const c=s.savedCampaigns.chatgpt.find(c=>c.id===ui.campaignId); const ag=c.adGroups.find(a=>a.id===agId); ag.ads = ag.ads.filter(a=>a.id!==adId); });
      rerender();
    }));
  }

  if (ui.tab==='audiences'){
    root.querySelector('#addAudienceBtn')?.addEventListener('click', ()=>{
      const val = root.querySelector('#audienceName').value.trim(); if(!val) return;
      setState(s=>{ s.chatgptAccount.audiences = s.chatgptAccount.audiences||[]; s.chatgptAccount.audiences.push(val); });
      logChange(`Добавлена custom audience «${val}»`); rerender();
    });
    root.querySelectorAll('[data-del-audience]').forEach(b=>b.addEventListener('click',()=>{
      setState(s=>{ s.chatgptAccount.audiences.splice(Number(b.dataset.delAudience),1); }); rerender();
    }));
  }

  if (ui.tab==='conversions'){
    root.querySelector('#addConvBtn')?.addEventListener('click', ()=>{
      const val = root.querySelector('#convName').value.trim(); if(!val) return;
      setState(s=>{ s.chatgptAccount.conversionEvents.push(val); });
      logChange(`Добавлено conversion event «${val}»`); rerender();
    });
    root.querySelectorAll('[data-del-conv]').forEach(b=>b.addEventListener('click',()=>{
      setState(s=>{ s.chatgptAccount.conversionEvents.splice(Number(b.dataset.delConv),1); }); rerender();
    }));
  }

  if (ui.tab==='reports'){
    root.querySelector('#exportCsvBtn')?.addEventListener('click', ()=>{
      const campaigns = getCampaigns();
      const rows = [['Campaign','Impressions','Clicks','Spend','CTR','CPC','CPM','Conversions','CPA']];
      campaigns.forEach(c=>{ const r=simulateCampaignReport(c); rows.push([c.title,r.impressions,r.clicks,r.spend,r.ctr.toFixed(2),r.cpc.toFixed(2),r.cpm.toFixed(2),r.conversions,r.cpa.toFixed(2)]); });
      const csv = rows.map(r=>r.join(',')).join('\n');
      const blob = new Blob([csv],{type:'text/csv'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='chatgpt_ads_report.csv'; a.click();
    });
    root.querySelector('#printReportBtn')?.addEventListener('click', ()=>window.print());
  }

  if (ui.tab==='billing'){
    root.querySelector('#saveBillingBtn')?.addEventListener('click', ()=>{
      const profile = { name:root.querySelector('#b_name').value, addr:root.querySelector('#b_addr').value, email:root.querySelector('#b_email').value };
      setState(s=>{ s.chatgptAccount.billingProfile = profile; });
      logChange('Настроен billing profile'); rerender();
    });
    root.querySelector('#savePaymentBtn')?.addEventListener('click', ()=>{
      const card = root.querySelector('#p_card').value.replace(/\s/g,'');
      setState(s=>{ s.chatgptAccount.paymentMethod = { last4: card.slice(-4)||'0000' }; });
      logChange('Добавлен способ оплаты'); rerender();
    });
  }

  if (ui.tab==='users'){
    root.querySelector('#addUserBtn')?.addEventListener('click', ()=>{
      const email = root.querySelector('#userEmail').value.trim(); if(!email) return;
      const role = root.querySelector('#userRole').value;
      setState(s=>{ s.chatgptAccount.users.push({email,role}); });
      logChange(`Приглашён пользователь ${email} (${role})`); rerender();
    });
    root.querySelectorAll('[data-del-user]').forEach(b=>b.addEventListener('click',()=>{
      setState(s=>{ s.chatgptAccount.users.splice(Number(b.dataset.delUser),1); }); rerender();
    }));
  }

  if (ui.tab==='settings'){
    root.querySelector('#saveSettingsBtn')?.addEventListener('click', ()=>{
      setState(s=>{ s.chatgptAccount.businessName=root.querySelector('#s_name').value; s.chatgptAccount.website=root.querySelector('#s_site').value; if(!s.chatgptAccount.country) s.chatgptAccount.country=root.querySelector('#s_country').value; });
      logChange('Обновлены account info'); rerender();
    });
    root.querySelector('#verifyBtn')?.addEventListener('click', ()=>{
      setState(s=>{ s.chatgptAccount.verification='verified'; });
      logChange('Аккаунт прошёл учебную верификацию'); rerender();
    });
  }
}
