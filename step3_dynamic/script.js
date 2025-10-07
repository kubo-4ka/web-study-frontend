const $ = (s, r=document) => r.querySelector(s);

// ドロワー
const menuBtn = $('#menuBtn');
const drawer  = $('#sideNav');
function setDrawer(open){
  drawer.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
}
menuBtn.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
drawer.addEventListener('click', e => { if(e.target.tagName === 'A') setDrawer(false); });
window.addEventListener('keydown', e => { if(e.key === 'Escape') setDrawer(false); });

// アクセント色変更（CSS変数）
const accentBtn = $('#accentBtn');
accentBtn.addEventListener('click', () => {
  const palette = ['#3b82f6','#22c55e','#a855f7','#f59e0b','#ef4444','#06b6d4'];
  const color = palette[Math.floor(Math.random()*palette.length)];
  document.documentElement.style.setProperty('--primary', color);
  accentBtn.blur();
});

// モーダル
const dialog   = $('#demoDialog');
const backdrop = $('#backdrop');
const openBtn  = $('#modalOpenBtn');
function openDialog(){ dialog.showModal(); backdrop.hidden = false; }
function closeDialog(){ dialog.close(); backdrop.hidden = true; }
openBtn.addEventListener('click', openDialog);
dialog.addEventListener('close', () => { backdrop.hidden = true; });
backdrop.addEventListener('click', closeDialog);