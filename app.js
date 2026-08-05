import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const totalSpan = document.getElementById("total");
const ingresadasSpan = document.getElementById("ingresadas");
const disponiblesSpan = document.getElementById("disponibles");
const mensaje = document.getElementById("mensaje");
const btnEscanear = document.getElementById("btnEscanear");

async function actualizarContadores() {

const snap = await getDocs(collection(db, "entradas"));

const total = snap.size;

let ingresadas = 0;

snap.forEach((d) => {

if (d.data().usado) ingresadas++;

});

totalSpan.textContent = total;
ingresadasSpan.textContent = ingresadas;
disponiblesSpan.textContent = total - ingresadas;

}

actualizarContadores();

function mostrarMensaje(texto, color) {

mensaje.innerHTML = texto;
mensaje.style.color = color;

}

async function procesarCodigo(codigo) {

const referencia = doc(db, "entradas", codigo);

const documento = await getDoc(referencia);

if (!documento.exists()) {

mostrarMensaje("❌ Entrada inválida", "red");
return;

}

const datos = documento.data();

if (datos.usado) {

mostrarMensaje("🚫 Entrada ya utilizada", "red");
return;

}

await updateDoc(referencia, {

usado: true,
estado: "ingresó",
horaIngreso: new Date().toLocaleTimeString(),
fechaIngreso: new Date().toLocaleDateString()

});

mostrarMensaje("✅ Ingreso autorizado", "green");

actualizarContadores();

}

btnEscanear.addEventListener("click", () => {

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(

{
facingMode: "environment"
},

{
fps: 10,
qrbox: 250
},

async (texto) => {

await html5QrCode.stop();

await procesarCodigo(texto.trim());

},

(error) => {}

);

});

