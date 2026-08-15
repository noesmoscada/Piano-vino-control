import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
setDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

console.log("crearEntradas.js cargado correctamente");

/*
Este archivo ya NO genera entradas automáticamente.

Las entradas ahora se generan desde admin.html,
utilizando el evento seleccionado.

El código queda disponible para futuras funciones
de generación si fueran necesarias.
*/

export async function generarEntradasParaEvento(eventoId) {

if (!eventoId) {
throw new Error("No se recibió el ID del evento.");
}

const eventoRef = doc(db, "eventos", eventoId);
const eventoSnap = await getDocs(
query(
collection(db, "eventos"),
where("__name__", "==", eventoId)
)
);

if (eventoSnap.empty) {
throw new Error("El evento no existe.");
}

const evento = eventoSnap.docs[0].data();

const cantidad = Number(evento.cantidad || 150);

const entradasRef = collection(db, "entradas");

/*
Comprobamos si ya existen entradas
para este evento.
*/

const consulta = query(
entradasRef,
where("eventoId", "==", eventoId)
);

const existentes = await getDocs(consulta);

if (!existentes.empty) {
throw new Error(
"Este evento ya tiene entradas generadas."
);
}

/*
Generamos las entradas.

IMPORTANTE:
El ID interno incluye el evento.

Ejemplo:

evento123_PV-0001
evento123_PV-0002

Esto permite volver a utilizar
PV-0001 en otro evento sin pisar
el ticket anterior.
*/

for (let i = 1; i <= cantidad; i++) {

const codigo =
"PV-" + String(i).padStart(4, "0");

const idEntrada =
eventoId + "_" + codigo;

const entradaRef =
doc(entradasRef, idEntrada);

await setDoc(entradaRef, {

codigo: codigo,

eventoId: eventoId,

evento: evento.nombre || "Piano & Vino",

fecha: evento.fecha || "",

hora: evento.hora || "",

lugar: evento.lugar || "",

usado: false,

estado: "disponible",

fechaIngreso: "",

horaIngreso: ""

});

console.log(
"Entrada creada:",
codigo
);
}

console.log(
`Se generaron ${cantidad} entradas para ${evento.nombre}`
);

return cantidad;
}

