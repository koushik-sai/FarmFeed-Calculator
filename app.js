const $=id=>document.getElementById(id);
const KEY='farmfeed.v1';
let db=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{animals:[],records:[]}}catch{return {animals:[],records:[]}}}
function persist(){localStorage.setItem(KEY,JSON.stringify(db));}
function id(){return 'a'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function num(v){return Number(v)}
function fmt(v){return `${(Math.round(v*1000)/1000).toFixed(3)} kg`}
function calc(){
 const w=num($('weight').value), intake=num($('intakePct').value), dm=num($('dmPct').value), n=num($('servings').value);
 if(!(w>0&&intake>0&&dm>0&&dm<=100)){ $('dailyKg').textContent='—';$('dmGrams').textContent='Enter valid values';$('servingRows').innerHTML='';return null;}
 const dmKg=w*intake/100, asFed=dmKg/(dm/100), rows=[];
 const names=n===2?['Morning','Evening']:n===3?['Morning','Afternoon','Evening']:['Morning','Late morning','Afternoon','Evening'];
 for(let i=0;i<n;i++){const amount=asFed/n;rows.push({name:names[i],kg:amount});}
 $('dailyKg').textContent=fmt(asFed);$('dmGrams').textContent=`${Math.round(dmKg*1000)} g dry matter per day`;
 $('servingRows').innerHTML=rows.map(r=>`<div class="serving"><span>${r.name}</span><b>${Math.round(r.kg*1000)} g (${(r.kg).toFixed(3)} kg)</b></div>`).join('');
 return {w,intake,dm,n,dmKg,asFed,rows};
}
function renderAnimals(){
 $('animalSelect').innerHTML='<option value="">Manual entry</option>'+db.animals.map(a=>`<option value="${a.id}">${esc(a.name)} · ${a.weight} kg</option>`).join('');
 $('animalList').innerHTML=db.animals.length?db.animals.map(a=>`<div class="animal-card"><div><strong>${esc(a.name)} · ${a.species}</strong><p>${esc(a.age||'Age not recorded')} · ${a.weight} kg</p></div><div class="mini-actions"><button class="secondary" onclick="useAnimal('${a.id}')">Calculate</button><button class="secondary" onclick="editAnimal('${a.id}')">Edit</button><button class="danger" onclick="deleteAnimal('${a.id}')">Delete</button></div></div>`).join(''):'<div class="empty">No animals added yet. Add your first animal above.</div>';
}
function renderHistory(){
 $('historyList').innerHTML=db.records.length?[...db.records].reverse().map(r=>`<div class="record-card"><div><strong>${esc(r.animal||'Manual entry')} · ${r.species}</strong><p>${new Date(r.date).toLocaleString()} · ${r.weight} kg live weight · ${r.daily.toFixed(3)} kg TMR/day</p><p>${r.servings.map(s=>s.name+': '+Math.round(s.kg*1000)+' g').join(' · ')}</p></div><button class="danger" onclick="deleteRecord('${r.id}')">Delete</button></div>`).join(''):'<div class="empty">No saved feed records yet.</div>';
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
window.useAnimal=x=>{const a=db.animals.find(v=>v.id===x);if(!a)return;$('animalSelect').value=x;$('species').value=a.species;$('weight').value=a.weight;switchTab('calculator');calc();};
window.editAnimal=x=>{const a=db.animals.find(v=>v.id===x);if(!a)return;$('animalId').value=a.id;$('animalName').value=a.name;$('animalSpecies').value=a.species;$('animalAge').value=a.age||'';$('animalWeight').value=a.weight;$('animalSubmit').textContent='Update animal';window.scrollTo({top:0,behavior:'smooth'});};
window.deleteAnimal=x=>{if(confirm('Delete this animal? Existing feed records will remain.')){db.animals=db.animals.filter(a=>a.id!==x);persist();renderAnimals();}};
window.deleteRecord=x=>{db.records=db.records.filter(r=>r.id!==x);persist();renderHistory();};
function switchTab(t){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===t));}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
['weight','intakePct','dmPct','servings'].forEach(x=>$(x).addEventListener('input',calc));
$('animalSelect').addEventListener('change',e=>{const a=db.animals.find(v=>v.id===e.target.value);if(a){$('species').value=a.species;$('weight').value=a.weight;calc();}});
$('saveRecord').addEventListener('click',()=>{const c=calc();if(!c)return;const a=db.animals.find(v=>v.id===$('animalSelect').value);db.records.push({id:id(),date:new Date().toISOString(),animal:a?.name||'Manual entry',species:$('species').value,weight:c.w,intakePct:c.intake,dmPct:c.dm,daily:c.asFed,servings:c.rows});persist();renderHistory();alert('Feed calculation saved on this device.');});
$('resetCalc').addEventListener('click',()=>{$('animalSelect').value='';$('species').value='Sheep';$('weight').value=16;$('intakePct').value=3;$('dmPct').value=60;$('servings').value=3;calc();});
$('animalForm').addEventListener('submit',e=>{e.preventDefault();const x=$('animalId').value;const a={id:x||id(),name:$('animalName').value.trim(),species:$('animalSpecies').value,age:$('animalAge').value.trim(),weight:num($('animalWeight').value)};if(x)db.animals=db.animals.map(v=>v.id===x?a:v);else db.animals.push(a);persist();e.target.reset();$('animalId').value='';$('animalSubmit').textContent='Add animal';renderAnimals();});
$('cancelEdit').addEventListener('click',()=>{$('animalForm').reset();$('animalId').value='';$('animalSubmit').textContent='Add animal';});
$('exportData').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='farmfeed-backup.json';a.click();URL.revokeObjectURL(a.href);});
$('importData').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!Array.isArray(x.animals)||!Array.isArray(x.records))throw Error();db=x;persist();renderAnimals();renderHistory();alert('Backup imported.');}catch{alert('Invalid FarmFeed backup file.');}e.target.value='';});
$('clearHistory').addEventListener('click',()=>{if(confirm('Delete all saved animals and feed records from this device? Export a backup first if needed.')){db={animals:[],records:[]};persist();renderAnimals();renderHistory();}});
function status(){ $('connection').textContent=navigator.onLine?'Online · offline-ready':'Offline mode';}
window.addEventListener('online',status);window.addEventListener('offline',status);
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
status();renderAnimals();renderHistory();calc();