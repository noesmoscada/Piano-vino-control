import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
updateDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* ==========================================
ELEMENTOS
========================================== */

const totalSpan =
document.getElementById("total");

const ingresadasSpan =
document.getElementById("ingresadas");

const disponiblesSpan =
document.getElementById("disponibles");

const mensaje =
document.getElementById("mensaje");

const btnEscanear =
document.getElementById("btnEscanear");

const btnAsistentes =
document.getElementById("btnAsistentes");

const listaAsistentes =
document.getElementById("listaAsistentes");

const btnEstadisticas =
document.getElementById("btnEstadisticas");

const estadisticas =
document.getElementById("estadisticas");


/* ==========================================
EVENTO ACTIVO
========================================== */

let eventoActivo = null;


/* ==========================================
MENSAJES
========================================== */

function mostrarMensaje(texto, color) {

if (!mensaje) return;

mensaje.innerHTML = texto;
mensaje.style.color = color;

}


/* ==========================================
CARGAR EVENTO ACTIVO
========================================== */

async function cargarEventoActivo() {

try {

/*
El Admin guarda el evento actual
en configuracion/evento
*/

const referencia =
doc(db, "configuracion", "evento");

const documento =
await getDoc(referencia);


if (!documento.exists()) {

console.warn(
"No hay evento activo configurado."
);

return null;

}


const datos =
documento.data();


if (!datos.eventoId) {

console.warn(
"La configuración no tiene eventoId."
);

return null;

}


eventoActivo = {

id: datos.eventoId,

nombre: datos.nombre || "",

fecha: datos.fecha || "",

hora: datos.hora || "",

lugar: datos.lugar || ""

};


console.log(
"Evento activo:",
eventoActivo
);


return eventoActivo;


} catch (error) {

console.error(
"Error cargando evento activo:",
error
);

return null;

}

}


/* ==========================================
CONTADORES
========================================== */

async function actualizarContadores() {

try {

if (!eventoActivo) {

await cargarEventoActivo();

}


if (!eventoActivo) {

totalSpan.textContent = "0";
ingresadasSpan.textContent = "0";
disponiblesSpan.textContent = "0";

return;

}


const entradasRef =
collection(db, "entradas");


const consulta =
query(

entradasRef,

where(
"eventoId",
"==",
eventoActivo.id
)

);


const snap =
await getDocs(consulta);


const total =
snap.size;


let ingresadas = 0;


snap.forEach((d) => {

const datos =
d.data();


if (datos.usado === true) {

ingresadas++;

}

});


totalSpan.textContent =
total;

ingresadasSpan.textContent =
ingresadas;

disponiblesSpan.textContent =
total - ingresadas;


} catch (error) {

console.error(
"Error actualizando contadores:",
error
);

}

}


/* ==========================================
PROCESAR QR
========================================== */

async function procesarCodigo(codigo) {

try {

if (!eventoActivo) {

await cargarEventoActivo();

}


if (!eventoActivo) {

mostrarMensaje(
"⚠️ No hay un evento activo.",
"orange"
);

return;

}


/*
Buscamos el código dentro del
evento actual.

Ejemplo:

PV-0001
+ eventoId
*/

const entradasRef =
collection(db, "entradas");


const consulta =
query(

entradasRef,

where(
"eventoId",
"==",
eventoActivo.id
),

where(
"codigo",
"==",
codigo
)

);


const snapshot =
await getDocs(consulta);


if (snapshot.empty) {

mostrarMensaje(
"❌ Entrada inválida para este evento.",
"red"
);

return;

}


const documento =
snapshot.docs[0];


const referencia =
documento.ref;


const datos =
documento.data();


/* =====================================
QR YA UTILIZADO
===================================== */

if (datos.usado === true) {

mostrarMensaje(
"🚫 Entrada ya utilizada",
"red"
);

return;

}


/* =====================================
REGISTRAR INGRESO
===================================== */

const ahora =
new Date();


await updateDoc(
referencia,
{

usado: true,

estado: "ingresó",

horaIngreso:
ahora.toLocaleTimeString(),

fechaIngreso:
ahora.toLocaleDateString()

}
);


mostrarMensaje(
`✅ INGRESO AUTORIZADO<br>
🎟️ ${datos.codigo}`,
"green"
);


await actualizarContadores();


} catch (error) {

console.error(
"Error procesando QR:",
error
);


mostrarMensaje(
"❌ Error verificando la entrada.",
"red"
);

}

}


/* ==========================================
ESCANEAR QR
========================================== */

if (btnEscanear) {

btnEscanear.addEventListener(
"click",
async () => {

await cargarEventoActivo();


if (!eventoActivo) {

mostrarMensaje(
"⚠️ Primero seleccioná un evento desde el administrador.",
"orange"
);

return;

}


const html5QrCode =
new Html5Qrcode("reader");


html5QrCode.start(

{
facingMode: "environment"
},

{
fps: 10,
qrbox: 250
},

async (texto) => {

try {

await html5QrCode.stop();

} catch (error) {

console.log(
"Cámara detenida."
);

}


await procesarCodigo(
texto.trim()
);

},

(error) => {}

);

}
);

}


/* ==========================================
ASISTENTES
========================================== */

if (btnAsistentes) {

btnAsistentes.addEventListener(
"click",
async () => {


if (!eventoActivo) {

await cargarEventoActivo();

}


if (!eventoActivo) {

listaAsistentes.innerHTML =
"<p>⚠️ No hay evento activo.</p>";

return;

}


listaAsistentes.innerHTML =
"<h3>👥 Asistentes ingresados</h3>";


const entradasRef =
collection(db, "entradas");


const consulta =
query(

entradasRef,

where(
"eventoId",
"==",
eventoActivo.id
),

where(
"usado",
"==",
true
)

);


const snap =
await getDocs(consulta);


let cantidad = 0;


snap.forEach((d) => {

const datos =
d.data();


cantidad++;


listaAsistentes.innerHTML += `

<p>

🎟️ ${datos.codigo}

<br>

📅 ${datos.fechaIngreso || "-"}

<br>

⏰ ${datos.horaIngreso || "-"}

</p>

<hr>

`;

});


if (cantidad === 0) {

listaAsistentes.innerHTML +=
"<p>No hay ingresos todavía.</p>";

}

}
);

}


/* ==========================================
ESTADÍSTICAS
========================================== */

if (btnEstadisticas) {

btnEstadisticas.addEventListener(
"click",
async () => {


if (!eventoActivo) {

await cargarEventoActivo();

}


if (!eventoActivo) {

estadisticas.innerHTML =
"<p>⚠️ No hay evento activo.</p>";

return;

}


const entradasRef =
collection(db, "entradas");


const consulta =
query(

entradasRef,

where(
"eventoId",
"==",
eventoActivo.id
)

);


const snap =
await getDocs(consulta);


const total =
snap.size;


let ingresadas = 0;


snap.forEach((d) => {

if (d.data().usado === true) {

ingresadas++;

}

});


const disponibles =
total - ingresadas;


let porcentaje = 0;


if (total > 0) {

porcentaje =
((ingresadas / total) * 100)
.toFixed(1);

}


estadisticas.innerHTML = `

<h3>📊 Estadísticas</h3>

<p>
🎟️ Total: ${total}
</p>

<p>
🚪 Ingresadas: ${ingresadas}
</p>

<p>
⚪ Disponibles: ${disponibles}
</p>

<p>
📈 Ocupación: ${porcentaje}%
</p>

`;

}
);

}


/* ==========================================
INICIO
========================================== */

async function iniciar() {

await cargarEventoActivo();

await actualizarContadores();

}


iniciar();

