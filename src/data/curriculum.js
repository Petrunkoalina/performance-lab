import m0 from './modules/m0.js';
import m1 from './modules/m1.js';
import m2 from './modules/m2.js';
import m3 from './modules/m3.js';
import m4 from './modules/m4.js';
import m5 from './modules/m5.js';
import m6 from './modules/m6.js';
import m7 from './modules/m7.js';
import m8 from './modules/m8.js';
import m8b from './modules/m8b.js';
import m9 from './modules/m9.js';
import m10 from './modules/m10.js';
import m11 from './modules/m11.js';
import m12 from './modules/m12.js';
import m13 from './modules/m13.js';
import m14 from './modules/m14.js';
import m15 from './modules/m15.js';
import m16 from './modules/m16.js';
import m17 from './modules/m17.js';
import m18 from './modules/m18.js';
import m19 from './modules/m19.js';
import m20 from './modules/m20.js';
import m21 from './modules/m21.js';
import m22 from './modules/m22.js';

export const MODULES = [m0,m1,m2,m3,m4,m5,m6,m7,m8,m8b,m9,m10,m11,m12,m13,m14,m15,m16,m17,m18,m19,m20,m21,m22];

export const CATEGORY_LABEL = {
  chatgpt:'ChatGPT Ads', ppc:'PPC / Google / Amazon Ads', meta:'Meta Ads', analytics:'Analytics', career:'Career',
};
export const CATEGORY_TAG_CLASS = {
  chatgpt:'tag-chatgpt', ppc:'tag-ppc', meta:'tag-meta', analytics:'tag-analytics', career:'tag-career',
};

export function allLessons(){
  const out = [];
  for (const m of MODULES) for (const l of m.lessons) out.push({...l, moduleId:m.id, moduleTitle:m.title, category:m.category});
  return out;
}

export function getModule(id){ return MODULES.find(m=>m.id===id); }

export function getLesson(id){
  for (const m of MODULES){
    const l = m.lessons.find(x=>x.id===id);
    if (l) return { ...l, moduleId:m.id, moduleTitle:m.title, category:m.category };
  }
  return null;
}

export function nextLessonAfter(id){
  const flat = allLessons();
  const idx = flat.findIndex(l=>l.id===id);
  if (idx===-1 || idx===flat.length-1) return null;
  return flat[idx+1];
}

export function firstIncompleteLesson(completedMap){
  const flat = allLessons();
  return flat.find(l => !completedMap[l.id]) || flat[flat.length-1];
}

export function totalLessonCount(){ return allLessons().length; }

export function moduleProgress(moduleId, completedMap){
  const m = getModule(moduleId);
  if (!m) return {done:0,total:0,pct:0};
  const total = m.lessons.length;
  const done = m.lessons.filter(l=>completedMap[l.id]).length;
  return { done, total, pct: total? Math.round(done/total*100):0 };
}

export function categoryProgress(category, completedMap){
  const lessons = allLessons().filter(l=>l.category===category);
  const done = lessons.filter(l=>completedMap[l.id]).length;
  return { done, total: lessons.length, pct: lessons.length? Math.round(done/lessons.length*100):0 };
}

export function searchLessons(query){
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allLessons().filter(l =>
    l.title.toLowerCase().includes(q) ||
    (l.intro||'').toLowerCase().includes(q) ||
    (l.terms||[]).some(t=>t.term.toLowerCase().includes(q) || (t.en||'').toLowerCase().includes(q))
  ).slice(0,20);
}

export function allTerms(){
  const out = [];
  for (const l of allLessons()) for (const t of (l.terms||[])) out.push({...t, lessonId:l.id, lessonTitle:l.title, category:l.category});
  return out;
}
