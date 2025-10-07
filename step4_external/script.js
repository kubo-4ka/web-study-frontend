const $ = (s, r = document) => r.querySelector(s);

// --- ドロワー ---
const menuBtn = $('#menuBtn');
const drawer = $('#sideNav');
function setDrawer(open) {
  drawer.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
}
menuBtn.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
drawer.addEventListener('click', e => { if (e.target.tagName === 'A') setDrawer(false); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') setDrawer(false); });

// --- 天気API（Open-Meteo） ---
const weatherBtn = $('#weatherBtn');
const forecastEl = $('#forecast');
const TOKYO = { lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' };

function wxEmoji(code) {
  if ([0].includes(code)) return '☀️';
  if ([1, 2, 3].includes(code)) return '🌤️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 61, 63, 65].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
  if ([80, 81, 82].includes(code)) return '🌦️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌡️';
}
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function loadWeather() {
  forecastEl.setAttribute('aria-busy', 'true');
  forecastEl.innerHTML = '';
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(TOKYO.lat));
  url.searchParams.set('longitude', String(TOKYO.lon));
  url.searchParams.set('timezone', TOKYO.tz);
  url.searchParams.set('daily', 'weathercode,temperature_2m_max,temperature_2m_min');
  url.searchParams.set('forecast_days', '7');

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const days = data.daily?.time || [];
    const wcode = data.daily?.weathercode || [];
    const tmax = data.daily?.temperature_2m_max || [];
    const tmin = data.daily?.temperature_2m_min || [];

    const frag = document.createDocumentFragment();
    for (let i = 0; i < days.length; i++) {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h3>${wxEmoji(Number(wcode[i]))} ${esc(days[i])}</h3>
        <p class="muted">最高: ${esc(tmax[i])}°C / 最低: ${esc(tmin[i])}°C</p>
      `;
      frag.appendChild(card);
    }
    forecastEl.appendChild(frag);
  } catch (err) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<h3>取得に失敗しました</h3><p class="muted small">${esc(err)}</p>`;
    forecastEl.appendChild(card);
  } finally {
    forecastEl.setAttribute('aria-busy', 'false');
  }
}
weatherBtn.addEventListener('click', () => { loadWeather(); weatherBtn.blur(); });

// --- このサイトについて（dialog） ---
const aboutDialog = $('#aboutDialog');
const backdrop = $('#backdrop');
const aboutLink = $('#aboutLink');
const aboutLinkFooter = $('#aboutLinkFooter');

function openAbout() { aboutDialog.showModal(); backdrop.hidden = false; }
function closeAbout() { aboutDialog.close(); backdrop.hidden = true; }

// aboutLink.addEventListener('click', (e) => { e.preventDefault(); openAbout(); });
if (aboutLinkFooter) {
  aboutLinkFooter.addEventListener('click', (e) => { e.preventDefault(); openAbout(); });
}
aboutDialog.addEventListener('close', () => { backdrop.hidden = true; });
backdrop.addEventListener('click', closeAbout);
