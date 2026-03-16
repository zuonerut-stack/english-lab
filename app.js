marked.setOptions({
breaks:false
})

let currentTab="learning"
let currentSubject=null
let dataset=[]
let current=null


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

async function loadMarkdown(path){

let div = document.getElementById("learningContent")

div.innerHTML = "Loading..."

try{

let response = await fetch(path)

if(!response.ok){
throw new Error("File not found: " + path)
}

let text = await response.text()

div.innerHTML =
"<h3>"+currentSubject+"</h3>"+
"<div class='markdown'>"+marked.parse(text)+"</div>"+
"<button onclick='switchTab(\"drill\")'>Start Drill</button>"

}catch(e){

console.error(e)

div.innerHTML =
"<h3>"+currentSubject+"</h3>"+
"<p>Failed to load learning content.</p>"

}

}

/* --------------------------
MARKDOWN LOADER
-------------------------- */

function setSubject(subject){

currentSubject = subject

/* CONTEXT BASED */

if(subject=="contrast"){
dataset = window.contrastData || []
loadMarkdown("./learning/Context_Contrast.md")
return
}

if(subject=="similar"){
dataset = window.similarData || []
loadMarkdown("./learning/Sim.md")
return
}

if(subject=="commonsense"){
dataset = window.commonsenseData || []
loadMarkdown("./learning/Commonsenses.md")
return
}

if(subject=="mixed"){
dataset=[
  ...(window.mixedData || []),
  ...(window.contrastData || []),
  ...(window.similarData || []),
  ...(window.commonsenseData || [])
]
loadMarkdown("./learning/Mixed.md")
return
}

if(subject=="CI"){
loadMarkdown("./learning/CenIdea.md")
return
}

/* ETYMOLOGY BASED */

if(subject=="angloPrefix"){
dataset = window.angloPrefixData || []
loadMarkdown("./learning/AS.md")
return
}

if(subject=="latinPrefix"){
dataset = window.latinPrefixData || []
loadMarkdown("./learning/latin_pref.md")
return
}

if(subject=="latinRoot"){
dataset = window.latinRootData || []
loadMarkdown("./learning/latin_roots.md")
return
}

if(subject=="greekElement"){
dataset = window.greekElementData || []
loadMarkdown("./learning/Greeks.md")
return
}

if(subject=="phrase"){
dataset= window.phraseData || []
loadMarkdown("learning/phrases.md")
return
}

showLearning()

}

/* HTML escape */

function escapeHtml(text){

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")

}


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


function next(){

if(dataset.length==0) return

current=dataset[Math.floor(Math.random()*dataset.length)]

document.getElementById("answer").value=""
document.getElementById("result").innerHTML=""

/* CONTEXT FLASHCARD */

if(
currentSubject=="contrast" ||
currentSubject=="similar" ||
currentSubject=="commonsense" ||
currentSubject=="mixed"
){

document.getElementById("question").innerHTML=
current.sentence.replace(current.target,"_____")

}

/* ETYMOLOGY */

if(
currentSubject=="angloPrefix" ||
currentSubject=="latinPrefix" ||
currentSubject=="latinRoot" ||
currentSubject=="greekElement"
){

document.getElementById("question").innerHTML=
"Element: <b>"+current.element+"</b>"

/*
future MCQ generation

generateChoices(current)

*/

}

}


function check(){

let user=document.getElementById("answer").value.trim().toLowerCase()
let result=document.getElementById("result")

/* CONTEXT FLASHCARD */

if(
currentSubject=="contrast" ||
currentSubject=="similar" ||
currentSubject=="commonsense" ||
currentSubject=="mixed"
){

if(user==current.target){

result.innerHTML="✔ Correct"

}else{

result.innerHTML="Answer: "+current.target

}

}


/* ETYMOLOGY (future MCQ)

if(currentSubject=="latinRoot"){
checkChoice()
}

*/

}



function hint(){

let result=document.getElementById("result")

/* CONTEXT FLASHCARD */

if(
currentSubject=="contrast" ||
currentSubject=="similar" ||
currentSubject=="commonsense" ||
currentSubject=="mixed"
){

result.innerHTML="Hint: "+current.clue

}


/* ETYMOLOGY */

if(
currentSubject=="angloPrefix" ||
currentSubject=="latinPrefix" ||
currentSubject=="latinRoot" ||
currentSubject=="greekElement"
){

result.innerHTML="Examples:<br>"+current.examples?.join(", ")

/*
future hint logic

showEtymologyHint()

*/

}

}
