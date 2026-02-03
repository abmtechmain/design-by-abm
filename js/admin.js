import { auth, db, storage } from "./firebase.js";
import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { addDoc, collection } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { enableDrag } from "./canvas.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let blocks = [{ text:"Campus to Corporate Program", x:200, y:200, width:800, size:48 }];

login.onclick = async () => {
  await signInWithEmailAndPassword(auth, email.value, password.value);
  alert("Logged in");
};

poster.onchange = e => {
  const r = new FileReader();
  r.onload = () => { img.src = r.result; img.onload = draw; };
  r.readAsDataURL(e.target.files[0]);
};

function draw() {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img,0,0);
  blocks.forEach(b=>{
    ctx.font = `bold ${b.size}px Arial`;
    ctx.fillText(b.text,b.x,b.y);
  });
}

enableDrag(canvas, blocks, draw);

save.onclick = async () => {
  const blob = await fetch(img.src).then(r=>r.blob());
  const refImg = ref(storage,`templates/${Date.now()}.png`);
  await uploadBytes(refImg,blob);
  const imageUrl = await getDownloadURL(refImg);
  await addDoc(collection(db,"templates"),{imageUrl,blocks});
  alert("Template Saved");
};
