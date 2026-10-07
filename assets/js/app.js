function $(id){return document.getElementById(id)}
document.querySelectorAll(".year").forEach(e=>e.textContent=new Date().getFullYear());

function toggleMenu(){ $("mainNav").classList.toggle("show"); }

function cardHTML(s){
return `<article class="scheme-card"><div class="scheme-icon">${s.icon}</div><span class="pill">${s.category}</span><h3>${s.name}</h3><p>${s.summary}</p><div class="rate"><small>Rate</small><b>${s.rate}</b></div><a class="btn secondary full" href="scheme.html?id=${s.id}">View Details →</a></article>`;
}

function renderSchemes(){
const grid=$("schemeGrid"); if(!grid)return;
const q=($("searchInput")?.value||"").toLowerCase(); const cat=$("categoryFilter")?.value||"all";
const list=getSchemes().filter(s=>(cat==="all"||s.category===cat)&&(s.name+" "+s.summary).toLowerCase().includes(q));
grid.innerHTML=list.length?list.map(cardHTML).join(""):`<div class="empty">No matching loan schemes found.</div>`;
}

function renderFeatured(){
const el=$("featuredSchemes"); if(!el)return;
el.innerHTML=getSchemes().slice(0,4).map(cardHTML).join("");
}

function renderSchemeDetail(){
const el=$("schemeDetail"); const id=new URLSearchParams(location.search).get("id"); const s=getScheme(id);
if(!s){el.innerHTML=`<div class="empty"><h2>Scheme not found</h2><a class="btn primary" href="schemes.html">Back to schemes</a></div>`;return}
el.innerHTML=`<a class="back" href="schemes.html">← Back to Loan Schemes</a>
<div class="detail-grid"><div><div class="big-icon">${s.icon}</div><span class="pill">${s.category}</span><h1>${s.name}</h1><p class="lead">${s.summary}</p>
<div class="stat-row"><div><small>Interest Rate</small><b>${s.rate}</b></div><div><small>Loan Amount</small><b>${s.amount}</b></div><div><small>Repayment</small><b>${s.period}</b></div></div></div>
<div class="highlight"><span>✓</span><h3>Eligibility</h3><p>${s.eligibility}</p><a class="btn primary full" href="contact.html">Contact Branch</a></div></div>
<div class="detail-section"><h2>Required Documents</h2><div class="doc-list">${s.documents.map((d,i)=>`<div><span>${String(i+1).padStart(2,"0")}</span>${d}</div>`).join("")}</div></div>
<div class="notice"><div class="notice-icon">!</div><div><b>Rate & approval notice</b><p>Displayed rate information must be verified against the latest approved BOC rate circular and applicable scheme conditions before customer use.</p></div></div>`;
}

function renderRates(){
const body=$("ratesTable"); if(!body)return;
body.innerHTML=getSchemes().map(s=>`<tr><td><a href="scheme.html?id=${s.id}">${s.name}</a></td><td>${s.category}</td><td><b>${s.rate}</b></td><td>${s.rateType}</td><td>${localStorage.getItem("bocLastUpdated")||"Not set"}</td></tr>`).join("");
}

function adminLogin(){
const user=($("adminUser")?.value||"").trim();
const pass=$("adminPass")?.value||"";
if(user==="admin" && pass==="boc123"){
  sessionStorage.setItem("bocAdmin","1");
  showAdmin();
}else{
  alert("Incorrect demo login.\nUsername: admin\nPassword: boc123");
}
}
function adminLogout(){sessionStorage.removeItem("bocAdmin");location.reload()}
function showAdmin(){
$("loginBox").classList.add("hidden");$("adminPanel").classList.remove("hidden");
const data=getSchemes(); $("adminRows").innerHTML=data.map((s,i)=>`<div class="admin-row"><b>${s.name}</b><label>Rate<input data-rate="${i}" value="${s.rate}"></label><label>Rate type<input data-type="${i}" value="${s.rateType}"></label><label>Amount<input data-amount="${i}" value="${s.amount}"></label><label>Period<input data-period="${i}" value="${s.period}"></label></div>`).join("");
}
function saveAdminData(){
const data=getSchemes(); data.forEach((s,i)=>{s.rate=document.querySelector(`[data-rate="${i}"]`).value;s.rateType=document.querySelector(`[data-type="${i}"]`).value;s.amount=document.querySelector(`[data-amount="${i}"]`).value;s.period=document.querySelector(`[data-period="${i}"]`).value});
saveSchemes(data);localStorage.setItem("bocLastUpdated",new Date().toLocaleDateString());alert("Saved successfully.");showAdmin();
}
function resetData(){if(confirm("Reset all demo data?")){resetSchemes();localStorage.removeItem("bocLastUpdated");showAdmin();}}
function makeQR(){
const url=$("siteUrl").value.trim();if(!url)return alert("Enter the public website URL first.");
$("qrcode").innerHTML="";new QRCode($("qrcode"),{text:url,width:220,height:220});
}
document.addEventListener("DOMContentLoaded",()=>{
  renderFeatured();
  if(sessionStorage.getItem("bocAdmin")==="1" && $("adminPanel")) showAdmin();
  $("adminPass")?.addEventListener("keydown",e=>{if(e.key==="Enter")adminLogin();});
});
