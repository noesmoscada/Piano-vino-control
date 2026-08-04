import { db } from "./firebase.js";
import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function prueba() {
console.log("Proyecto conectado:", db.app.options.projectId);

const ref = doc(db, "entradas", "PV-0001");
const resultado = await getDoc(ref);

console.log("Existe:", resultado.exists());

if (resultado.exists()) {
console.log(resultado.data());
}
}

prueba();
