/* Story Hunt, app logic.
   Depends on js/data.js for all content. */

/* ---------- state ---------- */
var KEY = "storyhunt-v3";
var BLANK = {
  beat:null, topic:null, stage:0,
  q1:"", q1why:"",
  sources:[{},{},{}],
  activeSrc:0,
  method:""
};
var S = JSON.parse(JSON.stringify(BLANK));

function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function load(){
  try{
    var raw = localStorage.getItem(KEY); if(!raw) return;
    var d = JSON.parse(raw);
    if(d && typeof d === "object" && Array.isArray(d.sources) && d.sources.length === 3){
      for(var k in BLANK){ if(!(k in d)) d[k] = BLANK[k]; }
      S = d;
    }
  }catch(e){}
}

/* ---------- helpers ---------- */
function $(id){ return document.getElementById(id); }
function topicsFor(beat){ return TOPICS.filter(function(t){ return t.beat === beat; }); }
function beatName(id){ for(var i=0;i<BEATS.length;i++){ if(BEATS[i].id===id) return BEATS[i].name; } return ""; }
function beatIcon(id){ for(var i=0;i<BEATS.length;i++){ if(BEATS[i].id===id) return BEATS[i].icon; } return "ico-news"; }
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function promptFor(topic){ return PROMPT_TEMPLATE.replace("{TOPIC}", topic ? (topic.promptName || topic.title) : ""); }
function srcDone(s){ return !!(s && s.url && s.title && s.outlet && s.date && s.type && s.why); }
function srcStarted(s){ return !!(s && s.url); }

/* ---------- top tabs ---------- */
var tabs = document.querySelectorAll(".tab");
for(var i=0;i<tabs.length;i++){
  tabs[i].addEventListener("click", function(){
    var v = this.getAttribute("data-view");
    for(var j=0;j<tabs.length;j++){ tabs[j].classList.toggle("on", tabs[j]===this); }
    var views = document.querySelectorAll(".view");
    for(var k=0;k<views.length;k++){ views[k].classList.toggle("on", views[k].id === "view-"+v); }
    window.scrollTo(0,0);
  });
}

/* ---------- stages ---------- */
function goStage(n){
  S.stage = n; save();
  var st = document.querySelectorAll(".stage");
  for(var i=0;i<st.length;i++){ st[i].classList.toggle("on", Number(st[i].getAttribute("data-stage"))===n); }
  var rail = $("rail").children;
  for(var r=0;r<rail.length;r++){
    rail[r].classList.toggle("on", r===n);
    rail[r].classList.toggle("done", r<n);
  }
  if(n===2) $("editorBeat").textContent = beatName(S.beat) + " desk";
  if(n===3) renderWheelStage();
  if(n===4) renderPromptCheck();
  if(n===5) renderSources();
  if(n===6) renderWorkflow();
  if(n===7) renderSummary();
  window.scrollTo(0,0);
}
document.addEventListener("click", function(e){
  var t = e.target.closest ? e.target.closest("[data-go]") : null;
  if(t){ goStage(Number(t.getAttribute("data-go"))); return; }
  var c = e.target.closest ? e.target.closest("[data-close]") : null;
  if(c){ $(c.getAttribute("data-close")).classList.remove("on"); }
});

/* ---------- beats ---------- */
function renderBeats(){
  var html = "";
  for(var i=0;i<BEATS.length;i++){
    var b = BEATS[i];
    html += '<button class="beat'+(S.beat===b.id?" on":"")+'" data-beat="'+b.id+'">' +
              '<svg><use href="#'+b.icon+'"></use></svg>' +
              '<b>'+b.name+'</b><span>'+b.blurb+'</span></button>';
  }
  $("beatCards").innerHTML = html;
  $("beatNext").disabled = !S.beat;
  var cards = $("beatCards").querySelectorAll(".beat");
  for(var j=0;j<cards.length;j++){
    cards[j].addEventListener("click", function(){
      var id = this.getAttribute("data-beat");
      if(S.beat !== id){ S.topic = null; }
      S.beat = id; save(); renderBeats();
    });
  }
}
$("beatNext").addEventListener("click", function(){ goStage(2); });

