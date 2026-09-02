// Turns dense lesson prose into readable blocks: paragraphs stay paragraphs,
// but runs of "Термин — определение." sentences (a pattern used heavily across
// the curriculum text) become bullet lists instead of a wall of text.

function splitSentences(paragraph){
  return paragraph
    .split(/(?<=[.!?])\s+(?=[А-ЯA-ZЁ0-9])/)
    .map(s => s.trim())
    .filter(Boolean);
}

function matchBullet(sentence){
  // "Term (optional en) — definition..." — term capped at 70 chars to avoid
  // accidentally treating a long descriptive sentence with a stray dash as a bullet.
  const m = sentence.match(/^([^—]{2,70}?)\s+—\s+(.+)$/s);
  return m ? { term: m[1].trim(), rest: m[2].trim() } : null;
}

function escapeAlreadyHtml(s){ return s; } // content is authored HTML-safe plain text

function paragraphToHtml(paragraph){
  const sentences = splitSentences(paragraph);
  const bullets = sentences.map(matchBullet);
  const bulletCount = bullets.filter(Boolean).length;

  if (bulletCount < 2){
    return `<p>${escapeAlreadyHtml(paragraph)}</p>`;
  }

  // Walk the sentences, grouping consecutive bullet-sentences into <ul> blocks
  // and consecutive plain sentences into <p> blocks, preserving reading order.
  let html = '';
  let textBuf = [];
  let bulletBuf = [];

  const flushText = () => {
    if (textBuf.length){ html += `<p>${textBuf.join(' ')}</p>`; textBuf = []; }
  };
  const flushBullets = () => {
    if (bulletBuf.length){ html += `<ul class="lesson-bullets">${bulletBuf.join('')}</ul>`; bulletBuf = []; }
  };

  sentences.forEach((s, i) => {
    const b = bullets[i];
    if (b){
      flushText();
      bulletBuf.push(`<li><b>${b.term}</b> — ${b.rest}</li>`);
    } else {
      flushBullets();
      textBuf.push(s);
    }
  });
  flushText();
  flushBullets();
  return html;
}

export function formatExplanation(text){
  if (!text) return '';
  return text.split('\n\n').map(paragraphToHtml).join('');
}
