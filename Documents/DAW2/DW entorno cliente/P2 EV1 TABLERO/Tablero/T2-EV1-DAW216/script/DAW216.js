"use script"
   
  //Declaraciones de constantes y variables iniciales
const heroe_juego = '/img/heroe.png';
const suelo_juego = '/img/suelo.gif';
const cofre_juego = '/img/cofre.png';
const valor_heroe = 1;
const valor_cofre = 2;
const arrayTablero = new Array(10).fill(0).map(() => new Array(10).fill(0)); // Declaracion del array con valores 0
//array para setear al heroe y el cofre en el tablero u sus valores
arrayTablero[0][0] = valor_heroe; 
arrayTablero[9][9] = valor_cofre; 
let array_posiciones = [];
let TIRADAS = 0;

//validacion del nombre del jugador
function validarNombre(nombre){
    
    if(nombre.length<4 && /\d/.test(nombre)){ 
        alert("El nombre debe tener 4 o más letras y los números no están permitidos");
        return false;
    }
    else if(nombre.length<4){
        alert("El nombre debe tener 4 o más letras");
        return false;
    }else if(/\d/.test(nombre)){
        alert("Números no están permitidos");
        return false;
    }
    return true;
}

//Obtiene y valida el nombre del jugador.
//Almacena el nombre del jugador en localStorage y habilita el botón para comenzar el juego.
function setName(){

    const nombre = document.getElementById("nombre").value;
    if(validarNombre(nombre)){
        // Nombre ok, podemos empezar
        localStorage.setItem("nombreJugador", nombre); //Esta línea de código, el navegador almacena el valor de la variable nombre en el almacenamiento local, asociándolo con la clave "nombreJugador".
        const texto_entrada = document.createElement("p"); //Creacion del elemento <p>
        texto_entrada.innerText = "A luchar héroe: " + nombre; //Al elemento p le asignamos texto
        const contenedor = document.getElementById("mensaje_nombre").replaceChildren(texto_entrada); //Añadir el elemento p que hemos creado y utilizar el replaceChildren por si hay algun elemento lo pueda sustituir
        
        const jugar = document.getElementById("jugar");
        jugar.disabled = false; //Quitar la propiedad que deshabilita el botón
    }
}

//En crear_tablero cada celda del tablero puede ser un héroe, un cofre, o suelo, representados por imágenes
function crear_tablero(){

    const div = document.getElementById("tabla_juego");
    const tabla = document.createElement("table");
    const tbody = document.createElement("tbody");

    for (let i = 0; i < 10; i++) {
        let fila = document.createElement("tr");

        for (let j = 0; j < 10; j++) {
            let celda = document.createElement("td");
            celda.id = i.toString()+j.toString(); //asignar id a la celda para acceder a ella en el juego
            celda.addEventListener("click", function () {
                mover_heroe(celda.id);
            });
            let imagen = document.createElement("img");
            imagen.id =i.toString()+j.toString()+'_img';
            if( i == 0 && j == 0){
                imagen.src = heroe_juego; 
            }else if(i == 9 && j == 9){
                imagen.src = cofre_juego; 
            }else{
                imagen.src = suelo_juego; 
            }

            imagen.width = "40";
            imagen.height = "40";
            celda.appendChild(imagen);
            fila.appendChild(celda);
        }

        tbody.appendChild(fila);

    }

    tabla.appendChild(tbody);
    div.appendChild(tabla);
}

//Las funciones de localizar buscan y devuelven las posiciones actuales del héroe y el cofre en el tablero.
function localizarHeroe(){
    let posicion = null;

    for (let i = 0; i < arrayTablero.length; i++) {
        const fila = arrayTablero[i];
        const indice = fila.indexOf(valor_heroe);

        if (indice !== -1) {
            posicion = { fila: i, columna: indice };
            break; 
        }
    }
    return posicion;
}

function localizarCofre(){
    let posicion = null;

    for (let i = 0; i < arrayTablero.length; i++) {
        const fila = arrayTablero[i];
        const indice = fila.indexOf(valor_cofre);

        if (indice !== -1) {
            posicion = { fila: i, columna: indice };
            break; 
        }
    }
    return posicion;
}


function comprobar_movimientos(celda_id){
    let movimiento = {fila: celda_id[0] , columna: celda_id[1]};
    for(let i = 0; i < array_posiciones.length; i++){
        for(let j = 0; j < array_posiciones[i].length; j++){
            if(array_posiciones[i][j].fila == movimiento.fila && array_posiciones[i][j].columna == movimiento.columna){
                return 1;
            }
        }
    }
    return 0;
}
//verifica si los movimientos son permitidos y actualiza la posición del héroe en el tablero y verifica si ha alcanzado el cofre.
function mover_heroe(celda_id){
    
    if(!array_posiciones.length){
        console.log("No se puede realizar este movimiento, debes tirar antes");
         return 1;
    }else{
        if(comprobar_movimientos(celda_id)){
            let posicion_heroe = localizarHeroe();
            let posicion_cofre = localizarCofre();
            //Si celda_id = posicion cofre , se acabo

            if(posicion_cofre.fila == celda_id[0] && posicion_cofre.columna == celda_id[1] ){
               alert("Héroe, has llegado al cofre en " + TIRADAS + " tiradas");
                finalizar_juego();
            }


            let id_heroe = posicion_heroe.fila.toString()+ posicion_heroe.columna.toString(); 
            
            document.getElementById(celda_id+"_img").src = heroe_juego;
            document.getElementById(id_heroe+"_img").src = suelo_juego;

            arrayTablero[posicion_heroe.fila][posicion_heroe.columna] = 0;
            arrayTablero[celda_id[0]][celda_id[1]] = 1;
            array_posiciones.splice(0, array_posiciones.length); //vaciamos el array

            
        }else{
            console.log("No se puede realizar este movimiento");
        }
    }
}