/* ---------- assignment card ---------- */
function assignmentHTML(){
  if(!S.topic) return "";
  return '<div class="assignment">' +
    '<div class="kicker">' + esc(beatName(S.beat)) + ' desk</div>' +
    '<h2>' + esc(S.topic.title) + '</h2>' +
    '<p>' + esc(S.topic.brief) + '</p>' +
    '<div class="tension">Where to look: ' + esc(S.topic.tension) + '</div>' +
  '</div>';
}

/* ---------- wheel ---------- */
var rotation = 0, spinning = false;
function renderWheelStage(){
  var pool = topicsFor(S.beat), html = "";
  for(var i=0;i<pool.length;i++){
    var a = i*90 + 45;
    var l = pool[i].short || [pool[i].title];
    html += '<g transform="rotate('+a+' 200 200)"><g class="lbl" data-a="'+a+'">' +
            '<text class="wheel-label" x="200" y="92" text-anchor="middle">' +
            '<tspan x="200">'+esc(l[0])+'</tspan>' +
            (l[1] ? '<tspan x="200" dy="19">'+esc(l[1])+'</tspan>' : "") +
            '</text></g></g>';
  }
  $("wheelLabels").innerHTML = html;

  if(S.topic){
    var idx = 0;
    for(var k=0;k<pool.length;k++){ if(pool[k].title === S.topic.title) idx = k; }
    rotation = -(idx*90 + 45);
    setWheel(rotation, true);
    uprightLabels(rotation); markSegment(idx);
    $("pickBtn").style.display = "";
    $("spinBtn").textContent = "Spin again";
    $("assignBox").innerHTML = assignmentHTML();
    $("assignNextRow").style.display = "";
  } else {
    rotation = 0; setWheel(0, true);
    uprightLabels(0); markSegment(-1);
    $("assignBox").innerHTML = "";
    $("assignNextRow").style.display = "none";
  }
}
/* keep every label reading horizontally once the wheel stops */
function uprightLabels(R){
  var ls = document.querySelectorAll("#wheelLabels .lbl");
  for(var i=0;i<ls.length;i++){
    var a = Number(ls[i].getAttribute("data-a"));
    var net = R === null ? 0 : -(((a + R) % 360 + 360) % 360);
    ls[i].setAttribute("transform", "rotate(" + net + " 200 92)");
  }
}
function markSegment(idx){
  for(var i=0;i<4;i++){
    var el = document.getElementById("seg"+i);
    if(el) el.classList.toggle("seg-on", i===idx);
  }
}
function setWheel(deg, instant){
  var g = $("wheelGroup");
  if(instant){ g.style.transition = "none"; }
  g.style.transform = "rotate(" + deg + "deg)";
  if(instant){ void g.offsetWidth; g.style.transition = ""; }
}
function landOn(idx){
  uprightLabels(rotation); markSegment(idx);
  var pool = topicsFor(S.beat);
  S.topic = pool[idx]; save();
  $("pickBtn").style.display = "";
  $("spinBtn").textContent = "Spin again";
  $("assignBox").innerHTML = assignmentHTML();
  $("assignNextRow").style.display = "";
}
$("spinBtn").addEventListener("click", function(){
  if(spinning) return;
  var pool = topicsFor(S.beat);
  if(!pool.length) return;
  spinning = true;
  $("spinBtn").disabled = true;
  $("assignBox").innerHTML = "";
  $("assignNextRow").style.display = "none";

  uprightLabels(null); markSegment(-1);
  var idx = Math.floor(Math.random() * pool.length);
  var target = -(idx*90 + 45);
  var delta = ((target - rotation) % 360 + 360) % 360;
  rotation = rotation + 360*5 + delta;
  setWheel(rotation, false);

  setTimeout(function(){
    spinning = false;
    $("spinBtn").disabled = false;
    landOn(idx);
  }, 4300);
});
$("pickBtn").addEventListener("click", function(){
  var pool = topicsFor(S.beat), html = "";
  for(var i=0;i<pool.length;i++){ html += '<button class="pick" data-idx="'+i+'">'+esc(pool[i].title)+'</button>'; }
  $("pickList").innerHTML = html;
  var picks = $("pickList").querySelectorAll(".pick");
  for(var j=0;j<picks.length;j++){
    picks[j].addEventListener("click", function(){
      var idx = Number(this.getAttribute("data-idx"));
      $("pickModal").classList.remove("on");
      rotation = -(idx*90 + 45);
      setWheel(rotation, true);
      landOn(idx);
    });
  }
  $("pickModal").classList.add("on");
});

