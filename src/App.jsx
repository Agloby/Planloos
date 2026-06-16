import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ─── THEMES ──────────────────────────────────────────────────
const THEMES = {
  planloos:  {bg:"#111",ac:"#E53935",a2:"#FF5252",tc:"#fff",tc2:"rgba(255,255,255,.6)",tc3:"rgba(255,255,255,.35)",card:"rgba(255,255,255,.07)",border:"rgba(255,255,255,.12)",surf:"rgba(255,255,255,.04)",name:"Planloos ◉"},
  light:     {bg:"#F4F4F4",ac:"#E53935",a2:"#C62828",tc:"#111",tc2:"rgba(0,0,0,.6)",tc3:"rgba(0,0,0,.4)",card:"rgba(0,0,0,.05)",border:"rgba(0,0,0,.1)",surf:"rgba(0,0,0,.03)",name:"Planloos ○"},
  cosmic:    {bg:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)",ac:"#a78bfa",a2:"#60a5fa",tc:"#fff",tc2:"rgba(255,255,255,.6)",tc3:"rgba(255,255,255,.35)",card:"rgba(255,255,255,.07)",border:"rgba(255,255,255,.12)",surf:"rgba(255,255,255,.04)",name:"Cosmic"},
  ocean:     {bg:"linear-gradient(135deg,#020818,#0c2340,#0f172a)",ac:"#38bdf8",a2:"#22d3ee",tc:"#fff",tc2:"rgba(255,255,255,.6)",tc3:"rgba(255,255,255,.35)",card:"rgba(255,255,255,.07)",border:"rgba(255,255,255,.12)",surf:"rgba(255,255,255,.04)",name:"Ocean"},
};

// ─── CONSTANTS ────────────────────────────────────────────────
const PRI = {
  high:   {color:"#f87171",bg:"rgba(248,113,113,.18)",label:"High",   icon:"🔴"},
  medium: {color:"#fbbf24",bg:"rgba(251,191,36,.18)", label:"Medium", icon:"🟡"},
  low:    {color:"#34d399",bg:"rgba(52,211,153,.18)", label:"Low",    icon:"🟢"},
};
const CATS = ["Work","Personal","Errands","Health","Learning","Finance","Social","Other"];
const CE   = {Work:"💼",Personal:"🧘",Errands:"🛒",Health:"❤️",Learning:"📚",Finance:"💰",Social:"👥",Other:"📌"};
const TP   = ["5 min","15 min","30 min","45 min","1 hr","1.5 hrs","2 hrs","3 hrs","Half day","Full day"];
const HI   = {week:"📅",month:"🗓",year:"⭐","5year":"🚀","10year":"🌟"};
const HORIZONS = ["week","month","year","5year","10year"];
const HABIT_ICONS   = ["🙏","🏃","📚","💧","😴","🥗","✍️","🧘","💪","🎯","🌅","🚴","🎵","🌿","⚡"];
const HABIT_COLORS  = ["#E53935","#1565C0","#2E7D32","#F9A825","#6A1B9A","#E65100","#00838F","#4A148C"];

// ─── i18n ─────────────────────────────────────────────────────
const LANG = {
  en: {
    tagline:"Plan, sort of.", add:"Add a task, idea, or goal…", search:"Search…",
    noPending:"Add your first task", noPendingHint:"Type anything — AI enriches it automatically",
    noDone:"Nothing done yet", noDoneHint:"Complete a task to see it here",
    noHabits:"No habits yet", noHabitsHint:"Build consistency, one day at a time",
    addHabit:"Add Habit", streak:"streak", planBtn:"Plan Day", eodBtn:"End of Day",
    settings:"Settings", language:"Language", theme:"Theme", energy:"Peak Energy",
    morning:"Morning", afternoon:"Afternoon", evening:"Evening",
    save:"Save", cancel:"Cancel", retry:"Retry", close:"Close",
    level:"Level", dayStreak:"day streak", pending:"pending",
    csvImport:"Import CSV", csvHint:"CSV columns: Date, Start, End, Activity, Category, Details",
    calSync:"Calendar Sync", today:"Today", activityFeed:"Activity Feed",
    steps:"Steps", alsoConsider:"Also Consider", outcome:"Outcome",
    focus:"Focus", focusing:"Focusing", details:"Details", hide:"Hide",
    regen:"↺ Regenerate", tip:"Tip", planOrder:"Prioritised Order",
    bestFocus:"Best focus window", eodTitle:"End of Day Reflection",
    eodSub:"An honest conversation with yourself.", restWell:"Rest Well",
    respond:"Respond honestly…", addNote:"📝 Note", followup:"➕ Follow-up",
    aiSugg:"✨ AI Suggestions", deployPwa:"Download PWA Package",
    apiNote:"Not needed in Claude.ai. Required for standalone.",
    noGoals:"No goals yet", addGoal:"Add Goal", filters:"Filters",
    planEmpty:"Add tasks first, then hit Plan",
    tabs:["Tasks","Done","Calendar","Habits","Goals","Plan","Stats"],
    days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    HL:{week:"This Week",month:"This Month",year:"This Year","5year":"5 Years","10year":"10 Years"},
  },
  af: {
    tagline:"Plan, soort-van.", add:"Voeg 'n taak, idee of doel by…", search:"Soek…",
    noPending:"Voeg jou eerste taak by", noPendingHint:"Tik enigiets — KI verryk dit outomaties",
    noDone:"Nog niks gedoen nie", noDoneHint:"Voltooi 'n taak om dit hier te sien",
    noHabits:"Geen gewoontes nie", noHabitsHint:"Bou konsekwentheid, een dag op 'n keer",
    addHabit:"Voeg Gewoonte By", streak:"streeks", planBtn:"Beplan Dag", eodBtn:"Einde van Dag",
    settings:"Instellings", language:"Taal", theme:"Tema", energy:"Piek Energie",
    morning:"Oggend", afternoon:"Middag", evening:"Aand",
    save:"Stoor", cancel:"Kanselleer", retry:"Probeer Weer", close:"Sluit",
    level:"Vlak", dayStreak:"dag streeks", pending:"hangende",
    csvImport:"Voer CSV In", csvHint:"CSV kolomme: Datum, Begin, Einde, Aktiwiteit, Kategorie, Besonderhede",
    calSync:"Kalender Sinkronisasie", today:"Vandag", activityFeed:"Aktiwiteits Stroom",
    steps:"Stappe", alsoConsider:"Oorweeg Ook", outcome:"Uitkoms",
    focus:"Fokus", focusing:"Fokusseer", details:"Besonderhede", hide:"Versteek",
    regen:"↺ Hergenereer", tip:"Wenk", planOrder:"Geprioritiseerde Volgorde",
    bestFocus:"Beste fokus tydvenster", eodTitle:"Einde van Dag Besinning",
    eodSub:"'n Eerlike gesprek met jouself.", restWell:"Rus Goed",
    respond:"Reageer eerlik…", addNote:"📝 Nota", followup:"➕ Opvolg",
    aiSugg:"✨ KI Voorstelle", deployPwa:"Laai PWA Pakket Af",
    apiNote:"Nie nodig in Claude.ai nie. Vereis as standalone.",
    noGoals:"Geen doele nie", addGoal:"Voeg Doel By", filters:"Filters",
    planEmpty:"Voeg eers take by, druk dan Beplan",
    tabs:["Lys","Gedaan","Rooster","Gewoontes","Doele","Plan","Statistieke"],
    days:["Ma","Di","Wo","Do","Vr","Sa","So"],
    months:["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Des"],
    HL:{week:"Hierdie Week",month:"Hierdie Maand",year:"Hierdie Jaar","5year":"5 Jaar","10year":"10 Jaar"},
  },
};
const t = (lang, key) => LANG[lang]?.[key] ?? LANG.en[key] ?? key;

// ─── UTILS ────────────────────────────────────────────────────
function normalise(s) { return (s||"").toLowerCase().replace(/\s+/g," ").replace(/[^a-z0-9 ]/g,"").trim(); }
function toISODate(d) { return d.toISOString().slice(0,10); }
function todayStr()   { return toISODate(new Date()); }
function xpForLevel(l){ return Math.floor(100*Math.pow(l,1.6)); }
function levelFromXP(xp){ let l=1; while(xpForLevel(l+1)<=xp) l++; return l; }
function xpGain(task)   { return task.priority==="high"?40:task.priority==="low"?10:20; }
function timeAgo(ts) {
  const s=(Date.now()-new Date(ts).getTime())/1000;
  if(s<60)   return "just now";
  if(s<3600) return Math.floor(s/60)+"m ago";
  if(s<86400)return Math.floor(s/3600)+"h ago";
  return Math.floor(s/86400)+"d ago";
}
function dueStatus(task) {
  if(!task.dueDate) return null;
  const d=(new Date(task.dueDate)-new Date(todayStr()))/86400000;
  if(d<0)   return {label:"Overdue!",   color:"#f87171"};
  if(d===0) return {label:"Due today",  color:"#fbbf24"};
  if(d<=2)  return {label:"Due in "+Math.ceil(d)+"d", color:"#fb923c"};
  return {label:task.dueDate, color:"rgba(128,128,128,.5)"};
}
function nextRecur(dueDate, rec) {
  const d = dueDate ? new Date(dueDate) : new Date();
  if(rec==="daily")   d.setDate(d.getDate()+1);
  if(rec==="weekly")  d.setDate(d.getDate()+7);
  if(rec==="monthly") d.setMonth(d.getMonth()+1);
  if(rec==="yearly")  d.setFullYear(d.getFullYear()+1);
  return toISODate(d);
}
function calcStreak(habit) {
  let s=0, d=new Date();
  const td=todayStr();
  if(!habit.completions?.[td]) d.setDate(d.getDate()-1);
  for(let i=0;i<365;i++) {
    const k=toISODate(d);
    if(!habit.completions?.[k]) break;
    s++; d.setDate(d.getDate()-1);
  }
  return s;
}
function getWeekDays(offset) {
  const d=new Date(), dow=d.getDay();
  const mon=new Date(d);
  mon.setDate(d.getDate()-(dow===0?6:dow-1)+offset*7);
  return Array.from({length:7},(_,i)=>{ const x=new Date(mon); x.setDate(mon.getDate()+i); return x; });
}
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if(!lines.length) return [];
  const hdrs = lines[0].split(",").map(h=>h.replace(/"/g,"").trim().toLowerCase().replace(/[^a-z]/g,""));
  return lines.slice(1).map(line=>{
    const vals=[]; let f="",inQ=false;
    for(let i=0;i<line.length;i++) {
      const c=line[i];
      if(c==='"') { inQ=!inQ; }
      else if(c===","&&!inQ) { vals.push(f.trim()); f=""; }
      else f+=c;
    }
    vals.push(f.trim());
    const o={};
    hdrs.forEach((h,i)=>{ o[h]=(vals[i]||"").replace(/"/g,"").trim(); });
    return o;
  });
}

// ─── STORAGE ──────────────────────────────────────────────────
const db = {
  get: async k => {
    try { if(window.storage) return await window.storage.get(k); } catch(e) {}
    try { const v=localStorage.getItem(k); return v?{value:v}:null; } catch(e) { return null; }
  },
  set: async (k,v) => {
    const s = typeof v==="string" ? v : JSON.stringify(v);
    try { if(window.storage) { await window.storage.set(k,s); return; } } catch(e) {}
    try { localStorage.setItem(k,s); } catch(e) {}
  }
};

// ─── AI ───────────────────────────────────────────────────────
async function aiCall(system, userMsg, history) {
  const msgs = userMsg ? [...(history||[]), {role:"user",content:userMsg}] : (history||[]);
  const key  = localStorage.getItem("fl:apikey")||"";
  const hdrs = {"Content-Type":"application/json"};
  if(key) { hdrs["x-api-key"]=key; hdrs["anthropic-version"]="2023-06-01"; }
  const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:hdrs,
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,system,messages:msgs})});
  const d = await r.json();
  if(d.error) throw new Error(d.error.message||"API error");
  return d.content.map(b=>b.text||"").join("");
}
async function aiJSON(sys,msg) { return JSON.parse((await aiCall(sys,msg)).replace(/```json|```/g,"").trim()); }

// ─── ICS ──────────────────────────────────────────────────────
function parseICS(raw) {
  const evts=[]; let cur=null;
  for(const ln of raw.replace(/\r\n[ \t]/g," ").split(/\r?\n/)) {
    if(ln==="BEGIN:VEVENT") { cur={}; }
    else if(ln==="END:VEVENT"&&cur) { evts.push(cur); cur=null; }
    else if(cur) {
      const ci=ln.indexOf(":"); if(ci<0) continue;
      const k=ln.slice(0,ci).split(";")[0], v=ln.slice(ci+1);
      if(k==="SUMMARY") cur.title=v;
      else if(k==="DTSTART") {
        const s=v.replace("Z","");
        try { cur.start=new Date(s.slice(0,4)+"-"+s.slice(4,6)+"-"+s.slice(6,8)+"T"+(s.slice(9,11)||"00")+":"+(s.slice(11,13)||"00")+":00").toISOString(); } catch(e) {}
      } else if(k==="LOCATION") cur.location=v;
      else if(k==="DESCRIPTION") cur.desc=v.replace(/\\n/g,"\n");
      else if(k==="UID") cur.uid=v;
    }
  }
  return evts.filter(e=>e.title&&e.start).map(e=>Object.assign({},e,{id:e.uid||e.title+e.start}));
}

