// canvas.json の順序どおりに .dc.html のアートボードを取り出し、
// 発表用のスライドビューア（1枚のHTML）を組み立てる。
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = process.argv[2];
if (!out) {
  console.error('usage: node build-deck.mjs <output.html>');
  process.exit(1);
}

const canvas = JSON.parse(readFileSync(resolve(here, 'canvas.json'), 'utf8'));

const slides = canvas.artboards.map((ab) => {
  const src = readFileSync(resolve(here, ab.file), 'utf8');
  const open = src.indexOf('<x-dc>');
  const close = src.indexOf('</x-dc>');
  if (open < 0 || close < 0) throw new Error(`x-dc not found in ${ab.file}`);
  let body = src.slice(open + '<x-dc>'.length, close);
  const hOpen = body.indexOf('<helmet>');
  const hClose = body.indexOf('</helmet>');
  if (hOpen >= 0 && hClose >= 0) body = body.slice(0, hOpen) + body.slice(hClose + '</helmet>'.length);
  body = body.trim();
  if (!body.startsWith('<div')) throw new Error(`unexpected artboard root in ${ab.file}`);
  // canvas.json の title は "01 表紙" の形。番号を落として見出しだけ使う。
  const label = (ab.title || ab.file.replace(/\.dc\.html$/, '')).replace(/^\d+\s+/, '');
  return { file: ab.file, label, html: body };
});

const nav = slides
  .map((s, i) => `      <button class="thumb" type="button" data-goto="${i}">
        <span class="thumb-stage"><span class="thumb-inner">${s.html}</span></span>
        <span class="thumb-label"><span class="thumb-num">${String(i + 1).padStart(2, '0')}</span>${s.label}</span>
      </button>`)
    .join('\n');

const deck = slides
  .map((s, i) => `    <section class="slide" data-index="${i}" aria-label="${i + 1}枚目：${s.label}"${i === 0 ? '' : ' hidden'}>${s.html}</section>`)
  .join('\n');