/* ---------- prompt check ---------- */
function renderPromptCheck(){
  if(!S.topic){ goStage(3); return; }
  $("recap4").innerHTML = assignmentHTML();
  $("promptText").textContent = promptFor(S.topic);

  var tiles = "";
  for(var i=0;i<METHODS.length;i++){
    tiles += '<div class="method"><div class="method-step">Step '+(i+1)+'</div><b>'+esc(METHODS[i].name)+'</b><span>'+esc(METHODS[i].note)+'</span></div>';
  }
  $("methodTiles").innerHTML = tiles;

  var opts = '<option value="">Choose one</option>';
  for(var m=0;m<METHODS.length;m++){
    opts += '<option value="'+METHODS[m].name+'"'+(S.q1===METHODS[m].name?" selected":"")+'>'+METHODS[m].name+'</option>';
  }
  $("q1").innerHTML = opts;
  $("q1why").value = S.q1why || "";
}
["q1","q1why"].forEach(function(id){
  var el = $(id);
  el.addEventListener("input", function(){ S[id] = this.value; save(); });
  el.addEventListener("change", function(){ S[id] = this.value; save(); });
});
$("copyPromptBtn").addEventListener("click", function(){
  copyText(promptFor(S.topic), $("promptToast"));
});
$("next4").addEventListener("click", function(){
  var p = [];
  if(!S.q1) p.push("Choose which method gave you the best background context.");
  if(!S.q1why || S.q1why.trim().length < 10) p.push("Write one or two sentences on why that method was useful.");
  if(p.length){ $("warn4").innerHTML = '<div class="alert">' + p.join("<br>") + '</div>'; return; }
  $("warn4").innerHTML = "";
  goStage(5);
});

/* ---------- sources ---------- */
function renderSources(){
  if(!S.topic){ goStage(3); return; }
  $("recap5").innerHTML = assignmentHTML();
  renderSrcTabs();
  renderSrcBody();
  renderMix();
}
/* The tab bar is built once per visit to this stage and then mutated in place.
   Rebuilding it on every keystroke destroyed the node a click had started on,
   which swallowed the first click on another tab. */
