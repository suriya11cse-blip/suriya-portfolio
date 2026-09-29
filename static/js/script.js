/* ---- Config ---- */
var CONFIG = {
  email: "suriya11.cse@gmail.com",
  phone: "8870256728",
  linkedin: "",
  github: "",
  portfolio: "",
  resume: "",
  photo: ""
};

var SHOTS = { leaf: "", travel: "", fitness: "", figma: "" };
var SKILLS = [["Python",8,0],["Java",7,0],["JavaScript",7,0],["React",6,0],["SQL and MongoDB",6,0],["UI/UX design",8,1]];

/* ---- Pixel avatar ---- */
var SPRITE = [
  "....HHHHHHHH....","...HHHHHHHHHH...","..HHHHHHHHHHHH..","..HHSSSSSSSSHH..",
  "..HSFFFSSFFFSH..","..HSFEFSSFEFSH..","..HSFFFSSFFFSH..","...SSSSSSSSSS...",
  "....SSSMMSSS....",".....SSSSSS.....","...CCCCCCCCCC...","..CCCCCCCCCCCC..",
  ".SCCCGCCCCGCCCS.",".SCCCCCCCCCCCCS.","..DDDDDDDDDDDD..","..DDDD....DDDD..","..BBBB....BBBB.."
];
var PAL = {H:"#6a3fd1",S:"#f1bd93",F:"#35e0ff",E:"#14122b",M:"#b5573f",C:"#ff3d9a",G:"#ffd23f",D:"#a3155f",B:"#2a1a66"};

function spriteSVG(){
  var r = "";
  SPRITE.forEach(function(row,y){
    for (var x = 0; x < row.length; x++){
      var c = row[x];
      if (c !== ".") r += '<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+PAL[c]+'"/>';
    }
  });
  return '<svg viewBox="0 0 16 17" shape-rendering="crispEdges" aria-hidden="true" style="width:100%;height:100%;display:block">'+r+'</svg>';
}
document.querySelectorAll("[data-sprite]").forEach(function(el){ el.innerHTML = spriteSVG(); });

/* ---- Photo and screenshots ---- */
if (CONFIG.photo){
  var pf = document.getElementById("pframe");
  if (pf) pf.innerHTML = '<img src="'+CONFIG.photo+'" alt="Photo of Suriya S" loading="lazy">';
}
document.querySelectorAll("[data-shot]").forEach(function(card){
  var src = SHOTS[card.getAttribute("data-shot")];
  if (!src) return;
  var title = card.querySelector("h3").textContent;
  card.querySelector(".art").innerHTML = '<img src="'+src+'" alt="Screenshot of '+title+'" loading="lazy">';
});

/* ---- High scores ---- */
var list = document.getElementById("scores");
if (list){
  SKILLS.forEach(function(s){
    var pips = "";
    for (var i = 0; i < 10; i++) pips += '<i class="' + (i < s[1] ? "on" : "") + '"></i>';
    var li = document.createElement("li");
    li.innerHTML = '<span>'+s[0]+'</span><span class="dots"></span><span class="pips'+(s[2] ? " warm" : "")+'" role="img" aria-label="'+s[0]+', level '+s[1]+' of 10">'+pips+'</span>';
    list.appendChild(li);
  });
}

/* ---- Links ---- */
document.querySelectorAll("[data-link]").forEach(function(a){
  var key = a.getAttribute("data-link"), v = CONFIG[key];
  if (!v) return;
  if (key === "email") v = "mailto:" + v;
  if (key === "phone") v = "tel:+91" + v.replace(/\D/g,"");
  a.setAttribute("href", v);
  a.hidden = false;
});

/* ---- Theme ---- */
var root = document.documentElement, modeBtn = document.getElementById("mode");
var saved = null;
try { saved = localStorage.getItem("suriya-arcade-theme"); } catch(e){}
root.setAttribute("data-theme", saved === "light" ? "light" : "dark");

function syncMode(){
  if (!modeBtn) return;
  var dark = root.getAttribute("data-theme") === "dark";
  modeBtn.textContent = dark ? "Day mode" : "Night mode";
  modeBtn.setAttribute("aria-pressed", String(!dark));
}
syncMode();

if (modeBtn){
  modeBtn.addEventListener("click", function(){
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("suriya-arcade-theme", next); } catch(e){}
    syncMode();
  });
}

/* ---- CSRF helper ---- */
function getCookie(name){
  var v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return v ? v.pop() : '';
}

/* ---- Contact form ---- */
var form = document.getElementById('contactForm');
if (form){
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    var btn = document.getElementById('sendBtn');
    var status = document.getElementById('formStatus');
    var data = Object.fromEntries(new FormData(form));
    delete data.csrfmiddlewaretoken;

    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.textContent = '';

    try {
      var res = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
      });
      var out = await res.json();
      if (!res.ok) throw new Error(out.error || 'Failed');
      status.style.color = '#0a8fb0';
      status.textContent = '✅ Message sent! I will reply soon.';
      form.reset();
    } catch (err){
      status.style.color = '#d4187a';
      status.textContent = '❌ ' + err.message;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send message';
    }
  });
}

/* ---- Track page view ---- */
fetch('/api/track/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  },
  body: JSON.stringify({ path: location.pathname })
}).catch(function(){});