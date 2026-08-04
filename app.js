import { db } from "./firebase.js";
import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function prueba() {
console.log("Proyecto conectado:", db.app.options.projectId);
console.log("App.js actualizado correctamente"
const snapshot = await getDocs(collection(db, "entradas"));

console.log("Cantidad:", snapshot.size);

snapshot.forEach((doc) => {
console.log(doc.id, doc.data());
});

alert("Cantidad de documentos: " + snapshot.size);
}

prueba();