function renderSrcTabs(){
  var html = "";
  for(var i=0;i<3;i++){
    html += '<button class="src-tab" data-i="'+i+'">Source ' + (i+1) + '</button>';
  }
  $("srcTabs").innerHTML = html;
  var t = $("srcTabs").querySelectorAll(".src-tab");
  for(var j=0;j<t.length;j++){
    t[j].addEventListener("click", function(){
      S.activeSrc = Number(this.getAttribute("data-i")); save();
      paintTabs(); renderSrcBody();
    });
  }
  paintTabs();
}
function paintTabs(){
  var t = $("srcTabs").querySelectorAll(".src-tab");
  for(var i=0;i<t.length;i++){
    var done = srcDone(S.sources[i]);
    t[i].classList.toggle("on", S.activeSrc === i);
    t[i].classList.toggle("done", done);
    var tick = t[i].querySelector(".tick");
    if(done && !tick){
      var sp = document.createElement("span");
      sp.className = "tick"; sp.innerHTML = "&#10003;";
      t[i].appendChild(sp);
    } else if(!done && tick){
      tick.parentNode.removeChild(tick);
    }
  }
}
function renderSrcBody(){
  var i = S.activeSrc, s = S.sources[i] || {};
  var opts = '<option value="">Type of source</option>';
  for(var t=0;t<SRC_TYPES.length;t++){
    opts += '<option'+(s.type===SRC_TYPES[t]?" selected":"")+'>'+SRC_TYPES[t]+'</option>';
  }
  $("srcBody").innerHTML =
    '<div class="field"><label>Article title</label><input type="text" data-f="title" value="'+esc(s.title)+'" placeholder="Headline as it appears on the page"></div>' +
    '<div class="field"><label>Link</label><input type="url" data-f="url" value="'+esc(s.url)+'" placeholder="https://"></div>' +
    '<div class="grid3">' +
      '<div class="field"><label>Publisher or outlet</label><input type="text" data-f="outlet" value="'+esc(s.outlet)+'"></div>' +
      '<div class="field"><label>Date published</label><input type="text" data-f="date" value="'+esc(s.date)+'" placeholder="e.g. 14 Oct 2026"></div>' +
      '<div class="field"><label>Type</label><select data-f="type">'+opts+'</select></div>' +
    '</div>' +
    '<div class="field"><label>Which method found it</label><select data-f="found">' + foundOpts(s.found) + '</select></div>' +
    '<div class="field" style="margin-bottom:0"><label>Why this one matters</label><input type="text" data-f="why" value="'+esc(s.why)+'" placeholder="One line. What it gives you that the others do not."></div>';

  var inputs = $("srcBody").querySelectorAll("[data-f]");
  for(var k=0;k<inputs.length;k++){
    inputs[k].addEventListener("input", onSrcChange);
    inputs[k].addEventListener("change", onSrcChange);
  }
}
function foundOpts(val){
  var o = '<option value="">Where it came from</option>';
  for(var m=0;m<METHODS.length;m++){
    o += '<option'+(val===METHODS[m].name?" selected":"")+'>'+METHODS[m].name+'</option>';
  }
  o += '<option'+(val==="Followed a link from another source"?" selected":"")+'>Followed a link from another source</option>';
  return o;
}
function onSrcChange(){
  var i = S.activeSrc, f = this.getAttribute("data-f");
  if(!S.sources[i]) S.sources[i] = {};
  S.sources[i][f] = this.value;
  save();
  paintTabs();
  renderMix();
}
function renderMix(){
  var counts = {};
  for(var i=0;i<3;i++){
    var s = S.sources[i] || {};
    if(s.url && s.type){ counts[s.type] = (counts[s.type]||0)+1; }
  }
  var html = "";
  for(var t=0;t<SRC_TYPES.length;t++){
    var n = counts[SRC_TYPES[t]] || 0;
    html += '<span class="chip'+(n?" has":"")+'">'+SRC_TYPES[t]+(n?" "+n:"")+'</span>';
  }
  $("mix").innerHTML = html;
}
$("next5").addEventListener("click", function(){
  var filled = 0, types = {};
  for(var i=0;i<3;i++){
    var s = S.sources[i] || {};
    if(srcStarted(s)){ filled++; if(s.type) types[s.type] = 1; }
  }
  if(filled < 3){
    $("warn5").innerHTML = '<div class="alert">All three sources need a link before you move on.</div>';
    return;
  }
  var msg = "";
  if(Object.keys(types).length < 2){
    msg = '<div class="alert">Every source is the same type so far. Worth saying why in your workflow note.</div>';
  }
  $("warn5").innerHTML = msg;
  goStage(6);
});

/* ---------- workflow ---------- */
function renderWorkflow(){
  if(!S.topic){ goStage(3); return; }
  $("recap6").innerHTML = assignmentHTML();
  $("method").value = S.method || "";
}
$("method").addEventListener("input", function(){ S.method = this.value; save(); });
$("fileBtn").addEventListener("click", function(){
  if(!S.method || S.method.trim().length < 20){
    $("warn6").innerHTML = '<div class="alert">Write a few lines on how you actually worked before you file.</div>';
    return;
  }
  $("warn6").innerHTML = "";
  goStage(7);
});