// ─── PROMPTS ──────────────────────────────────────────────────
const P_ENRICH = `Task enrichment. Raw JSON only:
{"enrichedTitle":"max 60 chars","priority":"high|medium|low","timeEstimate":"e.g. 30 min","category":"Work|Personal|Errands|Health|Learning|Finance|Social|Other","subtasks":["s1","s2","s3"],"relatedItems":["n1","n2"],"energyLevel":"high|medium|low","confidence":0.0}
subtasks: 3-6 concrete steps. relatedItems: 2-4 considerations. confidence: 0-1 float.`;

const P_PLAN = `Productivity coach. Raw JSON only:
{"greeting":"short warm sentence","plan":[{"taskIndex":1,"reason":"one sentence","suggestedTime":"HH:MM"}],"tip":"one tip","focusBlock":"best deep work window"}
Order by urgency+priority. Include ALL tasks.`;

const P_FOLLOWUP  = `Completed task + outcome note. Suggest 2-3 follow-up tasks. Raw JSON: {"suggestions":["t1","t2","t3"]}`;
const P_MILESTONE = `Goal + horizon. Suggest 4-6 milestones. Raw JSON: {"milestones":["m1","m2","m3","m4"]}`;
const P_THERAPIST = `You are a perceptive end-of-day reflection coach — warm but probing.
Rules: ONE question per message. Reference specific tasks. Progression: broad opening → wins → avoided tasks WHY → emotions → life goals alignment. Be direct. Not sycophantic.
After exactly 5 user messages write "REFLECTION:" then 3 paragraphs: patterns, what's working, 3 action items for tomorrow.`;

// ─── PWA ──────────────────────────────────────────────────────
function dlFile(n,c,type){
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([c],{type}));
  a.download=n; document.body.appendChild(a); a.click();
  document.body.removeChild(a); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function downloadPWA(){
  const mf=JSON.stringify({name:"Planloos",short_name:"Planloos",description:"Plan, soort-van.",start_url:"/",display:"standalone",background_color:"#111111",theme_color:"#E53935",icons:[{src:"icon-192.svg",sizes:"192x192",type:"image/svg+xml",purpose:"any maskable"},{src:"icon-512.svg",sizes:"512x512",type:"image/svg+xml",purpose:"any maskable"}]},null,2);
  const sw="const C='pl-v1',S=['./','./index.html'];\nself.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(S)));self.skipWaiting();});\nself.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});\nself.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>{const n=fetch(e.request).then(res=>{if(res.ok){const c=res.clone();caches.open(C).then(ca=>ca.put(e.request,c));}return res;}).catch(()=>r);return r||n;}));});";
  function mkI(sz,rx){ return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 "+sz+" "+sz+"'><rect width='"+sz+"' height='"+sz+"' rx='"+rx+"' fill='#111'/><rect x='"+Math.round(sz*.1)+"' y='"+Math.round(sz*.22)+"' width='"+Math.round(sz*.8)+"' height='"+Math.round(sz*.62)+"' rx='"+Math.round(sz*.08)+"' stroke='white' stroke-width='"+Math.round(sz*.05)+"' fill='none'/><path d='M"+Math.round(sz*.15)+" "+Math.round(sz*.3)+" Q"+Math.round(sz*.4)+" "+Math.round(sz*.15)+" "+Math.round(sz*.5)+" "+Math.round(sz*.28)+" Q"+Math.round(sz*.65)+" "+Math.round(sz*.4)+" "+Math.round(sz*.85)+" "+Math.round(sz*.22)+"' stroke='#E53935' stroke-width='"+Math.round(sz*.07)+"' fill='none' stroke-linecap='round'/></svg>"; }
  const rd="# Planloos\n1. Save this page as index.html\n2. Drag folder to app.netlify.com/drop\n3. Done!\n\nAPI Key: console.anthropic.com";
  [["manifest.json",mf,"application/json"],["sw.js",sw,"application/javascript"],["icon-192.svg",mkI(192,40),"image/svg+xml"],["icon-512.svg",mkI(512,100),"image/svg+xml"],["README.md",rd,"text/markdown"]].forEach(function(arr,i){ setTimeout(function(){ dlFile(arr[0],arr[1],arr[2]); },i*250); });
  setTimeout(function(){ alert("5 files downloaded!\nAlso save this page as index.html.\nDrag all 6 files to app.netlify.com/drop."); },1400);
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────
function Logo({color}) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="26" height="21" rx="3" stroke={color} strokeWidth="2" opacity="0.9"/>
      <line x1="10" y1="4" x2="10" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="4" x2="22" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="3" y1="13" x2="29" y2="13" stroke={color} strokeWidth="1.5" opacity="0.3"/>
      <path d="M4 10 C9 7,14 12,19 9 C23 7,27 10,29 8" stroke="#E53935" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function ConfidenceBar({confidence}) {
  if(confidence==null) return null;
  const pct = Math.round(confidence*100);
  const color = confidence>=.8 ? "#34d399" : confidence>=.5 ? "#fbbf24" : "#f87171";
  return (
    <div title={"AI confidence: "+pct+"%"} style={{display:"flex",alignItems:"center",gap:5,marginTop:4}}>
      <div style={{flex:1,height:3,background:"rgba(128,128,128,.2)",borderRadius:3,overflow:"hidden"}}>
        <div style={{width:pct+"%",height:"100%",background:color,borderRadius:3,transition:"width .4s"}}/>
      </div>
      <span style={{fontSize:10,color:"rgba(128,128,128,.5)",width:28,textAlign:"right"}}>{pct}%</span>
    </div>
  );
}

function EmptyState({icon, title, sub}) {
  return (
    <div style={{textAlign:"center",padding:"48px 20px"}}>
      <div style={{fontSize:40,marginBottom:12,opacity:.25}}>{icon}</div>
      <p style={{color:"rgba(128,128,128,.6)",fontSize:14,fontWeight:600,margin:"0 0 4px"}}>{title}</p>
      {sub && <p style={{color:"rgba(128,128,128,.4)",fontSize:12,margin:0}}>{sub}</p>}
    </div>
  );
}

function ErrBanner({msg, onDismiss}) {
  if(!msg) return null;
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:8,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",borderRadius:12,padding:"10px 14px",marginBottom:12}}>
      <span style={{flexShrink:0}}>⚠️</span>
      <span style={{flex:1,fontSize:12,color:"#f87171",lineHeight:1.5}}>{msg}</span>
      {onDismiss && <button onClick={onDismiss} style={{background:"transparent",border:"none",color:"rgba(248,113,113,.5)",cursor:"pointer",fontSize:13,padding:0}}>✕</button>}
    </div>
  );
}

function InfoBanner({msg}) {
  if(!msg) return null;
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:8,background:"rgba(96,165,250,.08)",border:"1px solid rgba(96,165,250,.2)",borderRadius:12,padding:"10px 14px",marginBottom:10}}>
      <span style={{flexShrink:0}}>ℹ️</span>
      <span style={{fontSize:12,color:"rgba(96,165,250,.85)",lineHeight:1.5}}>{msg}</span>
    </div>
  );
}

function OptionCard({selected, onClick, icon, label, ac}) {
  const borderColor = selected ? ac : "rgba(128,128,128,.2)";
  const bgColor     = selected ? ac+"15" : "transparent";
  const textColor   = selected ? ac : "rgba(128,128,128,.6)";
  return (
    <button type="button" onClick={onClick} style={{flex:1,textAlign:"left",borderRadius:12,border:"1px solid "+borderColor,padding:"9px 12px",background:bgColor,cursor:"pointer",transition:"all .15s"}}>
      <div style={{fontSize:18,marginBottom:3}}>{icon}</div>
      <div style={{fontSize:12,fontWeight:700,color:textColor}}>{label}</div>
    </button>
  );
}

