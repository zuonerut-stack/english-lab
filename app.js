let currentTab = "learning"
let currentSubject = null
let dataset = []
let current = null


function switchTab(tab){

currentTab = tab

document.getElementById("learningPage").style.display =
tab==="learning" ? "block" : "none"

document.getElementById("drillPage").style.display =
tab==="drill" ? "block" : "none"

if(tab==="drill" && dataset.length>0){
next()
}

}


function setSubject(subject){

currentSubject = subject

if(subject=="contrast") dataset = contrastData
if(subject=="similarity") dataset = similarityData
if(subject=="phrasal") dataset = phrasalData
if(subject=="roots") dataset = rootsData

showLearning()

}


function showLearning(){

let div = document.getElementById("learningContent")

if(!currentSubject){

div.innerHTML = "Select a subject."

return

}

let html = "<h3>"+currentSubject+"</h3>"
html += "<p>Items: "+dataset.length+"</p>"
html += "<button onclick='switchTab(\"drill\")'>Start Drill</button>"

div.innerHTML = html

}



function next(){

if(dataset.length==0) return

current = dataset[Math.floor(Math.random()*dataset.length)]

document.getElementById("answer").value = ""
document.getElementById("result").innerHTML = ""

if(currentSubject=="contrast" || currentSubject=="similarity"){

document.getElementById("question").innerHTML =
current.sentence.replace(current.target,"_____")

}

if(currentSubject=="phrasal"){

document.getElementById("question").innerHTML =
"What does this mean?<br><b>"+current.verb+"</b>"

}

if(currentSubject=="roots"){

document.getElementById("question").innerHTML =
"Root: <b>"+current.root+"</b>"

}

}



function check(){

let user = document.getElementById("answer").value.trim().toLowerCase()
let result = document.getElementById("result")

if(currentSubject=="contrast" || currentSubject=="similarity"){

if(user==current.target){

result.innerHTML="✔ Correct"

}else{

result.innerHTML="Answer: "+current.target

}

}

if(currentSubject=="phrasal"){

if(user==current.meaning){

result.innerHTML="✔ Correct"

}else{

result.innerHTML="Answer: "+current.meaning

}

}

if(currentSubject=="roots"){

result.innerHTML="Examples:<br>"+current.examples.join(", ")

}

}



function hint(){

let result = document.getElementById("result")

if(currentSubject=="contrast" || currentSubject=="similarity"){

result.innerHTML="Hint: "+current.target

}

if(currentSubject=="phrasal"){

result.innerHTML="Hint: "+current.meaning

}

if(currentSubject=="roots"){

result.innerHTML="Examples:<br>"+current.examples.join(", ")

}

}
