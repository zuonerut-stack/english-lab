
let mode="contrast"
let dataset=[]
let current=null

function setMode(m){

mode=m

if(m=="contrast") dataset=contrastData
if(m=="similarity") dataset=similarityData
if(m=="phrasal") dataset=phrasalData
if(m=="roots") dataset=rootsData

next()

}

function next(){

current=dataset[Math.floor(Math.random()*dataset.length)]

document.getElementById("answer").value=""
document.getElementById("result").innerHTML=""

if(mode=="contrast" || mode=="similarity"){

document.getElementById("question").innerHTML=
current.sentence.replace(current.target,"_____")

}

if(mode=="phrasal"){

document.getElementById("question").innerHTML=
"What does this mean?<br><b>"+current.verb+"</b>"

}

if(mode=="roots"){

document.getElementById("question").innerHTML=
"Root: <b>"+current.root+"</b>"

}

}

function check(){

let user=document.getElementById("answer").value.trim().toLowerCase()

if(mode=="contrast" || mode=="similarity"){

if(user==current.target){

result.innerHTML="✔ Correct"

}else{

result.innerHTML="Answer: "+current.target

}

}

if(mode=="phrasal"){

if(user==current.meaning){

result.innerHTML="✔ Correct"

}else{

result.innerHTML="Answer: "+current.meaning

}

}

if(mode=="roots"){

result.innerHTML="Examples:<br>"+current.examples.join(", ")

}

}

setMode("contrast")