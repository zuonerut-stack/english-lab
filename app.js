marked.setOptions({
breaks:false
})

let currentTab="learning"
let currentSubject=null
let dataset=[]
let current=null

let mcq=null
let hintStep=0

/* --------------------------
UTILITIES
-------------------------- */

function rand(arr){
return arr[Math.floor(Math.random()*arr.length)]
}

function shuffle(arr){
return arr.sort(()=>Math.random()-0.5)
}

function normalizeDataset(obj){

let arr=[]

for(let key in obj){

let item=obj[key]

arr.push({
keyword:key,
domain:item.domain || item.root,
synonyms:item.synonyms || []
})

}

return arr
}

function isContextSubject(){

return (
currentSubject=="contrast" ||
currentSubject=="similar" ||
currentSubject=="commonsense" ||
currentSubject=="mixed"
)

}

function isEtymologySubject(){

return (
currentSubject=="angloPrefix" ||
currentSubject=="latinPrefix" ||
currentSubject=="latinRoot" ||
currentSubject=="greekElement"
)

}

/* --------------------------
TAB CONTROL
-------------------------- */

function switchTab(tab){

currentTab=tab

document.getElementById("learningPage").style.display=
tab==="learning" ? "block":"none"

document.getElementById("drillPage").style.display=
tab==="drill" ? "block":"none"

if(tab==="drill" && dataset.length>0){
next()
}

}

/* --------------------------
MARKDOWN
-------------------------- */

async function loadMarkdown(path){

let div = document.getElementById("learningContent")

div.innerHTML="Loading..."

try{

let response = await fetch(path)

if(!response.ok){
throw new Error("File not found")
}

let text = await response.text()

div.innerHTML=
"<h3>"+currentSubject+"</h3>"+
"<div class='markdown'>"+marked.parse(text)+"</div>"+
"<button onclick='switchTab(\"drill\")'>Start Drill</button>"

}catch(e){

console.error(e)

div.innerHTML=
"<h3>"+currentSubject+"</h3>"+
"<p>Failed to load learning content.</p>"

}

}

/* --------------------------
SUBJECT LOADER
-------------------------- */

function setSubject(subject){

currentSubject=subject

/* CONTEXT */

if(subject=="contrast"){
dataset=window.contrastData||[]
loadMarkdown("./learning/Context_Contrast.md")
return
}

if(subject=="similar"){
dataset=window.similarData||[]
loadMarkdown("./learning/Sim.md")
return
}

if(subject=="commonsense"){
dataset=window.commonsenseData||[]
loadMarkdown("./learning/Commonsenses.md")
return
}

if(subject=="mixed"){
dataset=[
...(window.mixedData||[]),
...(window.contrastData||[]),
...(window.similarData||[]),
...(window.commonsenseData||[])
]
loadMarkdown("./learning/Mixed.md")
return
}

if(subject=="CI"){
dataset=normalizeDataset(window.CIData||{})
loadMarkdown("./learning/CenIdea.md")
return
}

/* ETYMOLOGY */

if(subject=="angloPrefix"){
dataset=normalizeDataset(window.ASData||{})
loadMarkdown("./learning/AS.md")
return
}

if(subject=="latinPrefix"){
dataset=normalizeDataset(window.LPData||{})
loadMarkdown("./learning/latin_pref.md")
return
}

if(subject=="latinRoot"){
dataset=normalizeDataset(window.LRData||{})
loadMarkdown("./learning/latin_roots.md")
return
}

if(subject=="greekElement"){
dataset=normalizeDataset(window.GData||{})
loadMarkdown("./learning/Greeks.md")
return
}

if(subject=="mixed2"){

dataset=[

...normalizeDataset(window.ASData||{}),
...normalizeDataset(window.LPData||{}),
...normalizeDataset(window.LRData||{}),
...normalizeDataset(window.GData||{}),
...normalizeDataset(window.CIData||{})

]

loadMarkdown("./learning/WordPlay.md")

return
}

if(subject=="phrase"){
dataset=window.phraseData||[]
loadMarkdown("learning/phrases.md")
return
}

showLearning()

}

