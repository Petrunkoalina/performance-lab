import { getState, addNote, deleteNote } from '../utils/storage.js';

export function render(){
  const notes = getState().notes;
  return `
    <h1 style="margin-bottom:6px">Notes</h1>
    <p class="section-sub">Свои заметки и сохранённые ответы на практические задания из уроков.</p>

    <div class="card" style="margin-bottom:20px">
      <input class="input" id="noteTitle" placeholder="Заголовок заметки" style="margin-bottom:10px">
      <textarea class="input" id="noteBody" rows="3" placeholder="Текст заметки…" style="margin-bottom:10px"></textarea>
      <button class="btn secondary sm" id="addNoteBtn">Сохранить заметку</button>
    </div>

    ${!notes.length ? `<p style="color:var(--text-soft)">Заметок пока нет.</p>` :
      notes.map(n=>`<div class="card-sm card" style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <b>${n.title||'Без названия'}</b> ${n.tag==='task'?'<span class="pill" style="font-size:10px;margin-left:6px">Задание</span>':''}
            <p style="font-size:13.5px;margin-top:6px;white-space:pre-wrap">${n.body}</p>
            <div style="font-size:11px;color:var(--text-soft);margin-top:6px">${new Date(n.createdAt).toLocaleString('ru-RU')}</div>
          </div>
          <button class="btn secondary sm" data-del="${n.id}">✕</button>
        </div>
      </div>`).join('')}
  `;
}

export function mount(root){
  root.querySelector('#addNoteBtn').addEventListener('click', ()=>{
    const title = root.querySelector('#noteTitle').value.trim();
    const body = root.querySelector('#noteBody').value.trim();
    if (!body) return;
    addNote({ title, body, tag:'manual' });
    root.innerHTML = render(); mount(root);
  });
  root.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click', ()=>{
    deleteNote(b.dataset.del);
    root.innerHTML = render(); mount(root);
  }));
}
