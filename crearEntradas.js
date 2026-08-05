import { db } from "./firebase.js";

import {
collection,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

console.log("crearEntradas iniciado");

const entradasRef = collection(db, "entradas");

for (let i = 1; i <= 150; i++) {

const codigo = "PV-" + String(i).padStart(4, "0");

setDoc(doc(entradasRef, codigo), {
codigo: codigo,
estado: "disponible",
usado: false,
evento: "Piano & Vino",
fecha: "12/08/2026",
hora: "20:30"
})
.then(() => {
console.log("Creada:", codigo);
})
.catch((error) => {
console.error("Error:", error);
});

}
