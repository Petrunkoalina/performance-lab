import { getState, setState } from '../utils/storage.js';
import { fmt, fmtMoney, fmtPct } from '../utils/calc.js';
import { seededRandom } from '../utils/sim.js';

function data(){ return getState().googleAccount; }

const BIDDING = ['Manual CPC','Maximize Clicks','Maximize Conversions','Target CPA','Target ROAS'];

function simulate(d){
  if (!d.keywords.length || !d.budget) return null;
  const rand = seededRandom(d.keywords.join('|')+d.biddingStrategy+d.budget);
  const negPenalty = Math.min(0.4, d.negativeKeywords.length*0.03);
  const qualityBoost = d.adGroups.length ? Math.min(0.3, d.adGroups.reduce((a,g)=>a+(g.ads?.length||0),0)*0.05) : 0;
  const baseCpc = 1.2 * (1 - negPenalty) * (1 - qualityBoost) * (0.8+0.5*rand());
  const clicks = Math.round(d.budget/Math.max(0.2,baseCpc));
  const impressions = Math.round(clicks/(0.02+qualityBoost*0.03));
  const cvr = d.biddingStrategy.includes('Conversions')||d.biddingStrategy.includes('CPA')||d.biddingStrategy.includes('ROAS') ? 0.05+qualityBoost*0.1 : 0.025+qualityBoost*0.05;
  const conversions = Math.round(clicks*cvr);
  return { impressions, clicks, spend: d.budget, ctr: clicks/impressions*100, cpc: d.budget/clicks, conversions, cpa: conversions? d.budget/conversions : NaN };
}

export function render(){
  const d = data();
  const report = simulate(d);
  return `
    <h1 style="margin-bottom:6px">PPC Lab · Google Ads Simulator</h1>
    <p class="section-sub">Учебная модель Search-кампании: keywords → ad groups → negative keywords → ads → bidding → бюджет → результат.</p>
    <div class="warn-banner" style="margin-bottom:20px">⚠ Результаты — искусственная симуляция для практики, а не прогноз реальной эффективности.</div>

    <div class="grid grid-2">
      <div class="card">
        <h3 class="section-title" style="font-size:16px">1. Keywords</h3>
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <input class="input" id="kwInput" placeholder="Например: крем для сухой кожи">
          <select class="input" id="kwMatch" style="max-width:110px"><option value="phrase">"phrase"</option><option value="exact">[exact]</option><option value="broad">broad</option></select>
          <button class="btn secondary sm" id="addKwBtn">+</button>
        </div>
        <div>${d.keywords.map((k,i)=>`<span class="pill" style="margin:0 6px 6px 0;display:inline-flex">${matchWrap(k)} <button data-del-kw="${i}" style="border:none;background:none;margin-left:6px;cursor:pointer">✕</button></span>`).join('') || '<span style="color:var(--text-soft)">Пока нет keywords</span>'}</div>

        <h3 class="section-title" style="font-size:16px;margin-top:20px">2. Negative keywords</h3>
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <input class="input" id="negInput" placeholder="Например: бесплатно">
          <button class="btn secondary sm" id="addNegBtn">+</button>
        </div>
        <div>${d.negativeKeywords.map((k,i)=>`<span class="pill" style="margin:0 6px 6px 0;display:inline-flex;background:#FBEDE7">−${k} <button data-del-neg="${i}" style="border:none;background:none;margin-left:6px;cursor:pointer">✕</button></span>`).join('') || '<span style="color:var(--text-soft)">Нет минус-слов</span>'}</div>

        <h3 class="section-title" style="font-size:16px;margin-top:20px">3. Ad groups и объявления</h3>
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <input class="input" id="agInput" placeholder="Название ad group">
          <button class="btn secondary sm" id="addAgBtn">+</button>
        </div>
        ${d.adGroups.map((g,gi)=>`<div class="card-sm" style="border:1px solid var(--outline);border-radius:10px;padding:10px;margin-bottom:8px">
          <b>${g.name}</b> (${(g.ads||[]).length} объявлений)
          <div style="display:flex;gap:6px;margin-top:6px">
            <input class="input" data-adtext="${gi}" placeholder="Заголовок объявления">
            <button class="btn secondary sm" data-add-ad="${gi}">+</button>
          </div>
          <div style="margin-top:6px">${(g.ads||[]).map((a,ai)=>`<span class="pill" style="margin:0 6px 6px 0;display:inline-flex">${a} <button data-del-ad="${gi}|${ai}" style="border:none;background:none;margin-left:6px;cursor:pointer">✕</button></span>`).join('')}</div>
        </div>`).join('')}

        <h3 class="section-title" style="font-size:16px;margin-top:20px">4. Bidding и бюджет</h3>
        <label class="field-label">Bid strategy</label>
        <select class="input" id="biddingSelect" style="margin-bottom:10px">${BIDDING.map(b=>`<option ${d.biddingStrategy===b?'selected':''}>${b}</option>`).join('')}</select>
        <label class="field-label">Дневной бюджет, €</label>
        <input class="input" id="budgetInput" type="number" value="${d.budget||''}">
      </div>

      <div>
        <h3 class="section-title" style="font-size:16px">Симулированный результат</h3>
        ${report ? `<div class="grid grid-2" style="margin-bottom:16px">
          <div class="stat-tile"><div class="num">${fmt(report.impressions,0)}</div><div class="lbl">Impressions</div></div>
          <div class="stat-tile"><div class="num">${fmt(report.clicks,0)}</div><div class="lbl">Clicks</div></div>
          <div class="stat-tile"><div class="num">${fmtPct(report.ctr)}</div><div class="lbl">CTR</div></div>
          <div class="stat-tile"><div class="num">${fmtMoney(report.cpc)}</div><div class="lbl">Avg. CPC</div></div>
          <div class="stat-tile"><div class="num">${fmt(report.conversions,0)}</div><div class="lbl">Conversions</div></div>
          <div class="stat-tile"><div class="num">${fmtMoney(report.cpa)}</div><div class="lbl">CPA</div></div>
        </div>
        <div class="card">
          <h4 style="margin-bottom:8px">Подсказка для оптимизации</h4>
          <p style="font-size:13px;color:var(--text-soft)">${optimizationHint(d, report)}</p>
        </div>` : `<div class="card" style="color:var(--text-soft)">Добавьте keywords и бюджет, чтобы увидеть результат.</div>`}
      </div>
    </div>
  `;
}

