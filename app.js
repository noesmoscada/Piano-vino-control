import { db } from "./firebase.js";
import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function probarConexion() {
try {
const snapshot = await getDocs(collection(db, "entradas"));
console.log("✅ Firebase conectado.");
console.log("Entradas encontradas:", snapshot.size);

alert("✅ Firebase conectado correctamente");
} catch (error) {
console.error(error);
alert("❌ Error al conectar Firebase");
}
}

probarConexion();