/* ---------- summary ---------- */
function summaryText(){
  var L = [];
  L.push("STORY HUNT, " + beatName(S.beat) + " desk");
  L.push("");
  L.push("TOPIC: " + (S.topic ? S.topic.title : ""));
  L.push("");
  L.push("PROMPT CHECK");
  L.push("Best for background context: " + S.q1);
  L.push("Why: " + S.q1why);
  L.push("");
  L.push("WORKFLOW: " + S.method);
  L.push("");
  L.push("SOURCES:");
  var n = 0;
  for(var i=0;i<3;i++){
    var s = S.sources[i] || {};
    if(!s.url) continue;
    n++;
    L.push(n + ". " + (s.title || "Untitled") + " (" + s.url + ")");
    L.push("   " + (s.outlet || "Unnamed outlet") + (s.date ? ", " + s.date : "") + (s.type ? ", " + s.type : ""));
    if(s.found) L.push("   Found via: " + s.found);
    if(s.why) L.push("   Why: " + s.why);
  }
  return L.join("\n");
}
function renderSummary(){
  var h = "";
  h += '<h3>' + esc(beatName(S.beat)) + ' desk</h3>';
  h += '<p>' + esc(S.topic ? S.topic.title : "") + '</p>';
  h += '<h3>Prompt check</h3>';
  h += '<p class="small">Best for background context: ' + esc(S.q1) + '</p>';
  h += '<p class="small">' + esc(S.q1why) + '</p>';
  h += '<h3>Workflow</h3><p>' + esc(S.method) + '</p>';
  h += '<h3>Sources</h3>';
  var any = false;
  for(var i=0;i<3;i++){
    var s = S.sources[i] || {};
    if(!s.url) continue;
    any = true;
    h += '<div class="src-line">' +
      '<b><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title || "Untitled") + '</a></b>' +
      '<span>' + esc(s.outlet || "Unnamed outlet") + (s.date ? ", " + esc(s.date) : "") + (s.type ? ", " + esc(s.type) : "") + '</span>' +
      (s.found ? '<span>Found via ' + esc(s.found) + '</span>' : "") +
      (s.why ? '<span>' + esc(s.why) + '</span>' : "") +
    '</div>';
  }
  if(!any) h += '<p class="muted">No sources added.</p>';
  $("summary").innerHTML = h;
}

/* ---------- copy, padlet, reset ---------- */
function copyText(txt, toastEl){
  function done(){
    if(!toastEl) return;
    toastEl.classList.add("on");
    setTimeout(function(){ toastEl.classList.remove("on"); }, 2000);
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(done, function(){ fallbackCopy(txt, done); });
  } else { fallbackCopy(txt, done); }
}
function fallbackCopy(txt, cb){
  var ta = document.createElement("textarea");
  ta.value = txt; ta.setAttribute("readonly",""); ta.style.position="absolute"; ta.style.left="-9999px";
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); cb(); }catch(e){}
  document.body.removeChild(ta);
}
$("copyBtn").addEventListener("click", function(){ copyText(summaryText(), $("copyToast")); });
$("padletBtn").addEventListener("click", function(){ window.open(PADLET, "_blank", "noopener"); });
$("printBtn").addEventListener("click", function(){ window.print(); });
$("resetBtn").addEventListener("click", function(){
  if(!confirm("Clear everything and start a new hunt?")) return;
  try{ localStorage.removeItem(KEY); }catch(e){}
  S = JSON.parse(JSON.stringify(BLANK));
  rotation = 0; setWheel(0, true);
  renderBeats(); goStage(0);
});

/* ---------- gnomi ---------- */
$("gnomiBtn").addEventListener("click", function(){ $("gnomiModal").classList.add("on"); });
$("gnomiGo").addEventListener("click", function(){ window.open(GNOMI_URL, "_blank", "noopener"); });
document.addEventListener("click", function(e){
  if(e.target.classList && e.target.classList.contains("scrim")){ e.target.classList.remove("on"); }
});
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    var open = document.querySelectorAll(".scrim.on");
    for(var i=0;i<open.length;i++){ open[i].classList.remove("on"); }
  }
});

/* ---------- topic bank ---------- */
function renderBank(){
  var html = "";
  for(var b=0;b<BEATS.length;b++){
    var list = topicsFor(BEATS[b].id), items = "";
    for(var i=0;i<list.length;i++){
      items += '<div class="bank-item"><b>'+esc(list[i].title)+'</b><p>'+esc(list[i].brief)+'</p>' +
               '<p class="tension-line">Where to look: '+esc(list[i].tension)+'</p></div>';
    }
    html += '<div class="bank-group">' +
      '<button class="bank-head" data-g="'+b+'">' +
        '<span class="bh-left"><svg><use href="#'+BEATS[b].icon+'"></use></svg>'+BEATS[b].name+'</span>' +
        '<span class="small muted">'+list.length+' assignments</span></button>' +
      '<div class="bank-body" id="bank-'+b+'">'+items+'</div></div>';
  }
  $("bankList").innerHTML = html;
  var heads = $("bankList").querySelectorAll(".bank-head");
  for(var h=0;h<heads.length;h++){
    heads[h].addEventListener("click", function(){
      $("bank-"+this.getAttribute("data-g")).classList.toggle("on");
    });
  }
  $("bank-0").classList.add("on");
}

/* ---------- boot ---------- */
load();
renderBeats();
renderBank();
goStage(S.beat ? S.stage : 0);
