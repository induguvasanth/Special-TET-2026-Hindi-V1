/** SPECIAL TET 2026 — directory only; existing quiz Apps Script stays unchanged. */
const CONFIG={
  FULL_ID:'13_sso_2s96ROaAuZ_yzsITDam7b-9U1dsNQU3v-6nWQ',
  SHORT_ID:'1fjDQP6pHKolHBTFFeyvayWP4PNFhgp3RwgHMB9I66Ng',
  CACHE_SECONDS:600
};
function doGet(e){
  const p=(e&&e.parameter)||{};
  const data=directory_(p.refresh==='1');
  const callback=p.callback;
  if(callback){
    if(!/^[A-Za-z_$][\w$]*$/.test(callback))return ContentService.createTextOutput('Invalid callback');
    return ContentService.createTextOutput(callback+'('+JSON.stringify(data)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function directory_(refresh){
  const cache=CacheService.getScriptCache();const key='tet_directory_v17';
  if(!refresh){const saved=cache.get(key);if(saved)return JSON.parse(saved);}
  const errors=[];
  const full=read_(CONFIG.FULL_ID,'fullUrl',errors),short=readShort_(errors);
  const map={};
  full.concat(short).forEach(t=>{
    const key=identity_(t.topic);if(!key)return;
    if(!map[key])map[key]={topic:t.topic,subject:subject_(t.topic),range:range_(t.topic),fullUrl:'',shortUrl:''};
    if(t.fullUrl)map[key].fullUrl=t.fullUrl;
    if(t.shortUrl)map[key].shortUrl=t.shortUrl;
  });
  const order=['Hindi Content','Hindi Language','English','CDP'];
  const topics=Object.values(map).filter(t=>t.subject!=='Other').sort((a,b)=>order.indexOf(a.subject)-order.indexOf(b.subject)||parseInt(a.range,10)-parseInt(b.range,10));
  const result={ok:errors.length===0,updatedAt:new Date().toISOString(),topics,stats:{fullRows:full.length,shortRows:short.length,fullLinks:topics.filter(x=>x.fullUrl).length,shortLinks:topics.filter(x=>x.shortUrl).length},errors};
  const json=JSON.stringify(result);if(json.length<95000)cache.put(key,json,CONFIG.CACHE_SECONDS);
  return result;
}
function read_(id,field,errors){
  const out=[];
  try{
    const ss=SpreadsheetApp.openById(id);
    ss.getSheets().forEach(sh=>{
      const range=sh.getDataRange();
      const vals=range.getDisplayValues();
      if(!vals.length)return;
      const rich=range.getRichTextValues(), formulas=range.getFormulas();
      let header=-1,topicCol=-1;
      for(let r=0;r<Math.min(25,vals.length);r++){
        const labels=vals[r].map(x=>String(x).toLowerCase().replace(/[^a-z0-9]+/g,''));
        topicCol=labels.findIndex(x=>['topicname','topic','topicrange','quiztopic','topics'].includes(x));
        if(topicCol>=0){header=r;break;}
      }
      if(header<0)return;
      for(let r=header+1;r<vals.length;r++){
        const topic=String(vals[r][topicCol]||'').trim();
        if(!topic||subject_(topic)==='Other')continue;
        let url='';
        // Prefer explicit quiz/link columns; ignore the topic cell and sheet links.
        const headers=vals[header].map(x=>String(x||'').toLowerCase());
        const candidates=[];
        for(let c=0;c<vals[r].length;c++){
          if(c===topicCol)continue;
          const candidate=extract_(vals[r][c],rich[r][c],formulas[r][c]);
          if(!candidate||!/^https:\/\//i.test(candidate))continue;
          const h=headers[c]||'';
          const score=(/quiz|direct|open|link|url|test/i.test(h)?10:0)+
            (/script\.google\.com\/macros\/s\//i.test(candidate)?5:0)+
            (/docs\.google\.com\/spreadsheets/i.test(candidate)?-20:0);
          candidates.push({url:candidate,score});
        }
        candidates.sort((a,b)=>b.score-a.score);
        if(candidates.length&&candidates[0].score>=0)url=candidates[0].url;
        const item={topic};item[field]=url;out.push(item);
      }
    });
  }catch(ex){errors.push(field+': '+String(ex.message||ex));}
  return out;
}
/**
 * 15-MCQ sheet layout confirmed by supplied screenshot:
 * A1 = "Topic Title (A1)", B1 = "Sheet Name",
 * C1 = "Direct Link", D1 = "Open".
 * Read A2:A as topic and C2:C as the ACTUAL individual quiz URL.
 * The old generic reader ignored this sheet because it expected "Topic Name".
 */
function readShort_(errors){
  const out=[];
  try{
    const ss=SpreadsheetApp.openById(CONFIG.SHORT_ID);
    ss.getSheets().forEach(sh=>{
      const last=sh.getLastRow();
      if(last<2)return;
      const rg=sh.getRange(2,1,last-1,4);
      const values=rg.getDisplayValues();
      const rich=rg.getRichTextValues();
      const formulas=rg.getFormulas();
      for(let r=0;r<values.length;r++){
        const topic=String(values[r][0]||values[r][1]||'').trim();
        if(subject_(topic)==='Other')continue;
        const url=extract_(values[r][2],rich[r][2],formulas[r][2])
          ||extract_(values[r][3],rich[r][3],formulas[r][3]);
        out.push({topic:topic,shortUrl:url});
      }
    });
  }catch(ex){errors.push('shortUrl: '+String(ex.message||ex));}
  return out;
}
function extract_(display,rich,formula){
  const value=String(display||'').trim();
  const plain=value.match(/https:\/\/[^\s"<>]+/i);
  if(plain)return clean_(plain[0]);
  if(rich){
    const direct=rich.getLinkUrl();
    if(direct&&direct.indexOf('https://')===0)return clean_(direct);
    const runs=rich.getRuns();
    for(let i=0;i<runs.length;i++){
      const u=runs[i].getLinkUrl();
      if(u&&u.indexOf('https://')===0)return clean_(u);
    }
  }
  const f=String(formula||'');
  const match=f.match(/HYPERLINK\s*\(\s*"([^"]+)"/i);
  if(match&&match[1].indexOf('https://')===0)return clean_(match[1]);
  return '';
}
function clean_(u){return String(u).trim().replace(/[),;]+$/,'');}
function norm_(s){return String(s||'').replace(/[•·]/g,'').replace(/[–—−]/g,'-').replace(/\s+/g,' ').trim().toUpperCase();}
function subject_(s){const t=norm_(s);if(t.includes('HINDI CONTENT'))return 'Hindi Content';if(t.includes('HINDI LANGUAGE'))return 'Hindi Language';if(t.includes('ENGLISH'))return 'English';if(/\bCDP\b/.test(t))return 'CDP';return 'Other';}
function range_(s){const m=norm_(s).match(/(\d+)\s*-\s*(\d+)/);return m?m[1]+'–'+m[2]:String(s);}
function identity_(s){const sub=subject_(s),m=norm_(s).match(/(\d+)\s*-\s*(\d+)/);return sub==='Other'?'':sub+'|'+(m?m[1]+'-'+m[2]:norm_(s));}
