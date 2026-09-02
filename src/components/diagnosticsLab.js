import { getState, setState } from '../utils/storage.js';

const SCENARIOS = [
  { id:'d1', title:'Показы есть, кликов почти нет', symptom:'Impressions: 40 000, Clicks: 38, CTR: 0,09%. Бюджет расходуется полностью.',
    causes:['Объявление нерелевантно context hints/аудитории','Слабый, неконкретный текст объявления (не benefit-focused)','Изображение не согласовано с текстом','Слишком широкая ad group без фокуса'],
    checkFirst:'Проверить текст и релевантность объявления context hints ad group', risk:'Пауза кампании остановит и без того редкие данные для анализа' },
  { id:'d2', title:'CTR высокий, конверсий нет', symptom:'CTR: 4,2%, Clicks: 210, Conversions: 0 за неделю.',
    causes:['Message mismatch между объявлением и лендингом','Технические проблемы на странице/форме','Слишком дорогой оффер относительно ожиданий из объявления','Проблема трекинга конверсий (события не фиксируются)'],
    checkFirst:'Сначала проверить, фиксируются ли конверсии технически (debug tracking)', risk:'Изменение объявления вместо проверки трекинга может скрыть настоящую причину' },
  { id:'d3', title:'Мало показов относительно бюджета', symptom:'Daily budget €50, но расходуется только €8/день, показов почти нет.',
    causes:['Слишком низкий Maximum bid','Слишком узкие/специфичные context hints','Аккаунт не полностью верифицирован','Ограничения по гео/платформам'],
    checkFirst:'Проверить bid-strength guidance и статус верификации/billing', risk:'Резкое повышение ставки без диагностики может привести к перерасходу без понимания причины' },
  { id:'d4', title:'Бюджет почти не расходуется', symptom:'За 3 дня потрачено 5% от дневного бюджета.',
    causes:['Кампания/объявления не прошли review','Слишком узкая аудитория/context hints','Низкий Maximum bid','Проблема с billing (payment method)'],
    checkFirst:'Проверить serving-статус и статус review объявлений', risk:'Игнорирование billing-проблемы приведёт к полной остановке показа позже' },
  { id:'d5', title:'CPC заметно выше ожидаемого', symptom:'Ожидали CPC ~€4, фактический CPC — €9.',
    causes:['Выросла конкуренция в нише/сезонность','Низкая релевантность объявления/hints','Слишком узкая ad group с высокой конкуренцией за показ','Ставка выставлена без учёта bid-strength guidance'],
    checkFirst:'Сравнить bid-strength guidance и context hints с результатами конкурентов по нише', risk:'Механическое повышение бюджета не решит проблему высокого CPC' },
  { id:'d6', title:'CPA выше допустимого', symptom:'Допустимый CPA — €25, фактический — €41.',
    causes:['Слишком широкие/нерелевантные context hints дают некачественный трафик','Landing page с высоким trением (friction)','oCPC ещё не накопил достаточно данных (learning phase)','Неверно рассчитан допустимый CPA (не учтена реальная маржа)'],
    checkFirst:'Пересчитать допустимый CPA по актуальной марже и проверить объём накопленных данных', risk:'Остановка кампании при малом объёме данных лишает возможности оценить реальный потенциал' },
  { id:'d7', title:'Высокий ROAS при небольшом объёме', symptom:'ROAS 6.0, но всего 4 конверсии за 2 недели.',
    causes:['Слишком маленький бюджет/выборка для выводов (statistical uncertainty)','Ad group слишком узкая, чтобы масштабироваться','Case выглядит хорошо случайно, а не системно'],
    checkFirst:'Проверить объём данных перед выводами и попробовать умеренно увеличить бюджет', risk:'Резкое масштабирование на основе 4 конверсий может дать нестабильный результат' },
  { id:'d8', title:'Хорошие лиды, но плохие продажи', symptom:'CPL в норме, лиды приходят, но отдел продаж закрывает всего 3%.',
    causes:['Лиды нерелевантны (проблема на стороне hints/оффера)','Проблема в процессе продаж, а не в рекламе','Ожидания, заданные рекламой, не совпадают с реальным предложением'],
    checkFirst:'Сверить содержание объявления/лендинга с тем, что реально предлагает отдел продаж', risk:'Оптимизация рекламы вместо проверки соответствия оффера не решит проблему' },
  { id:'d9', title:'Одна ad group забирает весь бюджет', symptom:'Из 4 ad groups одна расходует 90% бюджета кампании.',
    causes:['Более широкие/конкурентоспособные context hints в этой группе','Остальные группы имеют слишком низкий bid/слишком узкие hints','Технически бюджет кампании не разделён по группам вручную'],
    checkFirst:'Проверить bid-strength и охват context hints во всех группах, а не только в "проблемной"', risk:'Отключение доминирующей группы без анализа может резко снизить общий объём результатов' },
  { id:'d10', title:'Результаты ухудшились после изменений', symptom:'После правки context hints и ставки 3 дня назад CTR упал вдвое.',
    causes:['Слишком много изменений одновременно (нарушен controlled testing)','Кампания вошла в новую фазу обучения после изменений','Новые hints менее релевантны, чем старые'],
    checkFirst:'Проверить change log: что именно было изменено и когда', risk:'Откат сразу всех изменений без анализа не даёт понять, какое из них было проблемным' },
  { id:'d11', title:'Данные Ads Manager и GA4 не совпадают', symptom:'Ads Manager: 40 конверсий, GA4: 27 конверсий за тот же период.',
    causes:['Разные окна атрибуции/модели атрибуции','Consent/cookie-ограничения искажают данные GA4','UTM-метки настроены некорректно или не на всех креативах'],
    checkFirst:'Проверить UTM-разметку и модель атрибуции в обеих системах', risk:'Слепое доверие только одной системе может привести к неверным решениям по бюджету' },
  { id:'d12', title:'Конверсии фиксируются дважды', symptom:'Резкий скачок конверсий без роста трафика или бюджета.',
    causes:['Double counting на thank-you странице (например, при обновлении/шаринге)','Дублирующийся тег/пиксель на странице','Тестовые события попадают в боевую статистику'],
    checkFirst:'Включить debug-режим аналитики и вручную пройти путь конверсии', risk:'Отчёт клиенту с задвоенными данными подрывает доверие при обнаружении ошибки' },
  { id:'d13', title:'Кампания эффективна, но не масштабируется', symptom:'Стабильный ROAS 4.5 при бюджете €50/день; при попытке поднять до €150/день ROAS падает до 2.',
    causes:['Слишком резкое увеличение бюджета (нарушено правило 20-30%)','Ad groups/hints исчерпали релевантную аудиторию на этом объёме','Рынок/ниша имеет естественный потолок по объёму спроса'],
    checkFirst:'Вернуть бюджет ближе к стабильному уровню и масштабировать шагами по 20-30%', risk:'Продолжение агрессивного масштабирования при падении ROAS увеличивает убыток' },
];