function matchWrap(k){ return k.match==='exact'?`[${k.text}]`: k.match==='broad'?k.text:`"${k.text}"`; }

function optimizationHint(d, r){
  if (!d.negativeKeywords.length) return 'У вас пока нет минус-слов — добавьте их, чтобы отсечь нерелевантные показы и снизить CPC.';
  if (d.adGroups.some(g=>!(g.ads||[]).length)) return 'Есть ad groups без объявлений — без них показ невозможен.';
  if (r.ctr < 1) return 'CTR ниже 1% — стоит пересмотреть релевантность объявлений ключевым словам в группе.';
  if (isNaN(r.cpa)) return 'Пока нет конверсий в симуляции — попробуйте изменить bidding strategy на Target CPA/ROAS при наличии истории данных.';
  return 'Результаты выглядят сбалансированно. Попробуйте протестировать другую bidding strategy и сравнить симулированный CPA.';
}

export function mount(root){
  function upd(fn){ setState(s=>fn(s.googleAccount)); root.innerHTML = render(); mount(root); }

  root.querySelector('#addKwBtn').addEventListener('click', ()=>{
    const text = root.querySelector('#kwInput').value.trim(); if(!text) return;
    const match = root.querySelector('#kwMatch').value;
    upd(g=>g.keywords.push({text,match}));
  });
  root.querySelectorAll('[data-del-kw]').forEach(b=>b.addEventListener('click',()=>upd(g=>g.keywords.splice(Number(b.dataset.delKw),1))));

  root.querySelector('#addNegBtn').addEventListener('click', ()=>{
    const text = root.querySelector('#negInput').value.trim(); if(!text) return;
    upd(g=>g.negativeKeywords.push(text));
  });
  root.querySelectorAll('[data-del-neg]').forEach(b=>b.addEventListener('click',()=>upd(g=>g.negativeKeywords.splice(Number(b.dataset.delNeg),1))));

  root.querySelector('#addAgBtn').addEventListener('click', ()=>{
    const name = root.querySelector('#agInput').value.trim(); if(!name) return;
    upd(g=>g.adGroups.push({name, ads:[]}));
  });
  root.querySelectorAll('[data-add-ad]').forEach(b=>b.addEventListener('click',()=>{
    const gi = Number(b.dataset.addAd);
    const text = root.querySelector(`[data-adtext="${gi}"]`).value.trim(); if(!text) return;
    upd(g=>{ g.adGroups[gi].ads = g.adGroups[gi].ads||[]; g.adGroups[gi].ads.push(text); });
  }));
  root.querySelectorAll('[data-del-ad]').forEach(b=>b.addEventListener('click',()=>{
    const [gi,ai] = b.dataset.delAd.split('|').map(Number);
    upd(g=>g.adGroups[gi].ads.splice(ai,1));
  }));
  root.querySelector('#biddingSelect').addEventListener('change', (e)=>upd(g=>g.biddingStrategy=e.target.value));
  root.querySelector('#budgetInput').addEventListener('change', (e)=>upd(g=>g.budget=parseFloat(e.target.value)||0));
}
