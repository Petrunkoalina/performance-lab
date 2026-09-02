import { getState, setState } from '../utils/storage.js';
import { scoreAdCopy, scoreLabel } from '../utils/heuristics.js';

function ads(){ return getState().projects.adBuilderAds || []; }

function preview(a){
  return `<div style="border:1px solid var(--outline);border-radius:12px;padding:14px;background:var(--surface)">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <div style="width:20px;height:20px;border-radius:5px;background:var(--outline)"></div>
      <span style="font-size:12px;color:var(--text-soft)">${a.advertiser||'Advertiser'} · Sponsored</span>
    </div>
    <div style="display:flex;gap:12px">
      <div style="width:64px;height:64px;border-radius:10px;background:var(--lavender);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-soft);text-align:center;padding:4px">${a.image||'image'}</div>
      <div>
        <div style="font-weight:700;font-size:14px">${a.title||'Заголовок объявления'}</div>
        <div style="font-size:13px;color:var(--text-soft);margin-top:2px">${a.copy||'Описание объявления появится здесь'}</div>
        <div style="font-size:11px;color:var(--mint-d);margin-top:4px">${a.landingPage||'example.com'}</div>
      </div>
    </div>
  </div>`;
}

export function render(){
  return `
    <h1 style="margin-bottom:6px">Ad Builder</h1>
    <p class="section-sub">Напишите объявление и посмотрите preview + оценку по официальным критериям (benefit-focused copy, специфичность, соответствие лендингу, policy risk).</p>
    <div class="grid grid-2">
      <div class="card">
        <label class="field-label">Advertiser name</label><input class="input" id="ab_adv" style="margin-bottom:10px">
        <label class="field-label">Title</label><input class="input" id="ab_title" maxlength="60" style="margin-bottom:10px">
        <div id="titleCount" style="font-size:11px;color:var(--text-soft);margin-bottom:10px">0/60</div>
        <label class="field-label">Copy</label><textarea class="input" id="ab_copy" rows="3" maxlength="150" style="margin-bottom:4px"></textarea>
        <div id="copyCount" style="font-size:11px;color:var(--text-soft);margin-bottom:10px">0/150</div>
        <label class="field-label">Landing page URL</label><input class="input" id="ab_landing" style="margin-bottom:10px">
        <label class="field-label">Image (описание креатива)</label><input class="input" id="ab_image" style="margin-bottom:14px">
        <button class="btn" id="ab_addBtn">Оценить и сохранить</button>
      </div>
      <div>
        <h4 style="margin-bottom:10px">Live preview</h4>
        <div id="livePreview">${preview({})}</div>
        <div id="liveScore" style="margin-top:14px"></div>
      </div>
    </div>

    <h3 class="section-title" style="margin-top:28px">Ваши объявления (${ads().length})</h3>
    <div id="adList">${renderList()}</div>
  `;
}

function renderList(){
  const list = ads();
  if (!list.length) return `<p style="color:var(--text-soft)">Пока нет сохранённых объявлений.</p>`;
  return `<div class="grid grid-2">${list.map((a,i)=>{
    const sc = scoreAdCopy(a); const lbl = scoreLabel(sc.overall);
    return `<div class="card-sm card">
      ${preview(a)}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
        <span class="pill ${lbl.cls}">${sc.overall}/100</span>
        <button class="btn secondary sm" data-del="${i}">Удалить</button>
      </div>
      ${sc.notes.length?`<ul style="padding-left:18px;font-size:12px;color:var(--text-soft);margin-top:8px">${sc.notes.map(n=>`<li>${n}</li>`).join('')}</ul>`:''}
    </div>`;
  }).join('')}</div>`;
}

export function mount(root){
  const fields = ['ab_adv','ab_title','ab_copy','ab_landing','ab_image'];
  function currentAd(){
    return { advertiser: root.querySelector('#ab_adv').value, title: root.querySelector('#ab_title').value, copy: root.querySelector('#ab_copy').value, landingPage: root.querySelector('#ab_landing').value, image: root.querySelector('#ab_image').value };
  }
  function refreshLive(){
    const a = currentAd();
    root.querySelector('#livePreview').innerHTML = preview(a);
    root.querySelector('#titleCount').textContent = `${a.title.length}/60`;
    root.querySelector('#copyCount').textContent = `${a.copy.length}/150`;
    if (a.title || a.copy){
      const sc = scoreAdCopy(a); const lbl = scoreLabel(sc.overall);
      root.querySelector('#liveScore').innerHTML = `<div class="card-sm card"><span class="pill ${lbl.cls}">${sc.overall}/100</span> ${sc.notes.length?`<ul style="padding-left:18px;font-size:12px;color:var(--text-soft);margin-top:8px">${sc.notes.map(n=>`<li>${n}</li>`).join('')}</ul>`:'<div style="font-size:12px;color:var(--mint-d);margin-top:6px">Хороший вариант по основным критериям.</div>'}</div>`;
    } else root.querySelector('#liveScore').innerHTML='';
  }
  fields.forEach(f=>root.querySelector('#'+f).addEventListener('input', refreshLive));

  root.querySelector('#ab_addBtn').addEventListener('click', ()=>{
    const a = currentAd();
    if (!a.title.trim()) { alert('Добавьте хотя бы заголовок'); return; }
    setState(s=>{ s.projects.adBuilderAds = [...(s.projects.adBuilderAds||[]), a]; });
    fields.forEach(f=>root.querySelector('#'+f).value='');
    refreshLive();
    root.querySelector('#adList').innerHTML = renderList();
    bindDel();
  });
  bindDel();
  function bindDel(){
    root.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click', ()=>{
      setState(s=>{ s.projects.adBuilderAds.splice(Number(b.dataset.del),1); });
      root.querySelector('#adList').innerHTML = renderList();
      bindDel();
    }));
  }
}