function saved(){ return getState().projects.diagnostics || {}; }

export function render(){
  const s = saved();
  return `
    <h1 style="margin-bottom:6px">Campaign Diagnostics Lab</h1>
    <p class="section-sub">13 реалистичных сценариев ChatGPT Ads. Для каждого: определите проблему, причины, что проверить первым, изменение и риск.</p>
    <div id="scenarioWrap">${SCENARIOS.map(sc=>renderScenario(sc, s[sc.id])).join('')}</div>
  `;
}

function renderScenario(sc, saved){
  const chosenCauses = saved?.causes || [];
  const chosenCheck = saved?.checkFirst;
  const change = saved?.change || '';
  const risk = saved?.riskAwareness || '';
  const nextCheck = saved?.nextCheck || '';
  const submitted = !!saved?.submitted;
  return `<div class="card" style="margin-bottom:16px" data-scenario="${sc.id}">
    <h3 style="margin-bottom:4px">${sc.title}</h3>
    <p class="section-sub">${sc.symptom}</p>

    <label class="field-label">1. Возможные причины (выберите все подходящие)</label>
    <div style="margin-bottom:12px">${sc.causes.map((c,i)=>`<label style="display:block;padding:4px 0"><input type="checkbox" data-cause="${i}" ${chosenCauses.includes(i)?'checked':''}> ${c}</label>`).join('')}</div>

    <label class="field-label">2. Что проверить первым?</label>
    <select class="input" data-checkfirst style="margin-bottom:12px">
      <option value="">— выберите —</option>
      ${sc.causes.map((c,i)=>`<option value="${i}" ${String(chosenCheck)===String(i)?'selected':''}>${c}</option>`).join('')}
    </select>

    <label class="field-label">3. Предлагаемое изменение</label>
    <textarea class="input" data-change rows="2" style="margin-bottom:12px">${change}</textarea>

    <label class="field-label">4. Риск этого изменения</label>
    <textarea class="input" data-risk rows="2" style="margin-bottom:12px">${risk}</textarea>

    <label class="field-label">5. Когда проверить результат в следующий раз?</label>
    <input class="input" data-nextcheck value="${nextCheck}" placeholder="Например: через 5 дней / после 30 конверсий" style="margin-bottom:12px">

    <button class="btn secondary sm" data-submit>${submitted?'Обновить ответ':'Сохранить ответ'}</button>
    ${submitted ? `<div class="callout term" style="margin-top:12px"><b>Ориентир курса:</b> ${sc.checkFirst}. Риск: ${sc.risk}</div>` : ''}
  </div>`;
}

export function mount(root){
  root.querySelectorAll('[data-scenario]').forEach(card=>{
    const id = card.dataset.scenario;
    card.querySelector('[data-submit]').addEventListener('click', ()=>{
      const causes = [...card.querySelectorAll('[data-cause]:checked')].map(c=>Number(c.dataset.cause));
      const checkFirst = card.querySelector('[data-checkfirst]').value;
      const change = card.querySelector('[data-change]').value;
      const riskAwareness = card.querySelector('[data-risk]').value;
      const nextCheck = card.querySelector('[data-nextcheck]').value;
      setState(s=>{
        s.projects.diagnostics = s.projects.diagnostics||{};
        s.projects.diagnostics[id] = { causes, checkFirst, change, riskAwareness, nextCheck, submitted:true };
      });
      root.innerHTML = render();
      mount(root);
    });
  });
}