const html = `<title>医療系案件 面談スライド</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap">
<style>
  :root {
    --shell: #0e1114;
    --shell-lift: #171c20;
    --hairline: #262c31;
    --chrome: #868d94;
    --chrome-strong: #e9e6e0;
    --accent: #55a7ad;
    --bar: 52px;
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--shell);
    color: var(--chrome);
    font-family: 'Zen Kaku Gothic New', 'Hiragino Sans', 'Yu Gothic', sans-serif;
    overflow: hidden;
  }
  .viewer { position: fixed; inset: 0; display: flex; flex-direction: column; }

  .stage {
    flex: 1 1 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    cursor: pointer;
  }
  .scaler {
    width: 1280px;
    height: 720px;
    flex: 0 0 auto;
    transform-origin: center center;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  }
  .slide { position: absolute; inset: 0; }
  .slide > div { width: 1280px !important; height: 720px !important; }

  .bar {
    flex: 0 0 var(--bar);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 18px;
    border-top: 1px solid var(--hairline);
    background: var(--shell);
    font-size: 13px;
  }
  .bar-title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--chrome-strong);
    letter-spacing: 0.02em;
  }
  .count {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.1em;
    color: var(--chrome);
    flex: 0 0 auto;
  }
  .count b { color: var(--chrome-strong); font-weight: 700; }

  button {
    font: inherit;
    color: var(--chrome);
    background: none;
    border: 1px solid var(--hairline);
    border-radius: 2px;
    padding: 7px 12px;
    cursor: pointer;
    transition: color .12s, border-color .12s, background-color .12s;
  }
  button:hover { color: var(--chrome-strong); border-color: #3a434a; }
  button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  button[disabled] { opacity: .35; cursor: default; }
  button[disabled]:hover { color: var(--chrome); border-color: var(--hairline); }
  .icon-btn { padding: 7px 10px; line-height: 0; }
  .icon-btn svg { display: block; }

  .hint { flex: 0 0 auto; color: #5d656c; font-size: 12px; letter-spacing: 0.04em; }
  @media (max-width: 860px) { .hint { display: none; } }

  .overview {
    position: fixed;
    inset: 0;
    background: var(--shell);
    overflow-y: auto;
    padding: 28px 28px 40px;
    z-index: 10;
  }
  .overview-head {
    display: flex;
    align-items: baseline;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--hairline);
    margin-bottom: 22px;
  }
  .overview-head h1 {
    margin: 0;
    font-family: 'Shippori Mincho B1', 'Hiragino Mincho ProN', 'Yu Mincho', serif;
    font-size: 19px;
    font-weight: 700;
    color: var(--chrome-strong);
    letter-spacing: 0.04em;
  }
  .overview-head .esc { margin-left: auto; }
  .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; }
  @media (max-width: 1100px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (max-width: 780px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

  .thumb {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 0;
    border: none;
    background: none;
    text-align: left;
  }
  .thumb-stage {
    display: block;
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border: 1px solid var(--hairline);
    transition: border-color .12s;
  }
  .thumb:hover .thumb-stage, .thumb:focus-visible .thumb-stage { border-color: var(--accent); }
  .thumb[aria-current="true"] .thumb-stage { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
  .thumb-inner {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 1280px;
    height: 720px;
    transform-origin: top left;
    pointer-events: none;
  }
  .thumb-label {
    display: flex;
    align-items: baseline;
    gap: 9px;
    font-size: 12.5px;
    color: var(--chrome);
    line-height: 1.5;
  }
  .thumb[aria-current="true"] .thumb-label { color: var(--chrome-strong); }
  .thumb-num {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.12em;
    color: var(--accent);
    flex: 0 0 auto;
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
</style>

<div class="viewer">
  <div class="stage" id="stage">
    <div class="scaler" id="scaler">
${deck}
    </div>
  </div>
  <div class="bar">
    <button class="icon-btn" type="button" id="prev" aria-label="前のスライド">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"></path></svg>
    </button>
    <button class="icon-btn" type="button" id="next" aria-label="次のスライド">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"></path></svg>
    </button>
    <span class="count"><b id="cur">01</b> / ${String(slides.length).padStart(2, '0')}</span>
    <span class="bar-title" id="title"></span>
    <span class="hint">← → で移動　O で一覧　F で全画面</span>
    <button type="button" id="grid-btn">一覧</button>
    <button type="button" id="fs">全画面</button>
  </div>
</div>

<div class="overview" id="overview" hidden>
  <div class="overview-head">
    <h1>医療系ソフト開発および保守 ／ 案件概要説明</h1>
    <span>${slides.length}枚</span>
    <button class="esc" type="button" id="close-grid">閉じる</button>
  </div>
  <div class="grid">
${nav}
  </div>
</div>

<script>
(function () {
  var LABELS = ${JSON.stringify(slides.map((s) => s.label))};
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var scaler = document.getElementById('scaler');
  var stage = document.getElementById('stage');
  var overview = document.getElementById('overview');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.thumb'));
  var cur = document.getElementById('cur');
  var title = document.getElementById('title');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var i = 0;

  function fit() {
    var pad = 40;
    var w = stage.clientWidth - pad;
    var h = stage.clientHeight - pad;
    var s = Math.min(w / 1280, h / 720);
    if (!isFinite(s) || s <= 0) s = 0.1;
    scaler.style.transform = 'scale(' + s + ')';
    thumbs.forEach(function (t) {
      var box = t.querySelector('.thumb-stage');
      var inner = t.querySelector('.thumb-inner');
      if (box && inner && box.clientWidth) inner.style.transform = 'scale(' + (box.clientWidth / 1280) + ')';
    });
  }

  function show(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (el, k) { el.hidden = k !== i; });
    thumbs.forEach(function (t, k) { t.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    cur.textContent = String(i + 1).padStart(2, '0');
    title.textContent = LABELS[i];
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  }

  function openGrid(open) {
    overview.hidden = !open;
    if (open) fit();
  }

  prev.addEventListener('click', function (e) { e.stopPropagation(); show(i - 1); });
  next.addEventListener('click', function (e) { e.stopPropagation(); show(i + 1); });
  document.getElementById('grid-btn').addEventListener('click', function () { openGrid(true); });
  document.getElementById('close-grid').addEventListener('click', function () { openGrid(false); });
  thumbs.forEach(function (t) {
    t.addEventListener('click', function () { show(Number(t.dataset.goto)); openGrid(false); });
  });

  stage.addEventListener('click', function (e) {
    var mid = stage.getBoundingClientRect().left + stage.clientWidth / 2;
    show(e.clientX < mid ? i - 1 : i + 1);
  });

  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }
  document.getElementById('fs').addEventListener('click', fullscreen);

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'Escape') { openGrid(false); return; }
    if (k === 'o' || k === 'O') { e.preventDefault(); openGrid(overview.hidden); return; }
    if (k === 'f' || k === 'F') { e.preventDefault(); fullscreen(); return; }
    if (!overview.hidden) return;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') { e.preventDefault(); show(i + 1); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); show(i - 1); }
    else if (k === 'Home') { e.preventDefault(); show(0); }
    else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
  });

  var tx = null;
  stage.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 48) show(dx < 0 ? i + 1 : i - 1);
    tx = null;
  }, { passive: true });

  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
  show(0);
})();
</script>
`;

writeFileSync(out, html);
console.log(`wrote ${out} — ${slides.length} slides: ${slides.map((s) => s.label).join(' / ')}`);
