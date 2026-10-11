(()=>{'use strict';
const $=s=>document.querySelector(s),cfg=window.TET_CONFIG||{},subjects=['All','Hindi Content','Hindi Language','English','CDP'];
let topics=[],selected='All',lastLoaded=0,loading=false,seq=0;
const CACHE_KEY='special_tet_2026_directory_v18';
const OLD_CACHE_KEY='special_tet_2026_directory_v17';
const PROGRESS_KEY='special_tet_2026_completed_v1';
let currentTopic=null,currentMode=null;
const AUTO_FINISH_MS=5*60*1000;
let shortVisibleSince=0,shortVisibleMs=0,shortTimer=null;
function stopShortTimer(){if(shortVisibleSince){shortVisibleMs+=Date.now()-shortVisibleSince;shortVisibleSince=0}if(shortTimer){clearInterval(shortTimer);shortTimer=null}}
function updateShortTimer(){
 if(!currentTopic||!['short','full'].includes(currentMode)||$('#player').hidden)return;
 if(document.visibilityState==='visible'&&!shortVisibleSince)shortVisibleSince=Date.now();
 if(document.visibilityState!=='visible'&&shortVisibleSince){shortVisibleMs+=Date.now()-shortVisibleSince;shortVisibleSince=0}
 const total=shortVisibleMs+(shortVisibleSince?Date.now()-shortVisibleSince:0);
 // Time spent viewing a quiz is not proof of submission.
 if(total>=AUTO_FINISH_MS){ $('#playerComplete').title='Mark finished after submitting the quiz'; }
}
document.addEventListener('visibilitychange',updateShortTimer);

function progressRead(){try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}')||{}}catch(_){return {}}}
function progressId(t,mode){const m=norm(t.topic).match(/(\d+)\s*-\s*(\d+)/);return subject(t)+'|'+(m?m[1]+'-'+m[2]:norm(t.topic))+'|'+mode}
function isFinished(t,mode){return Boolean(progressRead()[progressId(t,mode)])}
function markFinished(t,mode){if(!t||!mode)return;try{const p=progressRead();p[progressId(t,mode)]=new Date().toISOString();localStorage.setItem(PROGRESS_KEY,JSON.stringify(p))}catch(_){}render()}
function nextTopic(t){
 const same=topics.filter(x=>subject(x)===subject(t)).sort((a,b)=>parseInt(a.range,10)-parseInt(b.range,10));
 const i=same.findIndex(x=>progressId(x,'full')===progressId(t,'full'));
 return i>=0 && i+1<same.length?same[i+1]:null;
}
function goToNextTopic(t){
 const next=nextTopic(t);if(!next)return false;
 closeQuiz();selected=subject(next);$('#search').value='';render();
 const card=[...document.querySelectorAll('.card')].find(c=>c.querySelector('[data-index]')?.dataset.index===String(topics.indexOf(next)));
 if(card){card.scrollIntoView({behavior:'smooth',block:'center'});card.classList.add('nextTarget');setTimeout(()=>card.classList.remove('nextTarget'),2400)}
 return true;
}

let loadedFromNetwork=false, fallbackStarted=false;
function saveCache(data){try{localStorage.setItem(CACHE_KEY,JSON.stringify({time:Date.now(),data}))}catch(_){}}
function restoreCache(){
 for(const key of [CACHE_KEY,OLD_CACHE_KEY]){try{const c=JSON.parse(localStorage.getItem(key)||'null');if(c&&c.data&&Array.isArray(c.data.topics)){receive(c.data,true);return true}}catch(_){}}
 return false;
}
function warmQuiz(url){try{const origin=new URL(url).origin;if(![...document.querySelectorAll('link[data-warm]')].some(l=>l.dataset.warm===origin)){const link=document.createElement('link');link.rel='preconnect';link.href=origin;link.dataset.warm=origin;document.head.appendChild(link)}}catch(_){}}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').replace(/[•·]/g,'').replace(/[–—−]/g,'-').replace(/\s+/g,' ').trim().toUpperCase();
function subject(t){const s=norm(t.subject||t.topic);if(s.includes('HINDI CONTENT'))return 'Hindi Content';if(s.includes('HINDI LANGUAGE'))return 'Hindi Language';if(s.includes('ENGLISH'))return 'English';if(s.includes('CDP'))return 'CDP';return 'Other'}
const icons={'Hindi Content':'📕','Hindi Language':'🗣️','English':'🔤','CDP':'🧠'};
function notice(msg){$('#notice').hidden=!msg;$('#notice').textContent=msg||''}
function render(){const q=$('#search').value.toLowerCase().trim();$('#subjects').innerHTML=subjects.map(s=>`<button class="tab ${s===selected?'active':''}" data-subject="${esc(s)}" aria-pressed="${s===selected}">${esc(s)}${s==='All'?'':`<span class="count">${topics.filter(t=>subject(t)===s).length}</span>`}</button>`).join('');
 const visible=topics.filter(t=>(selected==='All'||subject(t)===selected)&&(`${t.topic} ${t.range} ${subject(t)}`).toLowerCase().includes(q));
 $('#cards').innerHTML=visible.map(t=>{const i=topics.indexOf(t),s=subject(t);return `<article class="card ${isFinished(t,'full')&&isFinished(t,'short')?'allDone':isFinished(t,'full')||isFinished(t,'short')?'partDone':''}"><div class="cardtop"><span class="tag">${esc(s)}</span><span class="cardicon">${isFinished(t,'full')&&isFinished(t,'short')?'🏅':isFinished(t,'full')||isFinished(t,'short')?'✓':icons[s]||'📖'}</span></div><h3>${esc(t.range||t.topic)}</h3>${isFinished(t,'full')||isFinished(t,'short')?`<div class="completionLabel">✓ ${isFinished(t,'full')&&isFinished(t,'short')?'Both quizzes finished':isFinished(t,'full')?'Full quiz finished':'15 MCQs finished'}</div>`:''}<p title="${esc(t.topic)}">${esc(t.topic)}</p><div class="cardbuttons"><button class="quizbtn full" data-index="${i}" data-mode="full" ${t.fullUrl?'':'disabled title="Full quiz link missing"'}>${isFinished(t,'full')?'✓ Full Quiz':'📚 Full Quiz'}</button><button class="quizbtn short" data-index="${i}" data-mode="short" ${t.shortUrl?'':'disabled title="15-question link missing from short quiz sheet"'}>${isFinished(t,'short')?'✓ 15 MCQs':'⚡ 15 MCQs'}</button></div></article>`}).join('')||'<div class="empty">No matching topics found. Try another subject or search.</div>';
 $('#progressSummary').textContent=`✓ ${topics.reduce((n,t)=>n+Number(isFinished(t,'full'))+Number(isFinished(t,'short')),0)} completed quizzes saved on this browser`;
 $('#status').textContent=`${topics.length} topic sets · ${topics.filter(t=>t.fullUrl).length} full quizzes · ${topics.filter(t=>t.shortUrl).length} short quizzes`;
}
function receive(data,fromCache=false){if(!data||!Array.isArray(data.topics)){notice('Directory returned an unexpected response. Check Apps Script deployment.');return}
 if(!fromCache&&data.topics.length&&!data.topics.some(t=>/^https:\/\//i.test(t.fullUrl||''))&&topics.some(t=>t.fullUrl)){notice('Directory returned no Full Quiz URLs; preserving previously loaded links.');return}
 const byKey=new Map();data.topics.forEach(t=>{const s=subject(t),m=norm(t.topic).match(/(\d+)\s*-\s*(\d+)/);if(s==='Other'||!m)return;const key=s+'|'+m[1]+'-'+m[2];const old=byKey.get(key)||{topic:t.topic,subject:s,range:m[1]+'–'+m[2],fullUrl:'',shortUrl:''};if(/^https:\/\//.test(t.fullUrl||''))old.fullUrl=t.fullUrl;if(/^https:\/\//.test(t.shortUrl||''))old.shortUrl=t.shortUrl;byKey.set(key,old)});
 // Merge sources: a short-only fallback must NEVER erase existing Full Quiz URLs.
 topics.forEach(t=>{const k=subject(t)+'|'+norm(t.range||t.topic).match(/(\d+)\s*-\s*(\d+)/)?.slice(1).join('-');const row=byKey.get(k);if(row){if(!row.fullUrl&&t.fullUrl)row.fullUrl=t.fullUrl;if(!row.shortUrl&&t.shortUrl)row.shortUrl=t.shortUrl;}});
 topics=[...byKey.values()];lastLoaded=Date.now();
 try{const pending=JSON.parse(localStorage.getItem('tet_pending_5min')||'null');if(pending){const t=topics.find(x=>progressId(x,pending.mode)===pending.id);if(t){markFinished(t,pending.mode);localStorage.removeItem('tet_pending_5min')}}}catch(_){}
 render();if(!fromCache){
  // Cache merged rows, not partial short-only API/fallback payloads.
  saveCache({topics:topics.map(t=>({...t}))});
  loadedFromNetwork=topics.some(t=>Boolean(t.fullUrl));
 }
 if(!topics.some(t=>t.fullUrl))notice('Full Quiz links are missing from the directory. Tap Refresh; if still missing, check the Full Quiz Google Sheet and directory Apps Script.');else notice('');
 
}
function fetchDirectory(force=false){if(loading)return;const api=cfg.DIRECTORY_API_URL;if(!/^https:\/\//.test(api||'')){notice('Set DIRECTORY_API_URL in config.js.');return}loading=true;$('#refresh').disabled=true;if(!topics.length)$('#status').textContent='Loading practice sets…';
 const callback='tetDirectory_'+(++seq);const script=document.createElement('script');let settled=false;
 const finish=()=>{loading=false;$('#refresh').disabled=false;delete window[callback];script.remove()};
 window[callback]=data=>{if(settled)return;settled=true;receive(data);finish()};
 script.onerror=()=>{if(settled)return;settled=true;finish();trySheetFallback()};
 const u=new URL(api);u.searchParams.set('callback',callback);if(force){u.searchParams.set('refresh','1');u.searchParams.set('_',String(Date.now()))}script.src=u.toString();document.head.appendChild(script);
 setTimeout(()=>{if(!settled){settled=true;finish();trySheetFallback()}},6500);
}
// Independent public Google Sheets fallback for new Chrome profiles and mobile.
// Uses Google's JSONP-style visualization response, no CORS fetch required.
function trySheetFallback(){
 if(fallbackStarted||loadedFromNetwork||loading)return;
 fallbackStarted=true;
 const sources=[
  {id:'13_sso_2s96ROaAuZ_yzsITDam7b-9U1dsNQU3v-6nWQ',field:'fullUrl'},
  {id:'1fjDQP6pHKolHBTFFeyvayWP4PNFhgp3RwgHMB9I66Ng',gid:'2120404683',field:'shortUrl'}
 ];
 let completed=0;const combined=[];
 const previous=window.google&&window.google.visualization&&window.google.visualization.Query&&window.google.visualization.Query.setResponse;
 window.google=window.google||{};window.google.visualization=window.google.visualization||{};
 window.google.visualization.Query=window.google.visualization.Query||{};
 const queue=[];
 window.google.visualization.Query.setResponse=function(response){
  const item=queue.shift();if(!item)return;
  try{
   if(response&&response.table){
    const rows=response.table.rows||[];
    const cellText=c=>String((c&&(c.f||c.v))||'').trim();
    rows.forEach(row=>{
     const cells=(row.c||[]).map(cellText);
     const topic=cells.find(x=>/^(?:[•·]\s*)?(HINDI CONTENT|HINDI LANGUAGE|ENGLISH|CDP)\b/i.test(x)&&/\d+\s*[-–—]\s*\d+/.test(x));
     const link=cells.map(x=>x.match(/https:\/\/[^\s"<>]+/i)).find(Boolean);
     if(topic&&link){const o={topic};o[item.field]=link[0];combined.push(o)}
    });
   }
  }catch(_){}
  completed++;
  if(combined.length&&!loadedFromNetwork){receive({topics:combined});}
  if(completed===sources.length&&!topics.length){
    $('#progressSummary').textContent=`✓ ${topics.reduce((n,t)=>n+Number(isFinished(t,'full'))+Number(isFinished(t,'short')),0)} completed quizzes saved on this browser`;
 $('#status').textContent='Practice sets could not be loaded';
    $('#cards').innerHTML='<div class="empty">The quiz directory is temporarily unavailable. Please try Refresh.</div>';
  }
 };
 sources.forEach(item=>{
  queue.push(item);
  const el=document.createElement('script');
  const url='https://docs.google.com/spreadsheets/d/'+item.id+'/gviz/tq?tqx=out:json'+(item.gid?'&gid='+item.gid:'')+'&headers=0';
  el.src=url;el.async=false;el.onerror=()=>{
   const pos=queue.indexOf(item);if(pos>=0)queue.splice(pos,1);
   completed++;if(completed===sources.length&&!topics.length){$('#status').textContent='Practice sets could not be loaded';$('#cards').innerHTML='<div class="empty">Unable to access the quiz directory. Check the Apps Script deployment permissions, then tap Refresh.</div>'}
  };
  document.head.appendChild(el);
 });
}
function openQuiz(t,mode){
 const url=mode==='full'?t.fullUrl:t.shortUrl;
 if(!/^https:\/\//i.test(url||'')){notice('Quiz link is unavailable. Refresh the directory.');fetchDirectory(true);return;}
 currentTopic=t;currentMode=mode;
 warmQuiz(url);
 stopShortTimer();shortVisibleMs=0;shortVisibleSince=document.visibilityState==='visible'?Date.now():0;
 $('#home').hidden=true;$('#player').hidden=false;shortTimer=setInterval(updateShortTimer,1000);
 $('#playerTitle').textContent=subject(t)+' · '+t.range;
 $('#playerMode').textContent=mode==='full'?'Full-length quiz':'15-question practice';
 $('#external').href=url;$('#frameLoading').hidden=false;
 $('#playerComplete').textContent=isFinished(t,mode)?'✓ Finished':'✓ Mark finished';
 const frame=$('#quizFrame');frame.onload=()=>{$('#frameLoading').hidden=true};frame.src=url;
 $('#embedHelp').hidden=true; // No overlay obscuring quiz questions
 window.scrollTo({top:0,behavior:'instant'});
}
function closeQuiz(){updateShortTimer();stopShortTimer();const frame=$('#quizFrame');frame.onload=null;frame.src='about:blank';$('#player').hidden=true;$('#home').hidden=false;$('#frameLoading').hidden=true;$('#embedHelp').hidden=true;}
$('#subjects').addEventListener('click',e=>{const b=e.target.closest('[data-subject]');if(b){selected=b.dataset.subject;render()}});
$('#cards').addEventListener('pointerover',e=>{const b=e.target.closest('[data-index]');if(b&&!b.disabled){const t=topics[Number(b.dataset.index)];if(t)warmQuiz(b.dataset.mode==='full'?t.fullUrl:t.shortUrl)}});
$('#cards').addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(b&&!b.disabled)openQuiz(topics[Number(b.dataset.index)],b.dataset.mode)});
$('#search').addEventListener('input',render);$('#close').onclick=closeQuiz;$('#back').onclick=closeQuiz;$('#refresh').onclick=()=>{fallbackStarted=false;loadedFromNetwork=false;fetchDirectory(true)};
// Completion is intentionally user-confirmed: cross-origin Google Apps Script iframes
// cannot expose their Submit/result state to this GitHub Pages portal.
$('#playerComplete').onclick=()=>{if(currentTopic&&currentMode){markFinished(currentTopic,currentMode);$('#playerComplete').textContent='✓ Finished';}};
$('#nextQuiz').onclick=()=>{if(currentTopic)goToNextTopic(currentTopic)};
$('#nextSectionHome').onclick=()=>{const available=['Hindi Content','Hindi Language','English','CDP'].filter(s=>topics.some(t=>subject(t)===s));const i=available.indexOf(selected);selected=available[(i+1)%available.length]||'All';$('#search').value='';render();document.querySelector('.dashboard').scrollIntoView({behavior:'smooth'});};
// Legacy return support for students with an older open quiz tab. Allow a
// one-tap confirmation. Never automatically claim the quiz was completed.
window.addEventListener('pageshow',()=>{try{const last=JSON.parse(sessionStorage.getItem('tet_last_opened')||'null');if(!last)return;sessionStorage.removeItem('tet_last_opened');if(progressRead()[last.id])return;
 const elapsed=Number(last.startedAt)>0?Date.now()-Number(last.startedAt):0;
 const banner=document.createElement('div');banner.className='returnPrompt';banner.innerHTML='<span>Finished <strong></strong>?</span><button type="button" class="confirmDone">✓ Mark finished</button><button type="button" class="goNextTopic">Next topic →</button><button type="button" class="dismissDone" aria-label="Dismiss">✕</button>';banner.querySelector('strong').textContent=last.topic;banner.querySelector('.confirmDone').onclick=()=>{const t=topics.find(t=>progressId(t,last.mode)===last.id);if(t)markFinished(t,last.mode);banner.remove()};banner.querySelector('.goNextTopic').onclick=()=>{const t=topics.find(t=>progressId(t,last.mode)===last.id);banner.remove();if(t)goToNextTopic(t)};banner.querySelector('.dismissDone').onclick=()=>banner.remove();document.body.appendChild(banner)}catch(_){}});
$('#logo').onclick=e=>{if(!$('#player').hidden){e.preventDefault();closeQuiz()}};
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#player').hidden)closeQuiz()});
// Prefer the same-origin snapshot: no Google request on a first-time visit.
const snapshot=window.TET_DIRECTORY_SNAPSHOT;
let hadCache=false;
if(snapshot&&Array.isArray(snapshot.topics)&&snapshot.topics.length){receive(snapshot,true);hadCache=true;saveCache(snapshot)}
else hadCache=restoreCache();
if(!hadCache){fetchDirectory();}
else {try{const c=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');if(!topics.some(t=>t.fullUrl)||!c||Date.now()-c.time>5*60*1000){setTimeout(()=>fetchDirectory(!topics.some(t=>t.fullUrl)),900)}}catch(_){setTimeout(()=>fetchDirectory(),900)}}
const guideToggle=$('#guideToggle'),guidePanel=$('#guidePanel'),guideImage=$('#guideImage'),guideArrow=$('#guideArrow');
guideToggle.addEventListener('click',()=>{const showing=guidePanel.hidden;guidePanel.hidden=!showing;guideToggle.setAttribute('aria-expanded',String(showing));guideArrow.textContent=showing?'Hide ▴':'Show ▾';if(showing&&!guideImage.src){guideImage.src=guideImage.dataset.src;}});
})();

// V21: independent, lazy-loaded Full Quiz troubleshooting guide.
(()=>{const toggle=document.getElementById('fixGuideToggle'),panel=document.getElementById('fixGuidePanel'),img=document.getElementById('fixGuideImage'),arrow=document.getElementById('fixGuideArrow');if(!toggle||!panel||!img||!arrow)return;toggle.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));arrow.textContent=open?'Hide ▴':'Show ▾';if(open&&!img.getAttribute('src'))img.src=img.dataset.src;});})();
