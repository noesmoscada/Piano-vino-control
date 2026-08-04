import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function cargarEntradas() {
try {
const snapshot = await getDocs(collection(db, "entradas"));

console.log("Entradas encontradas:", snapshot.size);

snapshot.forEach((doc) => {
console.log(doc.id, doc.data());
});

alert(`Se encontraron ${snapshot.size} entradas`);
} catch (error) {
console.error(error);
alert("Error: " + error.message);
}
}

cargarEntradas();
