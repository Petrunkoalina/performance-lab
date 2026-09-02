// Minimal linear icon set (24x24 viewBox), stroke=currentColor.
const wrap = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const icons = {
  dashboard: wrap('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
  path: wrap('<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H9a4 4 0 0 0-4 4h0"/>'),
  chatgpt: wrap('<path d="M12 3a4 4 0 0 0-4 4v1a4 4 0 0 0-2 7l-.5 3 3-1a4 4 0 0 0 3.5 2 4 4 0 0 0 4-4v-1a4 4 0 0 0 2-7l.5-3-3 1A4 4 0 0 0 12 3z"/>'),
  ppc: wrap('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/>'),
  analytics: wrap('<path d="M4 20V10M11 20V4M18 20v-7"/>'),
  projects: wrap('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
  glossary: wrap('<path d="M5 4h11a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2z"/>'),
  notes: wrap('<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h4"/>'),
  tutor: wrap('<circle cx="12" cy="8" r="3.2"/><path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5"/>'),
  settings: wrap('<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  search: wrap('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
  check: wrap('<path d="M20 6 9 17l-5-5"/>'),
  arrowRight: wrap('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowLeft: wrap('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
  flame: wrap('<path d="M12 2s5 4.5 5 9.5a5 5 0 0 1-10 0C7 8 9 6 9 6s.5 2 1.5 2C12 8 11 4 12 2z"/>'),
  clock: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>'),
  target: wrap('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/>'),
  trophy: wrap('<path d="M8 4h8v4a4 4 0 0 1-8 0V4z"/><path d="M8 4H5a3 3 0 0 0 3 5M16 4h3a3 3 0 0 1-3 5"/><path d="M12 13v3m-3 4h6m-3 0v-4"/>'),
  close: wrap('<path d="M6 6l12 12M18 6 6 18"/>'),
  plus: wrap('<path d="M12 5v14M5 12h14"/>'),
  trash: wrap('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
  download: wrap('<path d="M12 3v12m0 0 5-5m-5 5-5-5M4 21h16"/>'),
  filter: wrap('<path d="M4 5h16M7 12h10M10 19h4"/>'),
  bulb: wrap('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1 2.2h5.2c0-.9.4-1.7 1-2.2A6 6 0 0 0 12 3z"/>'),
  bolt: wrap('<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>'),
  book: wrap('<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>'),
};
export const icon = (name, cls='', size=18) => `<span class="${cls}" style="display:inline-flex;width:${size}px;height:${size}px;flex-shrink:0;vertical-align:middle">${icons[name]||''}</span>`;
