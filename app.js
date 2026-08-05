import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function actualizarContadores() {

const snap = await getDocs(collection(db, "entradas"));

const total = snap.size;

let ingresadas = 0;

snap.forEach((doc) => {
const datos = doc.data();
if (datos.usado) ingresadas++;
});

document.getElementById("total").textContent = total;
document.getElementById("ingresadas").textContent = ingresadas;
document.getElementById("disponibles").textContent = total - ingresadas;

}

actualizarContadores();
