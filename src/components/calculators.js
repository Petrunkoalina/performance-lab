import * as calc from '../utils/calc.js';

const CALCS = [
  { id:'ctr', title:'CTR', formula:'Clicks ÷ Impressions × 100%',
    fields:[{k:'clicks',l:'Clicks'},{k:'impr',l:'Impressions'}],
    compute:(v)=>calc.fmtPct(calc.ctr(v.clicks, v.impr)) },
  { id:'cpc', title:'CPC', formula:'Spend ÷ Clicks',
    fields:[{k:'spend',l:'Spend, €'},{k:'clicks',l:'Clicks'}],
    compute:(v)=>calc.fmtMoney(calc.cpc(v.spend, v.clicks)) },
  { id:'cpm', title:'CPM', formula:'Spend ÷ Impressions × 1000',
    fields:[{k:'spend',l:'Spend, €'},{k:'impr',l:'Impressions'}],
    compute:(v)=>calc.fmtMoney(calc.cpm(v.spend, v.impr)) },
  { id:'cvr', title:'Conversion Rate', formula:'Conversions ÷ Clicks × 100%',
    fields:[{k:'conv',l:'Conversions'},{k:'clicks',l:'Clicks'}],
    compute:(v)=>calc.fmtPct(calc.conversionRate(v.conv, v.clicks)) },
  { id:'cpa', title:'CPA', formula:'Spend ÷ Conversions',
    fields:[{k:'spend',l:'Spend, €'},{k:'conv',l:'Conversions'}],
    compute:(v)=>calc.fmtMoney(calc.cpa(v.spend, v.conv)) },
  { id:'roas', title:'ROAS', formula:'Revenue ÷ Spend',
    fields:[{k:'revenue',l:'Revenue, €'},{k:'spend',l:'Spend, €'}],
    compute:(v)=>calc.fmt(calc.roas(v.revenue, v.spend)) },
  { id:'romi', title:'ROMI', formula:'(Revenue − Spend) ÷ Spend × 100%',
    fields:[{k:'revenue',l:'Revenue, €'},{k:'spend',l:'Spend, €'}],
    compute:(v)=>calc.fmtPct(calc.romi(v.revenue, v.spend)) },
  { id:'be_roas', title:'Break-even ROAS', formula:'100 ÷ Margin%',
    fields:[{k:'margin',l:'Маржа, %'}],
    compute:(v)=>calc.fmt(calc.breakEvenRoas(v.margin)) },
  { id:'max_cpa', title:'Допустимый CPA', formula:'AOV × Margin%',
    fields:[{k:'aov',l:'AOV, €'},{k:'margin',l:'Маржа, % (0-100)'}],
    compute:(v)=>calc.fmtMoney(calc.maxAllowedCpa(v.aov, v.margin)) },
  { id:'ltv', title:'LTV', formula:'AOV × покупок/год × лет удержания',
    fields:[{k:'aov',l:'AOV, €'},{k:'freq',l:'Покупок в год'},{k:'years',l:'Лет удержания'}],
    compute:(v)=>calc.fmtMoney(calc.ltv(v.aov, v.freq, v.years)) },
  { id:'cac', title:'CAC', formula:'Total Spend ÷ New Customers',
    fields:[{k:'spend',l:'Общие затраты, €'},{k:'newcust',l:'Новых клиентов'}],
    compute:(v)=>calc.fmtMoney(calc.cac(v.spend, v.newcust)) },
  { id:'forecast', title:'Прогноз конверсий', formula:'(Budget ÷ CPC) × CVR%',
    fields:[{k:'budget',l:'Бюджет, €'},{k:'cpc',l:'Ожидаемый CPC, €'},{k:'cvr',l:'Ожидаемый CVR, %'}],
    compute:(v)=>calc.fmt(calc.forecastConversions(v.budget, v.cpc, v.cvr)) },
];

function calcCard(c){
  return `<div class="card" data-calc="${c.id}">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
      <h3 style="margin:0">${c.title}</h3>
      <span style="font-size:12px;color:var(--text-soft)">${c.formula}</span>
    </div>
    <div class="grid grid-2" style="margin:14px 0 10px">
      ${c.fields.map(f=>`<div><label class="field-label">${f.l}</label><input class="input calc-field" data-k="${f.k}" type="number" step="any" placeholder="0"></div>`).join('')}
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      <span style="font-size:13px;color:var(--text-soft)">Результат:</span>
      <span class="calc-result" style="font-family:var(--font-display);font-weight:800;font-size:22px">—</span>
    </div>
  </div>`;
}

export function render(){
  return `
    <h1 style="margin-bottom:6px">Калькуляторы</h1>
    <p class="section-sub">Введите цифры своей кампании — результат считается мгновенно, без сохранения на сервере.</p>
    <div class="grid grid-2">${CALCS.map(calcCard).join('')}</div>

    <h3 class="section-title" style="margin-top:32px">Распределение бюджета</h3>
    <div class="card">
      <label class="field-label">Общий бюджет, €</label>
      <input class="input" id="budgetTotal" type="number" placeholder="1000" style="margin-bottom:12px">
      <label class="field-label">Веса каналов через запятую (например: ChatGPT Ads=50, Google Ads=30, Meta Ads=20)</label>
      <input class="input" id="budgetWeights" placeholder="ChatGPT Ads=50, Google Ads=30, Meta Ads=20" style="margin-bottom:12px">
      <button class="btn secondary sm" id="splitBtn">Рассчитать</button>
      <div id="splitResult" style="margin-top:14px"></div>
    </div>
  `;
}

export function mount(root){
  CALCS.forEach(c=>{
    const card = root.querySelector(`[data-calc="${c.id}"]`);
    const inputs = card.querySelectorAll('.calc-field');
    const resultEl = card.querySelector('.calc-result');
    function recompute(){
      const v = {};
      inputs.forEach(i=>{ v[i.dataset.k] = parseFloat(i.value); });
      resultEl.textContent = c.compute(v);
    }
    inputs.forEach(i=>i.addEventListener('input', recompute));
  });

  root.querySelector('#splitBtn').addEventListener('click', ()=>{
    const total = parseFloat(root.querySelector('#budgetTotal').value)||0;
    const raw = root.querySelector('#budgetWeights').value;
    const pairs = raw.split(',').map(s=>s.trim()).filter(Boolean).map(s=>{
      const [name, w] = s.split('=');
      return { name:(name||'Канал').trim(), w: parseFloat(w)||0 };
    });
    if (!pairs.length){ root.querySelector('#splitResult').innerHTML = '<span style="color:var(--coral)">Укажите каналы в формате Имя=вес</span>'; return; }
    const values = calc.splitBudget(total, pairs.map(p=>p.w));
    root.querySelector('#splitResult').innerHTML = `<table class="data-table"><tr><th>Канал</th><th>Бюджет</th></tr>${pairs.map((p,i)=>`<tr><td>${p.name}</td><td>${calc.fmtMoney(values[i])}</td></tr>`).join('')}</table>`;
  });
}