//Gestiona el fin del juego, actualizando las puntuaciones en localStorage y mostrando los ganadores.
function finalizar_juego(){
    // Obtener el nombre del jugador almacenado y las tiradas actuales
    let nombreJugador = localStorage.getItem("nombreJugador");
    let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
    let nuevaPuntuacion = { nombre: nombreJugador, tiradas: TIRADAS };
    let recordTiradas = localStorage.getItem("recordTiradas");
    if(recordTiradas === null){
        localStorage.setItem("recordTiradas", TIRADAS);
        alert("Héroe, has establecido un récord de tiradas con"+TIRADAS+"tiradas");
    }else{
        if(TIRADAS<recordTiradas){
            alert("Héroe, has establecido un récord de tiradas con"+TIRADAS+"tiradas");
            localStorage.setItem("recordTiradas", TIRADAS);
        }else{
            alert("Récord no superado, el actual récord es " +  recordTiradas);
        }
    }
    // Agregar la nueva puntuación a la lista de puntuaciones
    puntuaciones.push(nuevaPuntuacion);

    // Ordenar la lista de puntuaciones por tiradas, de menor a mayor
    puntuaciones.sort((a, b) => a.tiradas - b.tiradas);

    // Conservar solo las 5 mejores puntuaciones
    puntuaciones = puntuaciones.slice(0, 5);

    // Guardar la lista actualizada de puntuaciones en localStorage
    localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));

    // Mostrar la tabla de puntuaciones
    mostrarTablaGanadores();
}

//Muestra una tabla de puntuaciones con los mejores jugadores.
function mostrarTablaGanadores() {
    // Obtener las puntuaciones de localStorage
    let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];

    // Iniciar la tabla HTML
    let tablaHTML = '<table class="tabla-puntuaciones"><tr><th>Posición</th><th>Nombre</th><th>Tiradas</th></tr>';

    // Agregar cada puntuación a la tabla HTML
    for (let i = 0; i < puntuaciones.length; i++) {
        tablaHTML += `<tr>
                        <td>${i + 1}</td>
                        <td>${puntuaciones[i].nombre}</td>
                        <td>${puntuaciones[i].tiradas}</td>
                      </tr>`;
    }

   
    tablaHTML += '</table>';

    // Colocar la tabla en el elemento div con id 'tabla_ganadores'
    document.getElementById('tabla_ganadores').innerHTML = tablaHTML;
}

//Marcan visualmente en el tablero las posiciones posibles a las que el héroe puede moverse y limpian estas marcas respectivamente.
function marcar_posiciones(array_posiciones){
    for(let i = 0; i < array_posiciones.length; i++){
        for(let j = 0; j < array_posiciones[i].length; j++){
            let posicion_id = array_posiciones[i][j].fila.toString()+array_posiciones[i][j].columna.toString();
            document.getElementById(posicion_id).style.border = "3px solid red";
        }

    }
}
function limpiar_tablero_marcado(){
    const celdas = document.querySelectorAll("table tbody td");

    celdas.forEach(celda => {
        celda.style.border = "";
    });
}
//Calcula y muestra las posiciones a las que el héroe puede moverse después de una tirada de dados.
function ver_posiciones_posibles(posibles_pasos){
    limpiar_tablero_marcado();
    const posicion_heroe = localizarHeroe();

    const posiciones_horizontales = [];
    const posiciones_verticales = [];
    array_posiciones.splice(0, array_posiciones.length); 

    for (let i = 0; i <= posibles_pasos; i++) {
        const columna = posicion_heroe.columna + i;
        if (columna < arrayTablero[posicion_heroe.fila].length) {
            posiciones_horizontales.push({ fila: posicion_heroe.fila, columna });
        }
    }

    for (let i = 0; i <= posibles_pasos; i++) {
        const fila = posicion_heroe.fila + i;
        if (fila < arrayTablero.length) {
            posiciones_verticales.push({ fila, columna: posicion_heroe.columna });
        }
    }
    array_posiciones.push(posiciones_horizontales);
    array_posiciones.push(posiciones_verticales);
    marcar_posiciones(array_posiciones);
}

//Prepara la interfaz para iniciar el juego ocultando y mostrando elementos relevantes, y llamando a crear_tablero().
function jugar(){
    console.log('La función jugar() ha sido llamada.');
    document.getElementById("introducir_nombre").style.display = "none";
    document.getElementById("tirar_dado").style.display = "block";
    crear_tablero();
}

//Simula una tirada de dados y actualiza la interfaz con el resultado y las posiciones posibles.
function tirar_dado(){
    const num_dado = Math.ceil(Math.random() * 6);
    document.getElementById("imagen_dado").src = "/img/dado_"+num_dado+".png"

    let tiradas = document.getElementById("tiradas");
    TIRADAS = TIRADAS+1;
    tiradas.innerText = TIRADAS;
    ver_posiciones_posibles(num_dado);
}

window.addEventListener("load",function(){
	document.getElementById("play").addEventListener("click",sonarMusica);
	document.getElementById("stop").addEventListener("click",callarmusica);			
});

//musicas
function sonarMusica(){
	var sonido = document.createElement("iframe");
	sonido.setAttribute("src","audio/Tomb Raider III Soundtrack - 01 - Theme.mp3");
	document.body.appendChild(sonido);
	document.getElementById("play").removeEventListener("click",sonarMusica);
}

function callarmusica(){
	var iframe = document.getElementsByTagName("iframe");

	if (iframe.length > 0){
		iframe[0].parentNode.removeChild(iframe[0]);
		document.getElementById("play").addEventListener("click",sonarMusica);
	}
}

