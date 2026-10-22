'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const storage = {
  read(key) { try { return localStorage.getItem(`okan-${key}`); } catch { return null; } },
  write(key, value) { try { localStorage.setItem(`okan-${key}`, value); return true; } catch { return false; } },
  remove(key) { try { localStorage.removeItem(`okan-${key}`); } catch { /* Browser storage may be disabled. */ } }
};
document.documentElement.lang = 'en';
storage.remove('language');
let selectedFilter = 'all';
const repository = 'https://github.com/OkanKaya07/data-science-portfolio/tree/main/projects/';
const drawings = {
 retail: '<path d="M14 115h242M25 25v90" stroke="#829781" fill="none"/><rect x="45" y="68" width="24" height="47" rx="3" fill="#b6c4a3"/><rect x="86" y="52" width="24" height="63" rx="3" fill="#8fa88b"/><rect x="127" y="65" width="24" height="50" rx="3" fill="#b6c4a3"/><rect x="168" y="31" width="24" height="84" rx="3" fill="#6c896b"/><rect x="209" y="13" width="24" height="102" rx="3" fill="#355e49"/><path d="m45 51 51-20 42 8 42-26 45-11" stroke="#a64831" stroke-width="2" fill="none"/><circle cx="225" cy="2" r="4" fill="#a64831"/>',
 segments: '<g fill="#6c8d70"><circle cx="50" cy="30" r="7"/><circle cx="68" cy="50" r="5"/><circle cx="43" cy="63" r="6"/><circle cx="82" cy="23" r="5"/><circle cx="94" cy="57" r="6"/><circle cx="58" cy="83" r="5"/><circle cx="77" cy="76" r="7"/></g><g fill="#c2825a"><circle cx="176" cy="29" r="6"/><circle cx="194" cy="47" r="7"/><circle cx="216" cy="32" r="5"/><circle cx="228" cy="62" r="6"/><circle cx="183" cy="75" r="5"/><circle cx="205" cy="83" r="7"/></g><g fill="none" stroke="#718871" stroke-dasharray="3 5"><ellipse cx="68" cy="53" rx="51" ry="49"/><ellipse cx="202" cy="55" rx="47" ry="48" stroke="#ad7b59"/></g><text x="130" y="127" font-size="8" text-anchor="middle" fill="#657263" font-family="monospace">RECENCY / FREQUENCY / VALUE</text>',
 ml: '<path d="M17 115h240M23 15v100" stroke="#9aafa5" fill="none"/><path d="m23 94 18-9 16 12 18-32 17 14 17-30 16 8 17-24 18 15 18-27 17 10 17-20 17 11 17-16" stroke="#386a5d" fill="none" stroke-width="3"/><path d="m23 87 18 4 16-8 18-10 17-4 17-14 16-3 17-11 18 4 18-18 17 0 17-11 17 0 17-17" stroke="#b16b4b" fill="none" stroke-width="1.7" stroke-dasharray="4 4"/><text x="135" y="133" font-size="8" fill="#527165" text-anchor="middle" font-family="monospace">TIME-AWARE VALIDATION</text>',
 excel: '<rect x="25" y="8" width="220" height="121" rx="5" fill="#f7f9f1" stroke="#9cb397"/><rect x="25" y="8" width="220" height="24" rx="4" fill="#426b50"/><g stroke="#c9d4c2"><path d="M25 54h220M25 76h220M25 98h220M25 120h220M80 32v97M135 32v97M190 32v97"/></g><path d="M39 45h26M94 45h25M149 45h26M204 45h25M39 67h26M94 67h25M149 67h26M204 67h25" stroke="#7f9c76" stroke-width="3"/><rect x="135" y="76" width="55" height="22" fill="#bcd1a8"/><text x="152" y="91" font-size="10" fill="#355342" font-family="monospace">=SUM</text>',
 python: '<rect x="18" y="6" width="234" height="128" rx="6" fill="#30463b"/><circle cx="33" cy="20" r="3" fill="#ce886b"/><circle cx="44" cy="20" r="3" fill="#dfc47d"/><circle cx="55" cy="20" r="3" fill="#a5b78f"/><g font-family="monospace" font-size="10"><text x="35" y="47" fill="#e4bc78">$ python air_quality.py</text><text x="35" y="70" fill="#c2d2b9">parse → validate → transform</text><text x="35" y="90" fill="#a6bba0">9357 observations loaded</text><text x="35" y="113" fill="#e5e1ce">5 tests passed  ✓</text></g>',
 bio: '<g stroke-width="2.5" fill="none"><path d="M75 3c80 27 40 72 120 130" stroke="#7e7192"/><path d="M195 3c-80 27-40 72-120 130" stroke="#ba806e"/><path d="M89 10h92M111 28h48M125 46h20M121 64h28M109 82h52M92 100h86M80 118h110" stroke="#aaa0b6" stroke-width="1.5"/></g><circle cx="75" cy="3" r="4" fill="#7e7192"/><circle cx="195" cy="133" r="4" fill="#ba806e"/>'
};
const projects = [
 { folder:'01-retail-analytics', category:'analytics', art:'retail', theme:'analytics', en:['Retail, beyond the numbers.','SQL & DATA ANALYSIS','Exploring sales patterns, order value, and geographic concentration in 541,909 real retail transaction lines.','541,909 source rows'], tags:['Python','SQL','Pandas'] },
 { folder:'02-customer-segmentation',category:'analytics',art:'segments',theme:'segments',en:['Finding patterns in people.','CUSTOMER SEGMENTATION','Grouping purchase behavior with RFM features, K-means, silhouette scores, and seed-stability checks.','4,338 customers analyzed'], tags:['RFM','K-means','Scikit-learn'] },
 { folder:'03-bike-demand',category:'code',art:'ml',theme:'ml',en:['Making sense of demand.','MACHINE LEARNING','Comparing demand models with chronological holdouts and expanding-window validation, using observed weather.','Time-aware evaluation'],tags:['Python','Regression','Cross-validation'] },
 { folder:'04-excel-bike-operations',category:'analytics',art:'excel',theme:'excel',en:['From daily rows to a story.','EXCEL DASHBOARD','An editable operations workbook with monthly summaries, SUMIFS, COUNTIFS, reconciliation, and a native chart.','731 days · real source data'],tags:['Excel','Formulas','Dashboard'] },
 { folder:'05-python-air-quality',category:'code',art:'python',theme:'python',en:['Messy data. Reliable code.','PYTHON APPLICATION','A command-line sensor-data pipeline with typed records, validation, logging, atomic SQLite loading, and tests.','5 application tests passed'],tags:['Python','SQLite','Unit tests'] },
 { folder:'06-r-bioinformatics',category:'bio',art:'bio',theme:'bio',en:['Listening to gene expression.','R & BIOINFORMATICS','Exploring historical leukemia expression data with PCA, Welch tests, and Benjamini–Hochberg correction.','3,051 features · 38 samples'],tags:['R','PCA','Multiple testing'] }
];
function renderProjects() {
 const visible=projects.filter(p=>selectedFilter==='all'||p.category===selectedFilter);
 $('#project-grid').innerHTML=visible.map(p=>{
  const [title,category,description,detail]=p.en;
  return `<article class="project-card"><div class="project-art art-${p.theme}" aria-hidden="true"><span class="art-label">OK / FIELD NOTES</span><svg viewBox="0 0 270 145">${drawings[p.art]}</svg><span class="art-number">0${projects.indexOf(p)+1}</span></div><div class="project-body"><p class="project-category">${category}</p><h3>${title}</h3><p>${description}</p><div class="tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="project-bottom"><span>${detail}</span><a href="${repository+p.folder}" target="_blank" rel="noopener noreferrer">View project <span aria-hidden="true">↗</span></a></div></div></article>`;
 }).join('');
 $('#project-count').textContent=`${visible.length} projects`;
}
$$('.filter').forEach(button=>button.addEventListener('click',()=>{
 selectedFilter=button.dataset.filter;
 $$('.filter').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderProjects();
}));
const menu=$('#mobile-nav'),menuButton=$('#menu-toggle');
menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));menuButton.ariaLabel=menu.hidden?'Open navigation':'Close navigation';});
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.ariaLabel='Open navigation';}));
const scenePanel=$('#scene-panel'),sceneButton=$('#scene-toggle');
function togglePanel(open){scenePanel.hidden=!open;sceneButton.setAttribute('aria-expanded',String(open));if(open)$('#scene-close').focus();}
sceneButton.addEventListener('click',()=>togglePanel(scenePanel.hidden));
$('#scene-close').addEventListener('click',()=>{togglePanel(false);sceneButton.focus();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!scenePanel.hidden){togglePanel(false);sceneButton.focus();}menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.ariaLabel='Open navigation';}});
document.addEventListener('click',event=>{if(!event.target.closest('.scene-controls'))togglePanel(false);});
function setScene(scene, persist=true){
 const valid=['grand-line','sunset','night'];if(!valid.includes(scene))scene='grand-line';
 document.documentElement.dataset.scene=scene;
 $$('.scene-options button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scene===scene)));
 if(persist)storage.write('scene',scene);
}
function clearCustom(){ $('.hero-art').style.removeProperty('background-image');storage.remove('custom');$('#custom-background').value=''; }
$$('.scene-options button').forEach(button=>button.addEventListener('click',()=>{clearCustom();setScene(button.dataset.scene);$('#scene-status').textContent='New horizon selected.';}));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let paused=storage.read('paused')===null?reducedMotion.matches:storage.read('paused')==='true';
function updateMotionLabel(){
 document.documentElement.classList.toggle('motion-paused',paused);
 $('#motion-toggle').setAttribute('aria-pressed',String(paused));
 $('#motion-toggle').textContent=(paused?'Resume motion':'Pause motion');
}
$('#motion-toggle').addEventListener('click',()=>{paused=!paused;storage.write('paused',String(paused));updateMotionLabel();});
$('#scene-reset').addEventListener('click',()=>{clearCustom();setScene('grand-line');paused=reducedMotion.matches;storage.remove('paused');updateMotionLabel();$('#scene-status').textContent='Original background restored.';});
$('#custom-background').addEventListener('change',event=>{
 const file=event.target.files[0];if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)){ $('#scene-status').textContent='Choose a JPG, PNG, or WebP image.';return; }
 if(file.size>8*1024*1024){$('#scene-status').textContent='Choose an image smaller than 8 MB.';return;}
 const reader=new FileReader();reader.onerror=()=>{$('#scene-status').textContent='The image could not be read.';};
 reader.onload=()=>{const image=new Image();image.onerror=()=>{$('#scene-status').textContent='This image could not be opened.';};image.onload=()=>{
  $('.hero-art').style.backgroundImage=`url("${reader.result}")`;
  const saved=storage.write('custom',reader.result);
  $$('.scene-options button').forEach(button=>button.setAttribute('aria-pressed','false'));
  $('#scene-status').textContent=(saved?'Your background is saved in this browser.':'Background applied for this visit; browser storage is full.');
 };image.src=reader.result;};reader.readAsDataURL(file);
});
setScene(storage.read('scene')||'grand-line',false);
const custom=storage.read('custom');
if(custom&&/^data:image\/(png|jpeg|webp);base64,/.test(custom)){ $('.hero-art').style.backgroundImage=`url("${custom}")`;$$('.scene-options button').forEach(b=>b.setAttribute('aria-pressed','false')); }
$('#year').textContent=String(new Date().getFullYear());
renderProjects();
updateMotionLabel();