// ─── FIELD EDITOR ─────────────────────────────────────────────
function FieldEditor({type, value, onSave, onClose, ac}) {
  const [val, setVal] = useState(value||"");
  const ref = useRef();
  useEffect(function() {
    function handler(e) { if(ref.current && !ref.current.contains(e.target)) onClose(); }
    setTimeout(function(){ document.addEventListener("mousedown", handler); }, 0);
    return function() { document.removeEventListener("mousedown", handler); };
  }, [onClose]);
  function save(v) { onSave(v); onClose(); }

  const box = {position:"absolute",zIndex:300,top:"calc(100% + 6px)",left:0,background:"#1a1a1a",border:"1px solid "+ac+"40",borderRadius:14,padding:10,minWidth:175,boxShadow:"0 8px 32px rgba(0,0,0,.7)"};

  if(type==="priority") return (
    <div ref={ref} style={box}>
      {Object.entries(PRI).map(function(entry) {
        const k=entry[0], p=entry[1];
        return <button key={k} onClick={function(){ save(k); }} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:10,border:"none",cursor:"pointer",width:"100%",background:val===k?"rgba(255,255,255,.1)":"transparent",color:p.color,fontWeight:700,fontSize:13}}>{p.icon} {p.label}</button>;
      })}
    </div>
  );

  if(type==="category") return (
    <div ref={ref} style={box}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
        {CATS.map(function(c) {
          return <button key={c} onClick={function(){ save(c); }} style={{padding:"6px 8px",borderRadius:10,border:"none",cursor:"pointer",background:val===c?"rgba(255,255,255,.1)":"transparent",color:val===c?"#fff":"rgba(255,255,255,.6)",fontWeight:600,fontSize:11,textAlign:"left"}}>{CE[c]} {c}</button>;
        })}
      </div>
    </div>
  );

  if(type==="time") return (
    <div ref={ref} style={box}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,marginBottom:4}}>
        {TP.map(function(p) {
          return <button key={p} onClick={function(){ save(p); }} style={{padding:"4px 6px",borderRadius:7,border:"none",cursor:"pointer",background:val===p?ac+"30":"rgba(255,255,255,.06)",color:val===p?ac:"rgba(255,255,255,.6)",fontWeight:600,fontSize:11}}>{p}</button>;
        })}
      </div>
      <div style={{display:"flex",gap:4}}>
        <input value={val} onChange={function(e){ setVal(e.target.value); }} placeholder="Custom…" onKeyDown={function(e){ if(e.key==="Enter") save(val); }} style={{flex:1,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",borderRadius:7,padding:"4px 8px",color:"#fff",fontSize:12,outline:"none"}}/>
        <button onClick={function(){ save(val); }} style={{padding:"4px 10px",borderRadius:7,background:ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>✓</button>
      </div>
    </div>
  );

  if(type==="dueDate") return (
    <div ref={ref} style={box}>
      <input type="date" value={val} onChange={function(e){ setVal(e.target.value); }} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,padding:"6px 10px",color:"#fff",fontSize:13,outline:"none",width:"100%",marginBottom:6}}/>
      <div style={{display:"flex",gap:4}}>
        <button onClick={function(){ save(val); }} style={{flex:1,padding:"6px",borderRadius:8,background:ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>Set</button>
        <button onClick={function(){ save(""); }} style={{padding:"6px 10px",borderRadius:8,background:"rgba(255,255,255,.07)",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:12}}>Clear</button>
      </div>
    </div>
  );

  if(type==="recurring") return (
    <div ref={ref} style={box}>
      {[null,"daily","weekly","monthly","yearly"].map(function(r) {
        const label = r ? "🔁 "+r[0].toUpperCase()+r.slice(1) : "❌ One-time";
        return <button key={String(r)} onClick={function(){ save(r); }} style={{display:"block",width:"100%",padding:"7px 12px",borderRadius:10,border:"none",cursor:"pointer",background:val===(r||null)?"rgba(255,255,255,.1)":"transparent",color:"rgba(255,255,255,.8)",fontWeight:600,fontSize:13,textAlign:"left"}}>{label}</button>;
      })}
    </div>
  );

  return null;
}

// ─── CHIP ─────────────────────────────────────────────────────
function Chip({taskId, field, children, chipStyle, tasks, updTask, T}) {
  const [open, setOpen] = useState(false);
  const task = tasks.find(function(x){ return x.id===taskId; });
  function getVal() {
    if(!task) return "";
    if(field==="dueDate")   return task.dueDate;
    if(field==="recurring") return task.recurring;
    if(field==="time")      return task.timeEstimate;
    if(field==="category")  return task.category;
    return task.priority;
  }
  function handleSave(v) {
    const patch = {};
    patch[field==="time" ? "timeEstimate" : field] = v;
    updTask(taskId, patch);
  }
  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <button onClick={function(e){ e.stopPropagation(); setOpen(function(p){ return !p; }); }} style={Object.assign({fontSize:11,padding:"2px 9px",borderRadius:20,border:"1px solid rgba(128,128,128,.25)",cursor:"pointer",fontWeight:700,outline:open?"2px solid "+T.ac+"50":"none"},chipStyle)}>
        {children} ✎
      </button>
      {open && <FieldEditor type={field} value={getVal()} onSave={handleSave} onClose={function(){ setOpen(false); }} ac={T.ac}/>}
    </div>
  );
}

// ─── OUTCOME PANEL ────────────────────────────────────────────
function OutcomePanel({task, onSaveNote, onAddFollowUp, onClose, T, lang}) {
  const [note, setNote]   = useState(task.note||"");
  const [mode, setMode]   = useState("note");
  const [ft,   setFt]     = useState("");
  const [sugg, setSugg]   = useState([]);
  const [load, setLoad]   = useState(false);
  const [err,  setErr]    = useState("");

  async function loadSugg() {
    setLoad(true); setErr("");
    try {
      const r = await aiJSON(P_FOLLOWUP, 'Task:"'+(task.enrichedTitle||task.title)+'" Note:"'+note+'"');
      setSugg(r.suggestions||[]);
    } catch(e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoad(false); }
  }

  const panelStyle = {marginTop:12,background:T.ac+"0D",border:"1px solid "+T.ac+"30",borderRadius:14,padding:14};
  const tabStyle   = function(active) { return {flex:1,padding:"6px 0",borderRadius:10,border:"1px solid "+(active?T.ac+"60":"rgba(128,128,128,.2)"),background:active?T.ac+"15":"transparent",color:active?T.ac:"rgba(128,128,128,.6)",fontWeight:700,fontSize:12,cursor:"pointer"}; };
  const btnPrimary = {flex:1,padding:"7px 0",borderRadius:10,background:"linear-gradient(135deg,"+T.ac+","+T.a2+")",border:"none",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"};
  const btnCancel  = {padding:"7px 14px",borderRadius:10,background:"rgba(128,128,128,.1)",border:"none",color:"rgba(128,128,128,.6)",fontWeight:700,fontSize:13,cursor:"pointer"};

  return (
    <div style={panelStyle}>
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        <button onClick={function(){ setMode("note"); }} style={tabStyle(mode==="note")}>{t(lang,"addNote")}</button>
        <button onClick={function(){ setMode("followup"); }} style={tabStyle(mode==="followup")}>{t(lang,"followup")}</button>
      </div>
      <ErrBanner msg={err} onDismiss={function(){ setErr(""); }}/>
      {mode==="note" && (
        <div>
          <textarea value={note} onChange={function(e){ setNote(e.target.value); }} placeholder="How did it go?" style={{width:"100%",minHeight:70,background:"rgba(255,255,255,.05)",border:"1px solid rgba(128,128,128,.2)",borderRadius:10,padding:"8px 12px",color:"#fff",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <button onClick={function(){ onSaveNote(note); onClose(); }} style={btnPrimary}>{t(lang,"save")}</button>
            <button onClick={onClose} style={btnCancel}>{t(lang,"cancel")}</button>
          </div>
        </div>
      )}
      {mode==="followup" && (
        <div>
          <div style={{display:"flex",gap:6,marginBottom:8}}>
            <input value={ft} onChange={function(e){ setFt(e.target.value); }} placeholder="Describe follow-up…" style={{flex:1,background:"rgba(255,255,255,.05)",border:"1px solid rgba(128,128,128,.2)",borderRadius:10,padding:"8px 12px",color:"#fff",fontSize:13,outline:"none"}}
              onKeyDown={function(e){ if(e.key==="Enter"&&ft.trim()){ onAddFollowUp(ft); onSaveNote(note); onClose(); } }}/>
            <button onClick={function(){ if(ft.trim()){ onAddFollowUp(ft); onSaveNote(note); onClose(); } }} style={{padding:"7px 14px",borderRadius:10,background:T.ac,border:"none",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>Add</button>
          </div>
          <button onClick={function(){ if(!sugg.length) loadSugg(); }} disabled={load} style={{width:"100%",padding:"7px 0",borderRadius:10,background:"rgba(249,168,37,.1)",border:"1px solid rgba(249,168,37,.25)",color:"#F9A825",fontWeight:700,fontSize:12,cursor:"pointer"}}>{load ? "…" : t(lang,"aiSugg")}</button>
          {sugg.length>0 && (
            <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:5}}>
              {sugg.map(function(s,i) {
                return <div key={i} onClick={function(){ onAddFollowUp(s); onSaveNote(note); onClose(); }} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"rgba(255,255,255,.04)",borderRadius:9,cursor:"pointer",border:"1px solid rgba(128,128,128,.15)"}}><span style={{color:T.ac}}>+</span><span style={{fontSize:13,color:"rgba(255,255,255,.75)"}}>{s}</span></div>;
              })}
            </div>
          )}
          <button onClick={onClose} style={{width:"100%",marginTop:8,padding:"6px 0",borderRadius:10,background:"transparent",border:"none",color:"rgba(128,128,128,.4)",fontWeight:600,fontSize:12,cursor:"pointer"}}>{t(lang,"cancel")}</button>
        </div>
      )}
    </div>
  );
}

// ─── FILTER PANEL ─────────────────────────────────────────────
function FilterPanel({filters, setFilters, allTimes, allCats, T, lang}) {
  const [open, setOpen] = useState(false);
  const cnt = Object.values(filters).filter(function(v){ return v!=="All"; }).length;
  return (
    <div style={{marginBottom:12}}>
      <button onClick={function(){ setOpen(function(p){ return !p; }); }} style={{background:cnt>0?T.ac+"20":"rgba(128,128,128,.08)",border:"1px solid "+(cnt>0?T.ac+"50":"rgba(128,128,128,.2)"),borderRadius:20,padding:"5px 14px",color:cnt>0?T.ac:"rgba(128,128,128,.6)",fontSize:12,fontWeight:700,cursor:"pointer"}}>
        {open?"▲":"▼"} {t(lang,"filters")}{cnt>0?" ("+cnt+")":""}
        {cnt>0 && <span onClick={function(e){ e.stopPropagation(); setFilters({priority:"All",category:"All",time:"All"}); }} style={{marginLeft:8,opacity:.7}}>✕</span>}
      </button>
      {open && (
        <div style={{background:"rgba(0,0,0,.3)",border:"1px solid rgba(128,128,128,.15)",borderRadius:16,padding:14,marginTop:8}}>
          {[["Priority",["All","high","medium","low"],"priority"],["Category",allCats,"category"],["Time",allTimes,"time"]].map(function(row, gi) {
            const lbl=row[0], opts=row[1], key=row[2];
            return (
              <div key={key} style={{marginBottom:gi<2?10:0}}>
                <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>{lbl}</p>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {opts.map(function(v) {
                    const p     = key==="priority" && v!=="All" ? PRI[v] : null;
                    const active= filters[key]===v;
                    let label   = v;
                    if(p)                          label = p.icon+" "+p.label;
                    else if(v==="All")             label = "All";
                    else if(key==="time")          label = "⏱ "+v;
                    else if(key==="category"&&v!=="All") label = (CE[v]||"")+" "+v;
                    return <button key={v} onClick={function(){ setFilters(function(f){ const n=Object.assign({},f); n[key]=v; return n; }); }} style={{padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:700,cursor:"pointer",border:"1px solid "+(active?(p?p.color:T.ac+"80"):"rgba(128,128,128,.2)"),background:active?(p?p.bg:T.ac+"20"):"rgba(128,128,128,.05)",color:active?(p?p.color:T.ac):"rgba(128,128,128,.6)"}}>{label}</button>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── POMO OVERLAY ─────────────────────────────────────────────
function PomoOverlay({pomo, task, T, onToggle, onStop, onSkip, pomoDur, breakDur}) {
  if(!pomo) return null;
  const m   = String(Math.floor(pomo.remaining/60)).padStart(2,"0");
  const s   = String(pomo.remaining%60).padStart(2,"0");
  const dur = (pomo.phase==="work" ? pomoDur : breakDur)*60;
  const pct = ((dur-pomo.remaining)/dur)*100;
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:250,background:"#1a1a1a",border:"2px solid "+T.ac,borderRadius:20,padding:16,width:220,boxShadow:"0 8px 32px rgba(0,0,0,.8),0 0 20px "+T.ac+"30"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:12,fontWeight:700,color:pomo.phase==="work"?T.ac:"#34d399"}}>{pomo.phase==="work"?"🍅 Focus":"☕ Break"} · {pomo.sessions}</span>
        <button onClick={onStop} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:13}}>✕</button>
      </div>
      {task && <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:8,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>📌 {task.enrichedTitle||task.title}</div>}
      <div style={{fontSize:38,fontWeight:900,textAlign:"center",color:"#fff",letterSpacing:3,marginBottom:10}}>{m}:{s}</div>
      <div style={{height:4,background:"rgba(255,255,255,.1)",borderRadius:4,overflow:"hidden",marginBottom:12}}>
        <div style={{width:pct+"%",height:"100%",background:T.ac,borderRadius:4,transition:"width 1s linear"}}/>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={onToggle} style={{flex:1,padding:"8px 0",borderRadius:10,background:T.ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>{pomo.active?"⏸ Pause":"▶ Resume"}</button>
        <button onClick={onSkip}   style={{padding:"8px 10px",borderRadius:10,background:"rgba(255,255,255,.07)",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:12}}>Skip</button>
      </div>
    </div>
  );
}

// ─── EOD MODAL ────────────────────────────────────────────────
function EODModal({msgs, input, setInput, onSend, onClose, loading, done, T, lang}) {
  const scrollRef = useRef();
  useEffect(function(){ if(scrollRef.current) scrollRef.current.scrollTo({top:99999,behavior:"smooth"}); }, [msgs]);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:20,backdropFilter:"blur(10px)"}}>
      <div style={{background:"#111",borderRadius:24,width:"100%",maxWidth:520,maxHeight:"88vh",display:"flex",flexDirection:"column",border:"2px solid "+T.ac,boxShadow:"0 20px 60px rgba(0,0,0,.8)"}}>
        <div style={{padding:"18px 22px 14px",borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2 style={{margin:0,fontSize:19,fontWeight:900,color:T.ac}}>🌙 {t(lang,"eodTitle")}</h2>
            <p style={{margin:"2px 0 0",fontSize:12,color:"rgba(255,255,255,.4)"}}>{t(lang,"eodSub")}</p>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.3)",cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:22,display:"flex",flexDirection:"column",gap:14}}>
          {loading && msgs.length===0 && <div style={{textAlign:"center",padding:40}}><div style={{fontSize:32,display:"inline-block",animation:"spin 1.5s linear infinite",marginBottom:12}}>🌙</div><p style={{color:"rgba(255,255,255,.4)",margin:0}}>Preparing…</p></div>}
          {msgs.filter(function(m){ return !m.hidden; }).map(function(m,i) {
            const isRef = m.role==="assistant" && m.text.includes("REFLECTION:");
            const txt   = isRef ? m.text.replace("REFLECTION:","").trim() : m.text;
            const isUser= m.role==="user";
            return (
              <div key={i} style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"86%",background:isUser?T.ac+"30":"rgba(255,255,255,.06)",borderRadius:isUser?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"12px 16px",border:"1px solid "+(isUser?T.ac+"40":"rgba(255,255,255,.08)")}}>
                  {isRef && <p style={{margin:"0 0 8px",fontSize:11,fontWeight:700,color:T.ac,textTransform:"uppercase",letterSpacing:1}}>✦ Reflection</p>}
                  <p style={{margin:0,fontSize:14,lineHeight:1.7,color:"rgba(255,255,255,.85)",whiteSpace:"pre-wrap"}}>{txt}</p>
                </div>
              </div>
            );
          })}
          {loading && msgs.length>0 && (
            <div style={{display:"flex",gap:5}}>
              {[0,1,2].map(function(i){ return <div key={i} style={{width:8,height:8,borderRadius:"50%",background:T.ac,animation:"bounce .8s "+(i*.15)+"s infinite ease-in-out"}}/>; })}
            </div>
          )}
        </div>
        {!done && (
          <div style={{padding:"14px 22px",borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",gap:8}}>
            <input value={input} onChange={function(e){ setInput(e.target.value); }} onKeyDown={function(e){ if(e.key==="Enter"&&!e.shiftKey) onSend(); }} placeholder={t(lang,"respond")} disabled={loading} style={{flex:1,background:"rgba(255,255,255,.05)",border:"1px solid "+T.ac+"40",borderRadius:14,padding:"10px 16px",color:"#fff",fontSize:14,outline:"none"}}/>
            <button onClick={onSend} disabled={!input.trim()||loading} style={{padding:"10px 18px",borderRadius:14,background:T.ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:15}}>→</button>
          </div>
        )}
        {done && (
          <div style={{padding:"14px 22px",borderTop:"1px solid rgba(255,255,255,.08)",textAlign:"center"}}>
            <button onClick={onClose} style={{padding:"12px 32px",borderRadius:14,background:T.ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:15}}>✓ {t(lang,"restWell")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HABIT MODAL ──────────────────────────────────────────────
function HabitModal({existing, onSave, onClose, T, lang}) {
  const [form, setForm] = useState(existing||{title:"",icon:"🙏",color:"#E53935",frequency:"daily"});
  function set(p) { setForm(function(f){ return Object.assign({},f,p); }); }
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20,backdropFilter:"blur(6px)"}}>
      <div onClick={function(e){ e.stopPropagation(); }} style={{background:"#1a1a1a",borderRadius:24,padding:24,maxWidth:380,width:"100%",border:"2px solid "+T.ac}}>
        <h3 style={{margin:"0 0 18px",fontSize:17,fontWeight:900,color:"#fff"}}>{existing ? "Edit Habit" : t(lang,"addHabit")}</h3>
        <input value={form.title} onChange={function(e){ set({title:e.target.value}); }} placeholder="Habit name…" style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid "+T.ac+"50",borderRadius:10,padding:"9px 14px",color:"#fff",fontSize:14,outline:"none",marginBottom:14}}/>
        <p style={{margin:"0 0 8px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>Icon</p>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
          {HABIT_ICONS.map(function(ic) {
            return <button key={ic} onClick={function(){ set({icon:ic}); }} style={{width:36,height:36,borderRadius:10,border:"2px solid "+(form.icon===ic?T.ac:"rgba(128,128,128,.2)"),background:form.icon===ic?T.ac+"20":"transparent",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{ic}</button>;
          })}
        </div>
        <p style={{margin:"0 0 8px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>Color</p>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {HABIT_COLORS.map(function(c) {
            return <button key={c} onClick={function(){ set({color:c}); }} style={{width:28,height:28,borderRadius:"50%",background:c,border:"3px solid "+(form.color===c?"#fff":"transparent"),cursor:"pointer"}}/>;
          })}
        </div>
        <p style={{margin:"0 0 8px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>Frequency</p>
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {[["daily","Daily"],["weekdays","Weekdays"],["weekends","Weekends"]].map(function(pair) {
            const k=pair[0], l=pair[1];
            return <button key={k} onClick={function(){ set({frequency:k}); }} style={{flex:1,padding:"7px 0",borderRadius:10,border:"1px solid "+(form.frequency===k?T.ac+"80":"rgba(128,128,128,.2)"),background:form.frequency===k?T.ac+"15":"transparent",color:form.frequency===k?T.ac:"rgba(128,128,128,.6)",fontWeight:700,fontSize:12,cursor:"pointer"}}>{l}</button>;
          })}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button disabled={!form.title.trim()} onClick={function(){ if(form.title.trim()) onSave(Object.assign({},form,{id:existing?existing.id:Date.now(),completions:existing?existing.completions:{},createdAt:existing?existing.createdAt:new Date().toISOString()})); }} style={{flex:1,padding:12,borderRadius:14,background:T.ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>{t(lang,"save")}</button>
          <button onClick={onClose} style={{padding:"12px 16px",borderRadius:14,background:"rgba(128,128,128,.1)",border:"none",color:"rgba(128,128,128,.6)",fontWeight:700,cursor:"pointer",fontSize:14}}>{t(lang,"cancel")}</button>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS MODAL ───────────────────────────────────────────
function SettingsModal({cfg, onSave, onClose, T, lang}) {
  const [form,   setForm]   = useState(cfg);
  const [apiKey, setApiKey] = useState(localStorage.getItem("fl:apikey")||"");
  const [showKey,setShowKey]= useState(false);
  function set(p) { setForm(function(f){ return Object.assign({},f,p); }); }
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20,backdropFilter:"blur(6px)"}}>
      <div onClick={function(e){ e.stopPropagation(); }} style={{background:"#111",borderRadius:24,padding:26,maxWidth:440,width:"100%",border:"2px solid "+T.ac,maxHeight:"92vh",overflowY:"auto"}}>
        <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:900,color:T.ac}}>⚙️ {t(lang,"settings")}</h2>
        <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>{t(lang,"language")}</p>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          <OptionCard selected={form.lang==="en"} onClick={function(){ set({lang:"en"}); }} icon="🇬🇧" label="English"   ac={T.ac}/>
          <OptionCard selected={form.lang==="af"} onClick={function(){ set({lang:"af"}); }} icon="🇿🇦" label="Afrikaans" ac={T.ac}/>
        </div>
        <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>{t(lang,"theme")}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:20}}>
          {Object.entries(THEMES).map(function(entry) {
            const k=entry[0], th=entry[1];
            return <OptionCard key={k} selected={form.theme===k} onClick={function(){ set({theme:k}); }} icon={k==="planloos"?"◉":k==="light"?"○":k==="cosmic"?"✦":"🌊"} label={th.name} ac={T.ac}/>;
          })}
        </div>
        <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>{t(lang,"energy")}</p>
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          <OptionCard selected={form.energy==="morning"}   onClick={function(){ set({energy:"morning"}); }}   icon="☀️" label={t(lang,"morning")}   ac={T.ac}/>
          <OptionCard selected={form.energy==="afternoon"} onClick={function(){ set({energy:"afternoon"}); }} icon="🌤" label={t(lang,"afternoon")} ac={T.ac}/>
          <OptionCard selected={form.energy==="evening"}   onClick={function(){ set({energy:"evening"}); }}   icon="🌙" label={t(lang,"evening")}   ac={T.ac}/>
        </div>
        <p style={{margin:"0 0 10px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>Pomodoro</p>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          {[["pomoDur","🍅 Focus (min)"],["breakDur","☕ Break (min)"]].map(function(pair) {
            const k=pair[0], l=pair[1];
            return (
              <div key={k} style={{flex:1}}>
                <label style={{fontSize:12,color:"rgba(128,128,128,.5)",display:"block",marginBottom:4}}>{l}</label>
                <input type="number" value={form[k]} onChange={function(e){ set(Object.assign({},function(p){ const o={}; o[k]=Number(e.target.value)||1; return o; }())); }} min={1} max={120} style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid "+T.ac+"40",borderRadius:8,padding:"7px 10px",color:"#fff",fontSize:15,outline:"none"}}/>
              </div>
            );
          })}
        </div>
        <p style={{margin:"0 0 4px",fontSize:11,fontWeight:700,color:"rgba(128,128,128,.5)",textTransform:"uppercase",letterSpacing:1}}>API Key</p>
        <InfoBanner msg={t(lang,"apiNote")}/>
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          <input type={showKey?"text":"password"} value={apiKey} onChange={function(e){ setApiKey(e.target.value); }} placeholder="sk-ant-…" style={{flex:1,background:"rgba(255,255,255,.06)",border:"1px solid "+T.ac+"40",borderRadius:10,padding:"8px 12px",color:"#fff",fontSize:13,outline:"none"}}/>
          <button onClick={function(){ setShowKey(function(p){ return !p; }); }} style={{padding:"8px 10px",borderRadius:10,background:"rgba(255,255,255,.06)",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:12}}>{showKey?"🙈":"👁"}</button>
          <button onClick={function(){ localStorage.setItem("fl:apikey",apiKey); }} style={{padding:"8px 14px",borderRadius:10,background:T.ac+"30",border:"1px solid "+T.ac+"50",color:T.ac,fontWeight:700,cursor:"pointer",fontSize:12}}>Save</button>
        </div>
        <button onClick={downloadPWA} style={{width:"100%",padding:"11px 0",borderRadius:12,background:"rgba(255,255,255,.05)",border:"1px solid "+T.ac+"50",color:T.ac,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:12}}>📦 {t(lang,"deployPwa")}</button>
        <button onClick={function(){ onSave(form); onClose(); }} style={{width:"100%",padding:12,borderRadius:14,background:T.ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>{t(lang,"save")}</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function Planloos() {
  const [tasks,    setTasks]    = useState([]);
  const [goals,    setGoals]    = useState([]);
  const [events,   setEvents]   = useState([]);
  const [habits,   setHabits]   = useState([]);
  const [calFeeds, setCalFeeds] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [stats,    setStats]    = useState({xp:0,streakDays:0,lastDate:null,history:{}});
  const [cfg,      setCfg]      = useState({theme:"planloos",energy:"morning",pomoDur:25,breakDur:5,lang:"en"});

  const [input,      setInput]      = useState("");
  const [expanded,   setExpanded]   = useState(null);
  const [outcomeId,  setOutcomeId]  = useState(null);
  const [tab,        setTab]        = useState("tasks");
  const [horizon,    setHorizon]    = useState("week");
  const [plan,       setPlan]       = useState(null);
  const [planLoad,   setPlanLoad]   = useState(false);
  const [planErr,    setPlanErr]    = useState("");
  const [search,     setSearch]     = useState("");
  const [searchD,    setSearchD]    = useState("");
  const [filts,      setFilts]      = useState({priority:"All",category:"All",time:"All"});
  const [filtsD,     setFiltsD]     = useState({priority:"All",category:"All",time:"All"});
  const [pomo,       setPomo]       = useState(null);
  const pomoRef                     = useRef(null);
  const [eodOpen,    setEodOpen]    = useState(false);
  const [eodMsgs,    setEodMsgs]    = useState([]);
  const [eodIn,      setEodIn]      = useState("");
  const [eodLoad,    setEodLoad]    = useState(false);
  const [eodDone,    setEodDone]    = useState(false);
  const eodCount                    = useRef(0);
  const [newGoal,    setNewGoal]    = useState("");
  const [addingGoal, setAddingGoal] = useState(false);
  const [newMs,      setNewMs]      = useState({});
  const [msLoad,     setMsLoad]     = useState(null);
  const [settings,   setSettings]   = useState(false);
  const [habitModal, setHabitModal] = useState(null);
  const [feedInput,  setFeedInput]  = useState("");
  const [feedLoad,   setFeedLoad]   = useState(false);
  const [feedErr,    setFeedErr]    = useState("");
  const [pasteMode,  setPasteMode]  = useState(false);
  const [pasteText,  setPasteText]  = useState("");
  const [pasteName,  setPasteName]  = useState("");
  const [calErr,     setCalErr]     = useState("");
  const [csvErr,     setCsvErr]     = useState("");
  const [weekOff,    setWeekOff]    = useState(0);

  const lang = cfg.lang||"en";
  const T    = THEMES[cfg.theme]||THEMES.planloos;

  // Storage load
  useEffect(function() {
    (async function() {
      try {
        const keys=["fl:tasks","fl:goals","fl:events","fl:habits","fl:stats","fl:cfg","fl:feeds","fl:audit"];
        const res=await Promise.all(keys.map(function(k){ return db.get(k); }));
        if(res[0]&&res[0].value) setTasks(JSON.parse(res[0].value));
        else {
          const old=await db.get("flowlist:tasks");
          if(old&&old.value) { const m=JSON.parse(old.value); setTasks(m); db.set("fl:tasks",JSON.stringify(m)); }
        }
        if(res[1]&&res[1].value) setGoals(JSON.parse(res[1].value));
        if(res[2]&&res[2].value) setEvents(JSON.parse(res[2].value));
        if(res[3]&&res[3].value) setHabits(JSON.parse(res[3].value));
        if(res[4]&&res[4].value) setStats(JSON.parse(res[4].value));
        if(res[5]&&res[5].value) setCfg(function(p){ return Object.assign({},p,JSON.parse(res[5].value)); });
        if(res[6]&&res[6].value) setCalFeeds(JSON.parse(res[6].value));
        if(res[7]&&res[7].value) setAuditLog(JSON.parse(res[7].value));
      } catch(e) {}
    })();
  }, []);

  function sv(k,v) { db.set(k, JSON.stringify(v)); }
  function sT(u) { setTasks(u);    sv("fl:tasks",u); }
  function sG(u) { setGoals(u);    sv("fl:goals",u); }
  function sE(u) { setEvents(u);   sv("fl:events",u); }
  function sH(u) { setHabits(u);   sv("fl:habits",u); }
  function sSt(u){ setStats(u);    sv("fl:stats",u); }
  function sFd(u){ setCalFeeds(u); sv("fl:feeds",u); }
  function updTask(id, p) { sT(tasks.map(function(t){ return t.id===id ? Object.assign({},t,p) : t; })); }

  function logEvent(desc, meta) {
    const ev={id:Date.now(),description:desc,metadata:meta||{},ts:new Date().toISOString()};
    setAuditLog(function(prev) {
      const next=[ev,...prev].slice(0,200);
      db.set("fl:audit",JSON.stringify(next));
      return next;
    });
  }

  function award(task, st) {
    const td=todayStr();
    const hist=Object.assign({},st.history);
    hist[td]=(hist[td]||0)+1;
    const yest=toISODate(new Date(Date.now()-86400000));
    const streak=st.lastDate===td?st.streakDays:st.lastDate===yest?st.streakDays+1:1;
    const ns=Object.assign({},st,{xp:st.xp+xpGain(task),history:hist,streakDays:streak,lastDate:td});
    sSt(ns); return ns;
  }

  async function addTask(txt_o) {
    const txt=(txt_o||input).trim(); if(!txt) return;
    const id=Date.now();
    const blank={id,title:txt,enrichedTitle:null,completed:false,enriched:false,enriching:false,enrichFailed:false,priority:"medium",timeEstimate:null,category:"Other",subtasks:[],subtasksDone:[],relatedItems:[],note:"",dueDate:null,recurring:null,energyLevel:"medium",confidence:null,normalisedKey:normalise(txt)};
    const nxt=[blank,...tasks];
    sT(nxt); setInput("");
    logEvent("Task added", {taskTitle:txt});
    sT(nxt.map(function(tk){ return tk.id!==id ? tk : Object.assign({},tk,{enriching:true}); }));
    try {
      const afSuffix = lang==="af" ? "\nRespond with enrichedTitle in Afrikaans if task is in Afrikaans." : "";
      const e = await aiJSON(P_ENRICH+afSuffix, txt);
      const patch = {enriching:false,enriched:true,enrichFailed:false,enrichedTitle:e.enrichedTitle||txt,priority:e.priority||"medium",timeEstimate:e.timeEstimate||null,category:e.category||"Other",subtasks:e.subtasks||[],subtasksDone:(e.subtasks||[]).map(function(){ return false; }),relatedItems:e.relatedItems||[],energyLevel:e.energyLevel||"medium",confidence:typeof e.confidence==="number"?e.confidence:null,normalisedKey:normalise(e.enrichedTitle||txt)};
      sT(nxt.map(function(tk){ return tk.id!==id ? tk : Object.assign({},tk,patch); }));
      logEvent("AI enriched task", {taskTitle:e.enrichedTitle||txt, confidence:e.confidence});
    } catch(err) {
      sT(nxt.map(function(tk){ return tk.id!==id ? tk : Object.assign({},tk,{enriching:false,enriched:true,enrichFailed:true}); }));
      logEvent("Enrichment failed", {taskTitle:txt, error:err instanceof Error?err.message:"Failed"});
    }
  }

  function toggle(id) {
    const task=tasks.find(function(tk){ return tk.id===id; }); if(!task) return;
    const nowDone=!task.completed;
    if(nowDone) {
      award(task,stats);
      let nxt;
      if(task.recurring) {
        const newT=Object.assign({},task,{id:Date.now(),completed:false,dueDate:nextRecur(task.dueDate,task.recurring)});
        nxt=[newT,...tasks.map(function(tk){ return tk.id===id ? Object.assign({},tk,{completed:true}) : tk; })];
      } else {
        nxt=tasks.map(function(tk){ return tk.id===id ? Object.assign({},tk,{completed:true}) : tk; });
      }
      sT(nxt); setOutcomeId(id); setTab("tasks");
      logEvent("Task completed", {taskTitle:task.enrichedTitle||task.title});
    } else {
      sT(tasks.map(function(tk){ return tk.id===id ? Object.assign({},tk,{completed:false}) : tk; }));
      setOutcomeId(null);
    }
  }

  function delTask(id) {
    const task=tasks.find(function(tk){ return tk.id===id; });
    sT(tasks.filter(function(tk){ return tk.id!==id; }));
    if(expanded===id) setExpanded(null);
    if(task) logEvent("Task deleted", {taskTitle:task.enrichedTitle||task.title});
  }

  function tglSub(id, i) {
    sT(tasks.map(function(tk) {
      if(tk.id!==id) return tk;
      const d=[...tk.subtasksDone]; d[i]=!d[i];
      return Object.assign({},tk,{subtasksDone:d});
    }));
  }

  // Pomodoro
  useEffect(function() {
    if(!pomo||!pomo.active) { clearInterval(pomoRef.current); return; }
    pomoRef.current=setInterval(function() {
      setPomo(function(p) {
        if(!p) return null;
        if(p.remaining<=1) {
          const iW=p.phase==="work";
          if(iW) logEvent("Pomodoro session done", {sessions:p.sessions+1});
          return Object.assign({},p,{phase:iW?"break":"work",remaining:iW?(cfg.breakDur||5)*60:(cfg.pomoDur||25)*60,active:false,sessions:p.sessions+(iW?1:0)});
        }
        return Object.assign({},p,{remaining:p.remaining-1});
      });
    }, 1000);
    return function(){ clearInterval(pomoRef.current); };
  }, [pomo&&pomo.active]);

  function startPomo(id)  { setPomo({taskId:id,phase:"work",remaining:(cfg.pomoDur||25)*60,sessions:0,active:true}); }
  function tglPomo()      { setPomo(function(p){ return p ? Object.assign({},p,{active:!p.active}) : p; }); }
  function stopPomo()     { clearInterval(pomoRef.current); setPomo(null); }
  function skipPomo()     { setPomo(function(p){ return p ? Object.assign({},p,{phase:p.phase==="work"?"break":"work",remaining:p.phase==="work"?cfg.breakDur*60:cfg.pomoDur*60,active:false}) : p; }); }

  // Plan
  async function planDay(force) {
    const pnd=tasks.filter(function(tk){ return !tk.completed; }); if(!pnd.length) return;
    setTab("plan"); if(plan&&!force) return;
    setPlan(null); setPlanErr(""); setPlanLoad(true);
    try {
      const list=pnd.map(function(tk,i){ return (i+1)+". "+(tk.enrichedTitle||tk.title)+" | pri:"+tk.priority+" | est:"+(tk.timeEstimate||"?")+" | due:"+(tk.dueDate||"none"); }).join("\n");
      const afSuffix=lang==="af"?"\nRespond in Afrikaans.":"";
      const r=await aiJSON(P_PLAN+"\nUser peak energy: "+cfg.energy+afSuffix, list);
      setPlan(Object.assign({},r,{tasks:pnd}));
      logEvent("Day plan generated", {taskCount:pnd.length});
    } catch(err) { setPlanErr(err instanceof Error?err.message:"Failed to generate plan"); }
    finally { setPlanLoad(false); }
  }

  // EOD
  async function startEOD() {
    setEodOpen(true); setEodMsgs([]); setEodDone(false); setEodLoad(true); eodCount.current=0;
    const ctx="Completed: "+(tasks.filter(function(tk){ return tk.completed; }).map(function(tk){ return tk.enrichedTitle||tk.title; }).join(", ")||"none")+". Pending: "+(tasks.filter(function(tk){ return !tk.completed; }).map(function(tk){ return tk.enrichedTitle||tk.title; }).join(", ")||"none")+". Goals: "+(goals.slice(0,5).map(function(g){ return g.title; }).join(", ")||"none");
    const afSuffix=lang==="af"?"\nRespond in Afrikaans.":"";
    try {
      const r=await aiCall(P_THERAPIST+afSuffix, "Start my end-of-day reflection. Context: "+ctx);
      setEodMsgs([{role:"user",text:"",hidden:true},{role:"assistant",text:r}]);
    } catch(e) {
      setEodMsgs([{role:"assistant",text:"How would you describe today honestly — not just what you did, but how it actually felt?"}]);
    }
    finally { setEodLoad(false); }
  }

  async function sendEOD() {
    const msg=eodIn.trim(); if(!msg||eodLoad) return;
    setEodIn(""); eodCount.current+=1;
    const nm=[...eodMsgs,{role:"user",text:msg}];
    setEodMsgs(nm); setEodLoad(true);
    try {
      const hist=nm.filter(function(m){ return !m.hidden; }).map(function(m){ return {role:m.role==="assistant"?"assistant":"user",content:m.text}; });
      const sys=P_THERAPIST+(eodCount.current>=5?"\n\nThis is message #5. Deliver your REFLECTION now.":"")+(lang==="af"?"\nRespond in Afrikaans.":"");
      const r=await aiCall(sys, null, hist);
      setEodMsgs([...nm,{role:"assistant",text:r}]);
      if(r.includes("REFLECTION:")||eodCount.current>=5) { setEodDone(true); logEvent("EOD reflection done",{}); }
    } catch(e) {
      setEodMsgs(function(m){ return [...m,{role:"assistant",text:"That's important. What's underneath that feeling?"}]; });
    }
    finally { setEodLoad(false); }
  }

  // Goals
  function addGoal() {
    if(!newGoal.trim()) return;
    sG([...goals,{id:Date.now(),horizon,title:newGoal.trim(),milestones:[],createdAt:new Date().toISOString()}]);
    logEvent("Goal added",{goalTitle:newGoal.trim()}); setNewGoal(""); setAddingGoal(false);
  }
  function delGoal(id) { sG(goals.filter(function(g){ return g.id!==id; })); }
  function tglMs(gid, mid) {
    sG(goals.map(function(g) {
      if(g.id!==gid) return g;
      return Object.assign({},g,{milestones:g.milestones.map(function(m){ return m.id===mid?Object.assign({},m,{done:!m.done}):m; })});
    }));
  }
  function addMs(gid) {
    const txt=(newMs[gid]||"").trim(); if(!txt) return;
    sG(goals.map(function(g){ return g.id!==gid?g:Object.assign({},g,{milestones:[...g.milestones,{id:Date.now(),text:txt,done:false}]}); }));
    setNewMs(function(p){ const n=Object.assign({},p); n[gid]=""; return n; });
  }
  async function aiMs(gid) {
    const g=goals.find(function(x){ return x.id===gid; }); if(!g) return;
    setMsLoad(gid);
    try {
      const afSuffix=lang==="af"?"\nRespond in Afrikaans.":"";
      const r=await aiJSON(P_MILESTONE+afSuffix, 'Goal:"'+g.title+'" Horizon:'+g.horizon);
      const ms=(r.milestones||[]).map(function(m,i){ return {id:Date.now()+i,text:m,done:false}; });
      sG(goals.map(function(x){ return x.id!==gid?x:Object.assign({},x,{milestones:[...x.milestones,...ms]}); }));
    } catch(e) {}
    finally { setMsLoad(null); }
  }

  // Habits
  function saveHabit(h) {
    const ex=habits.find(function(x){ return x.id===h.id; });
    sH(ex ? habits.map(function(x){ return x.id===h.id?h:x; }) : [h,...habits]);
    setHabitModal(null);
  }
  function delHabit(id) { sH(habits.filter(function(h){ return h.id!==id; })); }
  function tglHabit(id) {
    const td=todayStr();
    const h=habits.find(function(x){ return x.id===id; }); if(!h) return;
    const wasDone=!!(h.completions&&h.completions[td]);
    const c=Object.assign({},h.completions); c[td]=!wasDone;
    sH(habits.map(function(x){ return x.id!==id?x:Object.assign({},x,{completions:c}); }));
    if(!wasDone) logEvent("Habit completed",{habit:h.title});
  }

  // Calendar
  async function loadICS(f) { const text=await f.text(); const p=parseICS(text); sE([...events,...p.filter(function(e){ return !events.find(function(x){ return x.id===e.id; }); })]); }
  async function fetchICS(url) {
    const proxies=[function(u){ return "https://corsproxy.io/?"+encodeURIComponent(u); }, function(u){ return "https://api.allorigins.win/raw?url="+encodeURIComponent(u); }];
    for(let i=0;i<proxies.length;i++) {
      try {
        const r=await fetch(proxies[i](url),{signal:AbortSignal.timeout(7000)});
        if(!r.ok) continue;
        const txt=await r.text(); let ics=txt;
        try { const j=JSON.parse(txt); if(j.contents) ics=j.contents; } catch(e2) {}
        if(ics.includes("BEGIN:VCALENDAR")) return ics;
      } catch(e) {}
    }
    throw new Error("proxy_failed");
  }
  async function addFeed() {
    const url=feedInput.trim(); if(!url) return;
    if(calFeeds.find(function(f){ return f.url===url; })) { setFeedErr("Already subscribed."); return; }
    setFeedLoad(true); setFeedErr("");
    try {
      const ics=await fetchICS(url); const p=parseICS(ics);
      if(!p.length) throw new Error("No events found.");
      const label=url.includes("outlook")?"Outlook":url.includes("google")?"Google":"Calendar "+(calFeeds.length+1);
      sFd([...calFeeds,{id:Date.now(),url,label,lastSynced:new Date().toISOString(),count:p.length}]);
      sE([...events,...p.filter(function(e){ return !events.find(function(x){ return x.id===e.id; }); })]);
      setFeedInput("");
    } catch(err) {
      const msg=err instanceof Error?err.message:"Failed";
      if(msg==="proxy_failed") { setFeedErr("Auto-fetch blocked — use Paste ICS."); setPasteMode(true); }
      else setFeedErr(msg);
    }
    finally { setFeedLoad(false); }
  }
  async function syncFeed(feed) {
    if(feed.pasted) { setCalErr("Pasted calendars can't auto-sync. Re-paste to update."); return; }
    setFeedLoad(feed.id);
    try {
      const ics=await fetchICS(feed.url); const p=parseICS(ics);
      sE([...events.filter(function(e){ return !p.find(function(q){ return q.id===e.id; }); }),...p]);
      sFd(calFeeds.map(function(f){ return f.id===feed.id?Object.assign({},f,{lastSynced:new Date().toISOString(),count:p.length}):f; }));
    } catch(err) { setCalErr(err instanceof Error?err.message:"Sync failed"); }
    finally { setFeedLoad(null); }
  }
  function syncAll() { calFeeds.forEach(function(f){ syncFeed(f); }); }
  function removeFeed(id) { sFd(calFeeds.filter(function(f){ return f.id!==id; })); }
  useEffect(function(){ if(calFeeds.length) syncAll(); }, [calFeeds.length]);

  function importPasted() {
    if(!pasteText.includes("BEGIN:VCALENDAR")) { setFeedErr("Not valid ICS content."); return; }
    const p=parseICS(pasteText); if(!p.length) { setFeedErr("No events found."); return; }
    const label=pasteName.trim()||"Calendar "+(calFeeds.length+1);
    sFd([...calFeeds,{id:Date.now(),url:"pasted:"+Date.now(),label,lastSynced:new Date().toISOString(),count:p.length,pasted:true}]);
    sE([...events,...p.filter(function(e){ return !events.find(function(x){ return x.id===e.id; }); })]);
    setPasteText(""); setPasteName(""); setPasteMode(false); setFeedErr("");
  }

  async function importCSV(f) {
    setCsvErr("");
    try {
      const text=await f.text(); const rows=parseCSV(text);
      if(!rows.length) throw new Error("No rows found");
      const newEvts=rows.filter(function(r){ return r.date||r.datum; }).map(function(r,i) {
        const dateStr=r.date||r.datum||"";
        const startStr=r.start||r.begin||"00:00";
        let start;
        try { start=new Date(dateStr+"T"+(startStr.length<=5?startStr+":00":startStr)).toISOString(); }
        catch(e) { start=new Date(dateStr||Date.now()).toISOString(); }
        return {id:"csv_"+Date.now()+i,title:r.activity||r.aktiwiteit||r.title||"Event",start,desc:r.details||r.besonderhede||"",category:r.category||r.kategorie||"Other",fromCSV:true};
      });
      if(!newEvts.length) throw new Error("Could not parse any events — check column headers");
      sE([...events,...newEvts.filter(function(e){ return !events.find(function(x){ return x.id===e.id; }); })]);
      logEvent("CSV imported", {count:newEvts.length});
    } catch(err) { setCsvErr(err instanceof Error?err.message:"Failed to parse CSV"); }
  }

  // Derived
  const pend = tasks.filter(function(tk){ return !tk.completed; });
  const done = tasks.filter(function(tk){ return  tk.completed; });

  function applyFilters(list, f, s) {
    return list.filter(function(tk) {
      if(f.priority!=="All" && tk.priority!==f.priority) return false;
      if(f.category!=="All" && (tk.category||"Other")!==f.category) return false;
      if(f.time!=="All"     && tk.timeEstimate!==f.time) return false;
      if(s.trim()) {
        const q=s.toLowerCase();
        const h=((tk.enrichedTitle||"")+" "+tk.title+" "+(tk.category||"")+" "+(tk.note||"")+" "+(tk.subtasks||[]).join(" ")).toLowerCase();
        if(!h.includes(q)) return false;
      }
      return true;
    });
  }

  const visP   = applyFilters(pend, filts,  search);
  const visD   = applyFilters(done, filtsD, searchD);
  const atP    = useMemo(function(){ return ["All",...Array.from(new Set(pend.map(function(tk){ return tk.timeEstimate; }).filter(Boolean)))]; }, [pend]);
  const acP    = useMemo(function(){ return ["All",...Array.from(new Set(pend.map(function(tk){ return tk.category||"Other"; })))]; }, [pend]);
  const atD    = useMemo(function(){ return ["All",...Array.from(new Set(done.map(function(tk){ return tk.timeEstimate; }).filter(Boolean)))]; }, [done]);
  const acD    = useMemo(function(){ return ["All",...Array.from(new Set(done.map(function(tk){ return tk.category||"Other"; })))]; }, [done]);
  const level  = levelFromXP(stats.xp);
  const curXP  = xpForLevel(level), nxtXP=xpForLevel(level+1);
  const xpPct  = Math.round(((stats.xp-curXP)/(nxtXP-curXP))*100);
  const td     = todayStr();
  const wk7    = useMemo(function(){ return Array.from({length:7},function(_,i){ return toISODate(new Date(Date.now()-i*86400000)); }).reverse(); }, []);
  const weekDays = useMemo(function(){ return getWeekDays(weekOff); }, [weekOff]);
  const pomoTask = tasks.find(function(tk){ return tk.id===pomo?.taskId; });
  const HL     = LANG[lang].HL;
  const days   = LANG[lang].days;
  const months = LANG[lang].months;
  const tabs   = LANG[lang].tabs;

  // TaskCard
  function TaskCard({task, showNum, num}) {
    const pc     = PRI[task.priority]||PRI.medium;
    const isExp  = expanded===task.id;
    const showOp = outcomeId===task.id;
    const isPomo = pomo&&pomo.taskId===task.id;
    const due    = dueStatus(task);
    const subDone= task.subtasksDone.filter(Boolean).length;

    const cardStyle={background:T.card,borderRadius:16,padding:14,border:"1px solid "+(isPomo?T.ac:T.border),boxShadow:isPomo?"0 0 0 2px "+T.ac+",0 0 20px "+T.ac+"30":undefined};
    const chipBase={background:T.surf,color:T.tc2};

    return (
      <div className="tc" style={cardStyle}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flexShrink:0}}>
            {showNum && <div style={{width:24,height:24,borderRadius:"50%",background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>{num}</div>}
            <button onClick={function(){ toggle(task.id); }} style={{width:22,height:22,borderRadius:"50%",border:"2px solid "+(task.completed?"#34d399":T.border),background:task.completed?"#34d399":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
              {task.completed && <span style={{fontSize:11,color:"#fff",fontWeight:800}}>✓</span>}
            </button>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:14,fontWeight:600,color:T.tc}}>{task.enrichedTitle||task.title}</span>
              {task.enriching   && <span style={{fontSize:10,color:T.ac,animation:"shimmer 1.2s infinite"}}>enriching…</span>}
              {task.enrichFailed && <span onClick={function(){ addTask(task.title); }} style={{fontSize:10,color:"#f87171",cursor:"pointer"}}>⚠️ retry</span>}
              {task.recurring   && <span style={{fontSize:10,color:T.tc3}}>🔁 {task.recurring}</span>}
            </div>
            {task.confidence!=null && !task.enrichFailed && <ConfidenceBar confidence={task.confidence}/>}
            {due && <div style={{fontSize:11,color:due.color,marginTop:2,fontWeight:700}}>{due.label}</div>}
            {task.note&&!showOp && <div style={{marginTop:3,fontSize:11,color:T.tc3,fontStyle:"italic"}}>📝 {task.note}</div>}
            {task.enriched&&!task.enrichFailed && (
              <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap",alignItems:"center"}}>
                <Chip taskId={task.id} field="priority"  chipStyle={{background:pc.bg,color:pc.color}}  tasks={tasks} updTask={updTask} T={T}>{pc.icon} {pc.label}</Chip>
                <Chip taskId={task.id} field="time"      chipStyle={chipBase} tasks={tasks} updTask={updTask} T={T}>⏱ {task.timeEstimate||"Set time"}</Chip>
                <Chip taskId={task.id} field="category"  chipStyle={chipBase} tasks={tasks} updTask={updTask} T={T}>{CE[task.category]||"📌"} {task.category}</Chip>
                <Chip taskId={task.id} field="dueDate"   chipStyle={chipBase} tasks={tasks} updTask={updTask} T={T}>📅 {task.dueDate||"No date"}</Chip>
                <Chip taskId={task.id} field="recurring" chipStyle={chipBase} tasks={tasks} updTask={updTask} T={T}>🔁 {task.recurring||"Once"}</Chip>
                {!task.completed && <button onClick={function(){ startPomo(task.id); }} style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:isPomo?T.ac+"30":T.ac+"15",color:T.ac,border:"1px solid "+(isPomo?T.ac+"50":T.ac+"25"),cursor:"pointer",fontWeight:700}}>{isPomo?t(lang,"focusing"):t(lang,"focus")}</button>}
                {(task.subtasks.length>0||task.relatedItems.length>0) && <button onClick={function(){ setExpanded(isExp?null:task.id); }} style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:"rgba(96,165,250,.15)",color:"#60a5fa",border:"none",cursor:"pointer",fontWeight:700}}>{isExp?t(lang,"hide"):t(lang,"details")}{task.subtasks.length>0?" · "+subDone+"/"+task.subtasks.length:""}</button>}
                {task.completed && <button onClick={function(){ setOutcomeId(showOp?null:task.id); }} style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:"rgba(52,211,153,.12)",color:"#34d399",border:"1px solid rgba(52,211,153,.25)",cursor:"pointer",fontWeight:700}}>{showOp?t(lang,"close"):t(lang,"outcome")}</button>}
              </div>
            )}
            {isExp && (
              <div style={{marginTop:10}}>
                {task.subtasks.length>0 && (
                  <div>
                    <p style={{margin:"0 0 6px",fontSize:10,fontWeight:700,color:T.tc3,textTransform:"uppercase",letterSpacing:1}}>{t(lang,"steps")}</p>
                    <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:8}}>
                      {task.subtasks.map(function(s,i) {
                        const done2=task.subtasksDone[i];
                        return (
                          <div key={i} onClick={function(){ tglSub(task.id,i); }} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                            <div style={{width:15,height:15,borderRadius:4,flexShrink:0,border:"2px solid "+(done2?T.ac:T.border),background:done2?T.ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              {done2 && <span style={{fontSize:8,color:"#fff",fontWeight:800}}>✓</span>}
                            </div>
                            <span style={{fontSize:12,color:done2?T.tc3:T.tc2,textDecoration:done2?"line-through":"none"}}>{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {task.relatedItems.length>0 && (
                  <div>
                    <p style={{margin:"0 0 6px",fontSize:10,fontWeight:700,color:T.tc3,textTransform:"uppercase",letterSpacing:1}}>{t(lang,"alsoConsider")}</p>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {task.relatedItems.map(function(r,i) {
                        return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:6}}><span style={{color:"#fbbf24",fontSize:11,marginTop:1}}>→</span><span style={{fontSize:12,color:T.tc2,lineHeight:1.4}}>{r}</span></div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {showOp && <OutcomePanel task={task} onSaveNote={function(n){ updTask(task.id,{note:n}); }} onAddFollowUp={addTask} onClose={function(){ setOutcomeId(null); }} T={T} lang={lang}/>}
          </div>
          {!showNum && <button className="delbtn" onClick={function(){ delTask(task.id); }} style={{background:"transparent",border:"none",cursor:"pointer",color:T.tc3,fontSize:13,padding:"0 2px"}}>✕</button>}
        </div>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter',system-ui,sans-serif",padding:"20px 14px 100px",color:T.tc}}>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes shimmer{0%,100%{opacity:.4}50%{opacity:1}} @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(229,57,53,.4)}50%{box-shadow:0 0 0 8px rgba(229,57,53,0)}} @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}} .tc{animation:fadeIn .25s ease} .delbtn{opacity:0;transition:opacity .15s} .tc:hover .delbtn{opacity:1} input::placeholder,textarea::placeholder{color:rgba(128,128,128,.45)!important} *{box-sizing:border-box} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(128,128,128,.25);border-radius:3px}"}</style>
      <div style={{maxWidth:640,margin:"0 auto",animation:"fadeIn .3s ease"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo color={T.tc}/>
            <div>
              <h1 style={{margin:0,fontSize:22,fontWeight:900,color:T.ac,letterSpacing:1}}>PLANLOOS</h1>
              <p style={{margin:0,fontSize:10,color:T.tc3}}>{t(lang,"tagline")} · {t(lang,"level")} {level} · {stats.streakDays}🔥 · {pend.length} {t(lang,"pending")}</p>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {pend.length>0 && <button onClick={function(){ planDay(false); }} style={{background:T.ac,border:"none",borderRadius:10,padding:"7px 12px",color:"#fff",fontWeight:900,cursor:"pointer",fontSize:12,letterSpacing:.5,animation:tab!=="plan"?"pulse 2.5s infinite":"none"}}>{t(lang,"planBtn")}</button>}
            <button onClick={startEOD} style={{width:32,height:32,borderRadius:8,background:T.surf,border:"1px solid "+T.border,color:T.tc2,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>🌙</button>
            <button onClick={function(){ setSettings(true); }} style={{width:32,height:32,borderRadius:8,background:T.surf,border:"1px solid "+T.border,color:T.tc2,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>⚙️</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:2,background:T.surf,borderRadius:14,padding:3,marginBottom:14,border:"1px solid "+T.border,overflowX:"auto"}}>
          {tabs.map(function(label, i) {
            const keys=["tasks","done","calendar","habits","goals","plan","stats"];
            const key=keys[i];
            const counts={tasks:pend.length,done:done.length,habits:habits.length,goals:goals.length,calendar:events.length};
            const cnt=counts[key];
            const active=tab===key;
            return (
              <button key={key} onClick={function(){ setTab(key); }} style={{flex:"0 0 auto",padding:"6px 8px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:10,whiteSpace:"nowrap",background:active?T.ac:"transparent",color:active?"#fff":T.tc3,letterSpacing:.3}}>
                {label}{cnt>0?<span style={{marginLeft:3,fontSize:9,background:active?"rgba(255,255,255,.25)":T.surf,borderRadius:20,padding:"1px 5px"}}>{cnt}</span>:null}
              </button>
            );
          })}
        </div>

        {/* Tasks */}
        {tab==="tasks" && (
          <div style={{animation:"fadeIn .2s ease"}}>
            <div style={{display:"flex",gap:8,background:T.card,borderRadius:16,padding:"7px 7px 7px 14px",border:"1px solid "+T.border,marginBottom:10}}>
              <input value={input} onChange={function(e){ setInput(e.target.value); }} onKeyDown={function(e){ if(e.key==="Enter") addTask(); }} placeholder={t(lang,"add")} style={{flex:1,background:"transparent",border:"none",outline:"none",color:T.tc,fontSize:14}}/>
              <button onClick={addTask} disabled={!input.trim()} style={{background:input.trim()?T.ac:"transparent",border:"1px solid "+(input.trim()?T.ac:T.border),borderRadius:10,padding:"8px 14px",color:input.trim()?"#fff":T.tc3,fontWeight:900,cursor:input.trim()?"pointer":"default",fontSize:12}}>ADD</button>
            </div>
            <div style={{display:"flex",gap:8,background:T.surf,borderRadius:12,padding:"7px 12px",marginBottom:10,border:"1px solid "+T.border}}>
              <span style={{color:T.tc3,fontSize:13}}>🔍</span>
              <input value={search} onChange={function(e){ setSearch(e.target.value); }} placeholder={t(lang,"search")} style={{flex:1,background:"transparent",border:"none",outline:"none",color:T.tc,fontSize:13}}/>
              {search && <button onClick={function(){ setSearch(""); }} style={{background:"transparent",border:"none",color:T.tc3,cursor:"pointer"}}>✕</button>}
            </div>
            {pend.length>0 && <FilterPanel filters={filts} setFilters={setFilts} allTimes={atP} allCats={acP} T={T} lang={lang}/>}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {visP.length===0 && <EmptyState icon="📋" title={t(lang,"noPending")} sub={t(lang,"noPendingHint")}/>}
              {visP.map(function(tk){ return <TaskCard key={tk.id} task={tk} showNum={false}/>; })}
            </div>
          </div>
        )}

        {/* Done */}
        {tab==="done" && (
          <div style={{animation:"fadeIn .2s ease"}}>
            <div style={{display:"flex",gap:8,background:T.surf,borderRadius:12,padding:"7px 12px",marginBottom:10,border:"1px solid "+T.border}}>
              <span style={{color:T.tc3,fontSize:13}}>🔍</span>
              <input value={searchD} onChange={function(e){ setSearchD(e.target.value); }} placeholder={t(lang,"search")} style={{flex:1,background:"transparent",border:"none",outline:"none",color:T.tc,fontSize:13}}/>
              {searchD && <button onClick={function(){ setSearchD(""); }} style={{background:"transparent",border:"none",color:T.tc3,cursor:"pointer"}}>✕</button>}
            </div>
            {done.length>0 && <FilterPanel filters={filtsD} setFilters={setFiltsD} allTimes={atD} allCats={acD} T={T} lang={lang}/>}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {visD.length===0 && <EmptyState icon="✅" title={t(lang,"noDone")} sub={t(lang,"noDoneHint")}/>}
              {visD.map(function(tk){ return <TaskCard key={tk.id} task={tk} showNum={false}/>; })}
            </div>
            {done.length>0 && <button onClick={function(){ sT(tasks.filter(function(tk){ return !tk.completed; })); }} style={{width:"100%",marginTop:14,padding:11,borderRadius:14,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",color:"rgba(248,113,113,.7)",fontWeight:700,cursor:"pointer",fontSize:13}}>🗑 Clear all completed ({done.length})</button>}
          </div>
        )}

        {/* Calendar */}
        {tab==="calendar" && (
          <div style={{animation:"fadeIn .2s ease"}}>
            {/* Weekly view */}
            <div style={{background:T.card,borderRadius:16,padding:14,border:"1px solid "+T.border,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <button onClick={function(){ setWeekOff(function(p){ return p-1; }); }} style={{background:T.surf,border:"1px solid "+T.border,borderRadius:8,padding:"5px 10px",color:T.tc2,cursor:"pointer",fontWeight:700}}>←</button>
                <span style={{fontSize:12,fontWeight:700,color:T.tc}}>{weekDays[0].getDate()} {months[weekDays[0].getMonth()]} – {weekDays[6].getDate()} {months[weekDays[6].getMonth()]} {weekDays[0].getFullYear()}</span>
                <button onClick={function(){ setWeekOff(function(p){ return p+1; }); }} style={{background:T.surf,border:"1px solid "+T.border,borderRadius:8,padding:"5px 10px",color:T.tc2,cursor:"pointer",fontWeight:700}}>→</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {weekDays.map(function(day, i) {
                  const dayKey   = toISODate(day);
                  const isToday  = dayKey===td;
                  const dayTasks = tasks.filter(function(tk){ return tk.dueDate===dayKey; });
                  const dayEvts  = events.filter(function(e){ return e.start&&e.start.slice(0,10)===dayKey; });
                  const dowIdx   = day.getDay()===0?6:day.getDay()-1;
                  return (
                    <div key={dayKey} style={{display:"flex",gap:10,padding:"8px 10px",borderRadius:10,background:isToday?T.ac+"12":T.surf,border:"1px solid "+(isToday?T.ac+"50":T.border)}}>
                      <div style={{width:44,flexShrink:0}}>
                        <div style={{fontSize:10,fontWeight:700,color:isToday?T.ac:T.tc3}}>{days[dowIdx]}</div>
                        <div style={{fontSize:16,fontWeight:900,color:isToday?T.ac:T.tc,lineHeight:1}}>{day.getDate()}</div>
                      </div>
                      <div style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
                        {dayEvts.length===0&&dayTasks.length===0 && <span style={{fontSize:11,color:T.tc3,alignSelf:"center"}}>—</span>}
                        {dayEvts.map(function(e) { return <div key={e.id} style={{fontSize:11,color:"#60a5fa",background:"rgba(96,165,250,.1)",borderRadius:6,padding:"2px 7px"}}>{e.title}</div>; })}
                        {dayTasks.map(function(tk) { const pc2=PRI[tk.priority]||PRI.medium; return <div key={tk.id} style={{fontSize:11,color:pc2.color,background:pc2.bg,borderRadius:6,padding:"2px 7px"}}>{pc2.icon} {tk.enrichedTitle||tk.title}</div>; })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {weekOff!==0 && <button onClick={function(){ setWeekOff(0); }} style={{marginTop:8,width:"100%",fontSize:11,padding:"4px 0",borderRadius:20,background:T.surf,border:"1px solid "+T.border,color:T.tc2,cursor:"pointer",fontWeight:700}}>{t(lang,"today")}</button>}
            </div>

            {/* CSV Import */}
            <div style={{background:T.card,borderRadius:16,padding:14,border:"1px solid "+T.border,marginBottom:14}}>
              <p style={{margin:"0 0 6px",fontSize:12,fontWeight:700,color:T.ac}}>📊 {t(lang,"csvImport")}</p>
              <InfoBanner msg={t(lang,"csvHint")}/>
              <ErrBanner msg={csvErr} onDismiss={function(){ setCsvErr(""); }}/>
              <label style={{display:"flex",alignItems:"center",gap:10,background:T.surf,border:"1px dashed "+T.ac+"60",borderRadius:12,padding:12,cursor:"pointer"}}>
                <span style={{fontSize:20}}>📂</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:T.ac}}>{t(lang,"csvImport")}</div>
                  <div style={{fontSize:11,color:T.tc3}}>CSV: Date, Start, End, Activity, Category</div>
                </div>
                <input type="file" accept=".csv" onChange={function(e){ if(e.target.files[0]) importCSV(e.target.files[0]); }} style={{display:"none"}}/>
              </label>
            </div>

            {/* iCal */}
            <div style={{background:T.card,borderRadius:16,padding:14,border:"1px solid "+T.border}}>
              <p style={{margin:"0 0 8px",fontSize:12,fontWeight:700,color:T.ac}}>🔗 {t(lang,"calSync")}</p>
              <div style={{display:"flex",gap:3,background:T.surf,borderRadius:10,padding:3,marginBottom:10}}>
                {[["url","🔗 URL"],["paste","📋 Paste ICS"]].map(function(pair) {
                  const m=pair[0], l=pair[1];
                  const active=(!pasteMode&&m==="url")||(pasteMode&&m==="paste");
                  return <button key={m} onClick={function(){ setPasteMode(m==="paste"); setFeedErr(""); }} style={{flex:1,padding:"5px 0",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:11,background:active?T.ac:"transparent",color:active?"#fff":T.tc3}}>{l}</button>;
                })}
              </div>
              {!pasteMode && (
                <div style={{display:"flex",gap:8}}>
                  <input value={feedInput} onChange={function(e){ setFeedInput(e.target.value); }} onKeyDown={function(e){ if(e.key==="Enter") addFeed(); }} placeholder="https://outlook.live.com/owa/calendar/.../calendar.ics" style={{flex:1,background:T.surf,border:"1px solid "+T.ac+"40",borderRadius:10,padding:"8px 12px",color:T.tc,fontSize:11,outline:"none"}}/>
                  <button onClick={addFeed} disabled={!feedInput.trim()||feedLoad===true} style={{padding:"8px 14px",borderRadius:10,background:T.ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>{feedLoad===true?"⏳":"Add"}</button>
                </div>
              )}
              {pasteMode && (
                <div>
                  <input value={pasteName} onChange={function(e){ setPasteName(e.target.value); }} placeholder="Calendar name…" style={{width:"100%",background:T.surf,border:"1px solid "+T.ac+"40",borderRadius:9,padding:"7px 12px",color:T.tc,fontSize:12,outline:"none",marginBottom:5}}/>
                  <textarea value={pasteText} onChange={function(e){ setPasteText(e.target.value); }} placeholder="Paste ICS content (starts with BEGIN:VCALENDAR)…" style={{width:"100%",height:70,background:T.surf,border:"1px solid "+T.ac+"40",borderRadius:9,padding:"7px 12px",color:T.tc,fontSize:11,outline:"none",resize:"vertical",fontFamily:"monospace",marginBottom:5}}/>
                  <button onClick={importPasted} disabled={!pasteText.trim()} style={{width:"100%",padding:"8px 0",borderRadius:10,background:T.ac,border:"none",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>Import</button>
                </div>
              )}
              <ErrBanner msg={feedErr||calErr} onDismiss={function(){ setFeedErr(""); setCalErr(""); }}/>
              {calFeeds.length>0 && (
                <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>
                  {calFeeds.map(function(feed) {
                    return (
                      <div key={feed.id} style={{display:"flex",alignItems:"center",gap:8,background:T.surf,borderRadius:10,padding:"8px 12px",border:"1px solid "+T.border}}>
                        <div style={{flex:1,fontSize:12,fontWeight:600,color:T.tc}}>{feed.label} <span style={{fontSize:10,color:T.tc3}}>{feed.count} events</span></div>
                        <button onClick={function(){ syncFeed(feed); }} style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:T.surf,color:T.tc2,border:"1px solid "+T.border,cursor:"pointer"}}>↺</button>
                        <button onClick={function(){ removeFeed(feed.id); }} style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"rgba(248,113,113,.1)",color:"#f87171",border:"none",cursor:"pointer"}}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Habits */}
        {tab==="habits" && (
          <div style={{animation:"fadeIn .2s ease"}}>
            <button onClick={function(){ setHabitModal("add"); }} style={{width:"100%",padding:11,borderRadius:14,background:T.ac,border:"none",color:"#fff",fontWeight:900,fontSize:13,cursor:"pointer",marginBottom:14,letterSpacing:.5}}>+ {t(lang,"addHabit")}</button>
            {habits.length===0 && <EmptyState icon="🔄" title={t(lang,"noHabits")} sub={t(lang,"noHabitsHint")}/>}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {habits.map(function(h) {
                const streak = calcStreak(h);
                const tdDone = !!(h.completions&&h.completions[td]);
                return (
                  <div key={h.id} style={{background:T.card,borderRadius:16,padding:14,border:"1px solid "+(tdDone?h.color+"60":T.border)}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                      <button onClick={function(){ tglHabit(h.id); }} style={{width:40,height:40,borderRadius:12,border:"2px solid "+(tdDone?h.color:T.border),background:tdDone?h.color:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,transition:"all .2s"}}>{h.icon}</button>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:14,fontWeight:700,color:T.tc}}>{h.title}</span>
                          <div style={{display:"flex",gap:6,alignItems:"center"}}>
                            <span style={{fontSize:12,color:h.color,fontWeight:700}}>🔥 {streak} {t(lang,"streak")}</span>
                            <button onClick={function(){ setHabitModal(h); }} style={{background:"transparent",border:"none",cursor:"pointer",color:T.tc3,fontSize:12}}>✎</button>
                            <button onClick={function(){ delHabit(h.id); }} style={{background:"transparent",border:"none",cursor:"pointer",color:T.tc3,fontSize:12}}>✕</button>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:4,marginTop:8}}>
                          {wk7.map(function(d) {
                            const isDone=!!(h.completions&&h.completions[d]);
                            const isT=d===td;
                            const dowIdx=new Date(d+"T12:00").getDay()===0?6:new Date(d+"T12:00").getDay()-1;
                            return (
                              <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                                <div style={{width:"100%",height:20,borderRadius:5,background:isDone?h.color:T.surf,border:"1px solid "+(isT?h.color:T.border),opacity:isDone?1:.5}}/>
                                <span style={{fontSize:8,color:isT?h.color:T.tc3,fontWeight:isT?700:400}}>{days[dowIdx]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Goals */}
        {tab==="goals" && (
          <div style={{animation:"fadeIn .2s ease"}}>
            <div style={{display:"flex",gap:3,background:T.surf,borderRadius:12,padding:3,marginBottom:14,overflowX:"auto"}}>
              {HORIZONS.map(function(h) {
                return <button key={h} onClick={function(){ setHorizon(h); }} style={{flex:"0 0 auto",padding:"6px 9px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:700,fontSize:10,background:horizon===h?T.ac:"transparent",color:horizon===h?"#fff":T.tc3,whiteSpace:"nowrap"}}>{HI[h]} {HL[h]||h}</button>;
              })}
            </div>
            {addingGoal ? (
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                <input value={newGoal} onChange={function(e){ setNewGoal(e.target.value); }} placeholder={(HL[horizon]||horizon)+" goal…"} onKeyDown={function(e){ if(e.key==="Enter") addGoal(); }} autoFocus style={{flex:1,background:T.card,border:"1px solid "+T.ac+"50",borderRadius:12,padding:"10px 14px",color:T.tc,fontSize:14,outline:"none"}}/>
                <button onClick={addGoal} style={{padding:"10px 14px",borderRadius:12,background:T.ac,border:"none",color:"#fff",fontWeight:900,cursor:"pointer"}}>ADD</button>
                <button onClick={function(){ setAddingGoal(false); }} style={{padding:"10px 12px",borderRadius:12,background:T.surf,border:"none",color:T.tc3,cursor:"pointer"}}>✕</button>
              </div>
            ) : (
              <button onClick={function(){ setAddingGoal(true); }} style={{width:"100%",padding:11,borderRadius:14,background:T.ac,border:"none",color:"#fff",fontWeight:900,fontSize:13,cursor:"pointer",marginBottom:14}}>{t(lang,"addGoal")}: {HL[horizon]||horizon}</button>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {goals.filter(function(g){ return g.horizon===horizon; }).length===0 && <EmptyState icon={HI[horizon]} title={t(lang,"noGoals")} sub={undefined}/>}
              {goals.filter(function(g){ return g.horizon===horizon; }).map(function(g) {
                const done2=g.milestones.filter(function(m){ return m.done; }).length;
                const tot=g.milestones.length;
                const pct=tot>0?Math.round(done2/tot*100):0;
                return (
                  <div key={g.id} style={{background:T.card,borderRadius:16,padding:16,border:"1px solid "+T.border}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <h3 style={{margin:0,fontSize:15,fontWeight:700,color:T.tc,flex:1}}>{g.title}</h3>
                      <button onClick={function(){ delGoal(g.id); }} style={{background:"transparent",border:"none",color:T.tc3,cursor:"pointer",fontSize:13}}>✕</button>
                    </div>
                    {tot>0 && (
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.tc3,marginBottom:3}}><span>Progress</span><span>{pct}% · {done2}/{tot}</span></div>
                        <div style={{height:5,background:T.surf,borderRadius:5,overflow:"hidden",marginBottom:10}}><div style={{width:pct+"%",height:"100%",background:T.ac,borderRadius:5,transition:"width .3s"}}/></div>
                        <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
                          {g.milestones.map(function(m) {
                            return (
                              <div key={m.id} onClick={function(){ tglMs(g.id,m.id); }} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                                <div style={{width:15,height:15,borderRadius:4,flexShrink:0,border:"2px solid "+(m.done?T.ac:T.border),background:m.done?T.ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{m.done&&<span style={{fontSize:8,color:"#fff",fontWeight:800}}>✓</span>}</div>
                                <span style={{fontSize:12,color:m.done?T.tc3:T.tc2,textDecoration:m.done?"line-through":"none"}}>{m.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <button onClick={function(){ aiMs(g.id); }} disabled={msLoad===g.id} style={{width:"100%",padding:"6px 0",borderRadius:9,background:"rgba(249,168,37,.1)",border:"1px solid rgba(249,168,37,.2)",color:"#F9A825",fontWeight:700,fontSize:11,cursor:"pointer",marginBottom:7}}>{msLoad===g.id?"…":"✨ AI Milestones"}</button>
                    <div style={{display:"flex",gap:6}}>
                      <input value={newMs[g.id]||""} onChange={function(e){ setNewMs(function(p){ const n=Object.assign({},p); n[g.id]=e.target.value; return n; }); }} placeholder="Add a step…" onKeyDown={function(e){ if(e.key==="Enter") addMs(g.id); }} style={{flex:1,background:T.surf,border:"1px solid "+T.border,borderRadius:9,padding:"5px 11px",color:T.tc,fontSize:12,outline:"none"}}/>
                      <button onClick={function(){ addMs(g.id); }} style={{padding:"5px 12px",borderRadius:9,background:T.surf,border:"1px solid "+T.border,color:T.tc2,fontWeight:700,fontSize:11,cursor:"pointer"}}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Plan */}
        {tab==="plan" && (
          <div style={{animation:"fadeIn .2s ease"}}>
            {!pend.length&&!plan && <EmptyState icon="🗓" title={t(lang,"planEmpty")} sub={undefined}/>}
            {planLoad && <div style={{textAlign:"center",padding:60}}><div style={{fontSize:40,display:"inline-block",animation:"spin 1.5s linear infinite",marginBottom:12}}>🧠</div><p style={{color:T.tc3,margin:0}}>Crafting your plan…</p></div>}
            <ErrBanner msg={planErr} onDismiss={function(){ setPlanErr(""); }}/>
            {plan&&!planLoad && (
              <div>
                <div style={{background:T.ac+"15",borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+T.ac+"30"}}>
                  <p style={{margin:0,fontSize:15,fontWeight:600,lineHeight:1.6,color:T.tc}}>{plan.greeting}</p>
                  {plan.focusBlock && <p style={{margin:"8px 0 0",fontSize:12,color:T.tc2}}><strong style={{color:T.ac}}>{t(lang,"bestFocus")}:</strong> {plan.focusBlock}</p>}
                </div>
                <p style={{margin:"0 0 10px",fontSize:10,fontWeight:700,color:T.tc3,textTransform:"uppercase",letterSpacing:1}}>{t(lang,"planOrder")}</p>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                  {(plan.plan||[]).map(function(item, i) {
                    const task2=plan.tasks[item.taskIndex-1]; if(!task2) return null;
                    const live=tasks.find(function(x){ return x.id===task2.id; })||task2;
                    if(live.completed) return null;
                    return (
                      <div key={task2.id}>
                        {item.reason && <p style={{margin:"0 0 4px",fontSize:11,color:T.tc3,fontStyle:"italic",paddingLeft:4}}>💬 {item.reason}{item.suggestedTime?" · ~"+item.suggestedTime:""}</p>}
                        <TaskCard task={live} showNum={true} num={i+1}/>
                      </div>
                    );
                  })}
                </div>
                {plan.tip && <div style={{padding:"12px 16px",borderRadius:14,background:"rgba(249,168,37,.08)",border:"1px solid rgba(249,168,37,.2)",fontSize:12,color:T.tc2,lineHeight:1.6,marginBottom:14}}><strong style={{color:"#F9A825"}}>{t(lang,"tip")}:</strong> {plan.tip}</div>}
                <button onClick={function(){ planDay(true); }} style={{width:"100%",padding:11,borderRadius:13,background:T.surf,border:"1px solid "+T.border,color:T.tc2,fontWeight:700,cursor:"pointer",fontSize:12}}>{t(lang,"regen")}</button>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {tab==="stats" && (
          <div style={{display:"flex",flexDirection:"column",gap:12,animation:"fadeIn .2s ease"}}>
            <div style={{background:T.ac+"15",borderRadius:16,padding:18,border:"1px solid "+T.ac+"40"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div><div style={{fontSize:24,fontWeight:900,color:T.ac}}>{t(lang,"level")} {level}</div><div style={{fontSize:11,color:T.tc3}}>{stats.xp} XP</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:28}}>🔥</div><div style={{fontSize:14,fontWeight:800,color:T.ac}}>{stats.streakDays} {t(lang,"dayStreak")}</div></div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.tc3,marginBottom:3}}><span>{t(lang,"level")} {level+1}</span><span>{stats.xp-curXP}/{nxtXP-curXP} XP</span></div>
              <div style={{height:6,background:T.surf,borderRadius:6,overflow:"hidden"}}><div style={{width:xpPct+"%",height:"100%",background:T.ac,borderRadius:6,transition:"width .5s"}}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[[t(lang,"today"),stats.history[td]||0,"✅"],["Week",wk7.reduce(function(s,d){ return s+(stats.history[d]||0); },0),"📅"],["Month",Object.entries(stats.history).filter(function(e){ return e[0].slice(0,7)===td.slice(0,7); }).reduce(function(s,e){ return s+e[1]; },0),"🗓"]].map(function(row) {
                const l=row[0], v=row[1], ic=row[2];
                return <div key={l} style={{background:T.card,borderRadius:12,padding:12,textAlign:"center",border:"1px solid "+T.border}}><div style={{fontSize:18}}>{ic}</div><div style={{fontSize:20,fontWeight:900,color:T.ac,margin:"3px 0"}}>{v}</div><div style={{fontSize:9,color:T.tc3}}>{l}</div></div>;
              })}
            </div>
            <div style={{background:T.card,borderRadius:14,padding:14,border:"1px solid "+T.border}}>
              <p style={{margin:"0 0 10px",fontSize:10,fontWeight:700,color:T.tc3,textTransform:"uppercase",letterSpacing:1}}>Last 7 Days</p>
              <div style={{display:"flex",gap:5,alignItems:"flex-end",height:50}}>
                {wk7.map(function(d) {
                  const cnt=stats.history[d]||0;
                  const maxDay=Math.max.apply(null,wk7.map(function(x){ return stats.history[x]||0; }).concat([1]));
                  const h=cnt?Math.max(cnt/maxDay*44,4):0;
                  const isT=d===td;
                  const dowIdx=new Date(d+"T12:00").getDay()===0?6:new Date(d+"T12:00").getDay()-1;
                  return (
                    <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <div style={{width:"100%",height:h+"px",background:isT?T.ac:T.ac+"50",borderRadius:3}}/>
                      <span style={{fontSize:8,color:isT?T.ac:T.tc3,fontWeight:isT?700:400}}>{days[dowIdx]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {auditLog.length>0 && (
              <div style={{background:T.card,borderRadius:14,padding:14,border:"1px solid "+T.border}}>
                <p style={{margin:"0 0 10px",fontSize:10,fontWeight:700,color:T.tc3,textTransform:"uppercase",letterSpacing:1}}>{t(lang,"activityFeed")}</p>
                <div style={{display:"flex",flexDirection:"column",gap:1}}>
                  {auditLog.slice(0,20).map(function(ev, i) {
                    return (
                      <div key={ev.id||i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<19?"1px solid "+T.border:"none"}}>
                        <div style={{flex:1,minWidth:0}}><span style={{fontSize:11,color:T.tc2}}>{ev.description}</span>{ev.metadata&&ev.metadata.taskTitle?<span style={{fontSize:10,color:T.tc3,marginLeft:5}}>— {ev.metadata.taskTitle}</span>:null}</div>
                        <span style={{fontSize:9,color:T.tc3,flexShrink:0}}>{timeAgo(ev.ts)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <button onClick={startEOD} style={{width:"100%",padding:14,borderRadius:14,background:T.ac+"15",border:"1px solid "+T.ac+"40",color:T.tc,fontWeight:900,fontSize:14,cursor:"pointer"}}>🌙 {t(lang,"eodBtn")}</button>
          </div>
        )}

      </div>

      <PomoOverlay pomo={pomo} task={pomoTask} T={T} onToggle={tglPomo} onStop={stopPomo} onSkip={skipPomo} pomoDur={cfg.pomoDur} breakDur={cfg.breakDur}/>
      {eodOpen    && <EODModal msgs={eodMsgs} input={eodIn} setInput={setEodIn} onSend={sendEOD} onClose={function(){ setEodOpen(false); }} loading={eodLoad} done={eodDone} T={T} lang={lang}/>}
      {settings   && <SettingsModal cfg={cfg} onSave={function(u){ setCfg(u); sv("fl:cfg",u); }} onClose={function(){ setSettings(false); }} T={T} lang={lang}/>}
      {habitModal && <HabitModal existing={habitModal==="add"?null:habitModal} onSave={saveHabit} onClose={function(){ setHabitModal(null); }} T={T} lang={lang}/>}
    </div>
  );
}