/* --------------------------
LEARNING PAGE
-------------------------- */

function showLearning(){

let div=document.getElementById("learningContent")

if(!currentSubject){

div.innerHTML="Select a subject."
return

}

let html="<h3>"+currentSubject+"</h3>"
html+="<p>Items: "+dataset.length+"</p>"
html+="<button onclick='switchTab(\"drill\")'>Start Drill</button>"

div.innerHTML=html

}

/* --------------------------
NEXT QUESTION
-------------------------- */

function next(){

if(dataset.length==0) return

document.getElementById("result").innerHTML=""

let mcqDiv=document.getElementById("mcq")
let inputBox=document.getElementById("answer")

/* CONTEXT DRILL */

if(isContextSubject()){

mcqDiv.style.display="none"
inputBox.style.display="block"

current=rand(dataset)

inputBox.value=""

document.getElementById("question").innerHTML=
current.sentence.replace(current.target,"_____")

return
}

/* ETYMOLOGY DRILL */

if(isEtymologySubject()){

mcqDiv.style.display="block"
inputBox.style.display="none"

generateMCQ()

}

}

/* --------------------------
MCQ GENERATION
-------------------------- */

function generateMCQ(){

hintStep=0

if(Math.random()<0.5){
generateTypeA()
}else{
generateTypeB()
}

renderMCQ()

}

function generateTypeA(){

let base=rand(dataset)

let correct=rand([base.keyword,...base.synonyms])

let distractors=[]

while(distractors.length<3){

let d=rand(dataset)

if(d.domain!=base.domain){

let word=rand([d.keyword,...d.synonyms])

distractors.push(word)

}

}

let choices=shuffle([correct,...distractors])

mcq={
type:"A",
answer:correct,
choices:choices
}

}

function generateTypeB(){

let base=rand(dataset)

let same=dataset.filter(x=>x.domain==base.domain)

let correct=[]

while(correct.length<3){

let item=rand(same)

let word=rand([item.keyword,...item.synonyms])

if(!correct.includes(word)){
correct.push(word)
}

}

let odd

while(true){

let d=rand(dataset)

if(d.domain!=base.domain){

odd=rand([d.keyword,...d.synonyms])
break

}

}

let choices=shuffle([...correct,odd])

mcq={
type:"B",
answer:odd,
choices:choices
}

}

/* --------------------------
MCQ RENDER
-------------------------- */

function renderMCQ(){

let q=document.getElementById("question")

let buttons=document.querySelectorAll("#mcq .choice")

if(mcq.type=="A"){
q.innerHTML="Choose the word MOST similar."
}else{
q.innerHTML="Choose the word that DOES NOT belong."
}

buttons.forEach((b,i)=>{

b.disabled=false
b.style.visibility="visible"

b.innerText=mcq.choices[i]

b.onclick=()=>checkChoice(b.innerText,b)

})

}

/* --------------------------
CHECK
-------------------------- */

function check(){

if(!isContextSubject()) return

let user=document.getElementById("answer").value.trim().toLowerCase()

let result=document.getElementById("result")

if(user==current.target){
result.innerHTML="✔ Correct"
}else{
result.innerHTML="Answer: "+current.target
}

}

function checkChoice(choice,btn){

let result=document.getElementById("result")

if(choice==mcq.answer){

result.innerHTML="✔ Correct"

setTimeout(next,800)

}else{

btn.disabled=true

result.innerHTML="✘ Try again"

}

}

/* --------------------------
HINT
-------------------------- */

function hint(){

let result=document.getElementById("result")

if(isContextSubject()){

result.innerHTML="Hint: "+current.clue
return

}

if(!mcq) return

let buttons=[...document.querySelectorAll("#mcq .choice")]

let wrong=buttons.filter(
b=>b.innerText!=mcq.answer && b.style.visibility!="hidden"
)

if(hintStep<2 && wrong.length>0){

rand(wrong).style.visibility="hidden"

hintStep++

}else{

result.innerHTML="Answer: "+mcq.answer

setTimeout(next,1000)

}

}
