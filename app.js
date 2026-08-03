// Piano & Vino Manager
// Primera versión

let entradasTotales = 100;
let vendidas = 0;
let ingresadas = 0;

function estadoEntradas() {

    let disponibles = entradasTotales - vendidas;

    console.log("Piano & Vino Manager");
    console.log("Total:", entradasTotales);
    console.log("Vendidas:", vendidas);
    console.log("Ingresadas:", ingresadas);
    console.log("Disponibles:", disponibles);

}

estadoEntradas();
