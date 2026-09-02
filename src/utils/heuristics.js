// Lightweight rule-based scoring used across ChatGPT Ads Lab, Context Hint Lab and Ad Builder.
// This is NOT a real AI model — it is a transparent, explainable heuristic that mirrors the
// official quality criteria from help.openai.com (word count, specificity signals, banned patterns).
// Course-level teaching tool only; real Ads Manager relevance scoring is not disclosed publicly.

const SENSITIVE_WORDS = ['самоповрежд','суицид','наркотик','оружие','азартн','казино','ставки на','порно','эротик','алкогол','сигарет','вейп','политич','выборы','экстремизм'];
const VAGUE_WORDS = ['лучший','топ','купить сейчас','акция','скидка!!!','гарантированно','быстро разбогатеть'];

function wordCount(s){ return (s||'').trim().split(/\s+/).filter(Boolean).length; }

export function scoreContextHint(hint){
  const text = (hint||'').trim();
  const wc = wordCount(text);
  const lower = text.toLowerCase();
  const notes = [];
  let clarity=0, specificity=0, relevance=0, naturalLanguage=0, breadth=0, sensitivity=0;

  // clarity: reasonable sentence length, not just 1-2 words
  if (wc >= 6) { clarity = 90; } else if (wc>=3){ clarity=60; notes.push('Слишком короткая формулировка — добавьте деталей.'); } else { clarity=20; notes.push('Это скорее одно слово/ярлык, а не описание ситуации.'); }

  // specificity: presence of concrete nouns/situation words, penalise generic single category words
  const genericSingle = wc<=2;
  specificity = genericSingle ? 25 : Math.min(95, 40 + wc*4);
  if (genericSingle) notes.push('Слишком общая тема — уточните, кому и когда это полезно.');

  // relevance/commercial intent: presence of situational connector words
  const situational = /(когда|для|кто|нужн|ищет|хочет|готов|сравнива|выбира|перед|после)/i.test(text);
  relevance = situational ? 85 : 45;
  if (!situational) notes.push('Добавьте ситуацию: когда/для кого это актуально.');

  // natural language vs keyword list (commas without connecting words = list of keywords)
  const commaCount = (text.match(/,/g)||[]).length;
  const looksLikeList = commaCount>=2 && !situational;
  naturalLanguage = looksLikeList ? 30 : 88;
  if (looksLikeList) notes.push('Похоже на список ключевых слов через запятую — перепишите как связную фразу.');

  // breadth: too broad if very short and no qualifiers; too narrow flagged only softly
  breadth = genericSingle ? 30 : (wc>18 ? 70 : 85);
  if (wc>18) notes.push('Формулировка длинная — попробуйте сузить до одной мысли.');

  // sensitivity risk
  const hasSensitive = SENSITIVE_WORDS.some(w=>lower.includes(w));
  sensitivity = hasSensitive ? 15 : 95;
  if (hasSensitive) notes.push('Тема может попадать под sensitive/restricted категории Ads Policies — пересмотрите формулировку.');

  const overall = Math.round((clarity+specificity+relevance+naturalLanguage+breadth+sensitivity)/6);
  return { overall, clarity, specificity, relevance, naturalLanguage, breadth, sensitivity, notes, wordCount: wc };
}

export function scoreAdCopy({ title, copy, landingPage }){
  const notes = [];
  const tWc = wordCount(title), cWc = wordCount(copy);
  let benefitFocus=50, specificity=50, policyRisk=95, landingMatch=50, readability=70;

  const benefitWords = /(помога|позволя|для тех|экономит|снижа|увеличива|бесплатн|за \d|дн|недел|без)/i.test((title+' '+copy).toLowerCase());
  benefitFocus = benefitWords ? 85 : 45;
  if (!benefitFocus>0 && !benefitWords) notes.push('Добавьте конкретную пользу (что получит пользователь и когда).');

  const hasNumber = /\d/.test(title+copy);
  specificity = hasNumber ? 80 : 50;
  if (!hasNumber) notes.push('Конкретные цифры/сроки/детали обычно повышают релевантность.');

  const vague = VAGUE_WORDS.some(w=>(title+' '+copy).toLowerCase().includes(w));
  policyRisk = vague ? 40 : 95;
  if (vague) notes.push('Формулировка похожа на кликбейт/преувеличение — смягчите тон.');

  landingMatch = landingPage && landingPage.trim().length>4 ? 80 : 30;
  if (!landingMatch>0 && (!landingPage || landingPage.trim().length<=4)) notes.push('Укажите конкретную страницу назначения, а не общий домен.');

  if (tWc>0 && tWc<=8) readability = 90; else if (tWc>8) { readability=55; notes.push('Заголовок длинноват — короче обычно читается лучше.'); }

  const overall = Math.round((benefitFocus+specificity+policyRisk+landingMatch+readability)/5);
  return { overall, benefitFocus, specificity, policyRisk, landingMatch, readability, notes };
}

export function scoreLabel(v){
  if (v>=80) return {label:'Сильно', cls:'tag-completed'};
  if (v>=55) return {label:'Средне', cls:'tag-warning'};
  return {label:'Слабо', cls:'tag-error'};
}
