// Persistent state layer. Everything lives in localStorage under one namespaced key,
// structured so a future backend could replace get()/save() without touching callers.

const KEY = 'performanceLab.v1';

function defaultState(){
  return {
    onboarded:false,
    profile:{
      name:'', level:'', hasAdAccounts:false, knowsGoogleAds:false, knowsMetaAds:false,
      knowsMetrics:false, hasAnalytics:false, hoursPerWeek:5, startTimeline:'', niche:'', goal:''
    },
    placementScore:null, // {score, level, weakAreas:[]}
    progress:{
      completedLessons:{}, // lessonId -> {completedAt, quizScore}
      lastLessonId:null,
      hoursLogged:0,
      streak:0,
      lastActiveDate:null,
      activityLog:{}, // 'YYYY-MM-DD' -> minutes
    },
    scores:{ chatgptAds:0, ppc:0, analytics:0, strategy:0, clientComm:0 },
    weakTopics:[],
    reviewQueue:[],
    notes:[], // {id,title,body,tag,createdAt}
    projects:{}, // projectId -> arbitrary form data
    savedCampaigns:{ chatgpt:[], google:[] },
    chatgptAccount:{
      businessName:'', website:'', country:'', currency:'EUR', timezone:'',
      verification:'not_started', // not_started -> pending -> verified
      accountInfoComplete:false,
      billingProfile:null, paymentMethod:null,
      users:[], changeLog:[], conversionEvents:['Purchase','Lead'],
    },
    googleAccount:{ keywords:[], negativeKeywords:[], adGroups:[], budget:0, biddingStrategy:'Maximize Clicks', launched:false },
    achievements:[],
    examResult:null,
  };
}

function migrate(state){
  const d = defaultState();
  return deepMerge(d, state || {});
}

function deepMerge(base, override){
  if (Array.isArray(base)) return override !== undefined ? override : base;
  if (typeof base === 'object' && base !== null){
    const out = {...base};
    for (const k in override){
      out[k] = (typeof base[k] === 'object' && base[k] !== null && !Array.isArray(base[k]))
        ? deepMerge(base[k], override[k])
        : override[k];
    }
    return out;
  }
  return override !== undefined ? override : base;
}

let cache = null;

export function getState(){
  if (cache) return cache;
  try{
    const raw = localStorage.getItem(KEY);
    cache = migrate(raw ? JSON.parse(raw) : null);
  }catch(e){
    console.warn('Storage read failed, resetting', e);
    cache = defaultState();
  }
  return cache;
}

export function setState(mutator){
  const s = getState();
  mutator(s);
  try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){ console.warn('Storage write failed', e); }
  return s;
}

export function resetState(){
  cache = defaultState();
  localStorage.setItem(KEY, JSON.stringify(cache));
}

const todayStr = () => new Date().toISOString().slice(0,10);

export function touchStreak(){
  setState(s=>{
    const today = todayStr();
    if (s.progress.lastActiveDate === today) return;
    const y = new Date(); y.setDate(y.getDate()-1);
    const yesterday = y.toISOString().slice(0,10);
    if (s.progress.lastActiveDate === yesterday) s.progress.streak += 1;
    else if (s.progress.lastActiveDate !== today) s.progress.streak = 1;
    s.progress.lastActiveDate = today;
  });
}

export function logMinutes(min){
  setState(s=>{
    const today = todayStr();
    s.progress.activityLog[today] = (s.progress.activityLog[today]||0) + min;
    s.progress.hoursLogged = Math.round(((s.progress.hoursLogged*60)+min))/60;
  });
}

export function markLessonComplete(lessonId, quizScore){
  touchStreak();
  setState(s=>{
    s.progress.completedLessons[lessonId] = { completedAt: Date.now(), quizScore: quizScore ?? null };
    s.progress.lastLessonId = lessonId;
  });
}

export function isLessonComplete(lessonId){
  return !!getState().progress.completedLessons[lessonId];
}

export function addNote(note){
  setState(s=>{ s.notes.unshift({ id:'n'+Date.now(), createdAt:Date.now(), ...note }); });
}
export function deleteNote(id){
  setState(s=>{ s.notes = s.notes.filter(n=>n.id!==id); });
}

export function saveProject(id, data){
  setState(s=>{ s.projects[id] = { ...(s.projects[id]||{}), ...data, updatedAt: Date.now() }; });
}

export function addWeakTopic(topic){
  setState(s=>{
    if (!s.weakTopics.includes(topic)) s.weakTopics.push(topic);
    if (s.weakTopics.length > 12) s.weakTopics.shift();
  });
}
export function clearWeakTopic(topic){
  setState(s=>{ s.weakTopics = s.weakTopics.filter(t=>t!==topic); });
}

export function logChange(text){
  setState(s=>{
    s.chatgptAccount.changeLog.unshift({ ts:Date.now(), text });
    if (s.chatgptAccount.changeLog.length>200) s.chatgptAccount.changeLog.pop();
  });
}

export function unlockAchievement(id, label){
  setState(s=>{
    if (!s.achievements.find(a=>a.id===id)) s.achievements.push({id,label,at:Date.now()});
  });
}
