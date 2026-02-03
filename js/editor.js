import { db } from "./firebase.js";
import { getDocs, collection } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let img = new Image(), blocks = [];

const snap = await getDocs(collection(db,"templates"));
snap.forEach(d=>{
  const o=document.createElement("option");
  o.value=JSON.stringify(d.data());
  o.textContent="Template";
  templates.appendChild(o);
});

templates.onchange = e=>{
  const data=JSON.parse(e.target.value);
  blocks=data.blocks;
  img.src=data.imageUrl;
  img.onload=draw;
};

text.oninput=()=>{
  blocks[0].text=text.value;
  draw();
};

function draw(){
  canvas.width=img.width;
  canvas.height=img.height;
  ctx.drawImage(img,0,0);
  blocks.forEach(b=>{
    ctx.font=`bold ${b.size}px Arial`;
    ctx.fillText(b.text,b.x,b.y);
  });
}

download.onclick=()=>{
  const a=document.createElement("a");
  a.href=canvas.toDataURL();
  a.download="poster.png";
  a.click();
};
