
const URL = "./db/jugadores.json"
let listaJugadores = []
let equipoRival = []
let miEquipo = JSON.parse(localStorage.getItem("miEquipo")) || []



function importarJugadores() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            listaJugadores = data
            mostrarMiEquipo()
        })
        .catch(error => {
            const contenedor = document.getElementById("equipoRival")
            if (contenedor) {
                contenedor.innerHTML = "<p class='alertmsj'>Error al cargar los jugadores. Por favor, intenta nuevamente más tarde.</p>"
            }
        })
}



function mostrarSaludo() {
    let inputNombre = document.getElementById("nombre")
    let nombre = inputNombre.value.trim()  
    let saludo = document.getElementById("saludo")
    saludo.innerHTML = ""
    
    if (nombre === "") {
        Swal.fire({
            title: "Por favor ingresa tu Nombre",
            icon: "warning",
            draggable: true
        })
    } else {
        
        Swal.fire({
            title: "¡Bienvenido/a " + nombre + "!",
            text: "Prepárate para armar tu equipo de leyendas",
            icon: "success",
            draggable: true
        })
        saludo.innerHTML = "¡Bienvenido/a " + nombre + "!"
    }
    
    localStorage.setItem("nombreUsuario", nombre)
}





function generarEquipoRival() {
    
    equipoRival = []
    
    let jugadoresDisponibles = [...listaJugadores]
    
    for (let i = 0; i < 5; i++) {
        
        let indiceAleatorio = Math.floor(Math.random() * jugadoresDisponibles.length)
        equipoRival.push(jugadoresDisponibles[indiceAleatorio])
        jugadoresDisponibles.splice(indiceAleatorio, 1)
    }
    mostrarEquipoRival()
    verificarPartido()
}

function mostrarEquipoRival() {
    let contenedor = document.getElementById("equipoRival")
    contenedor.innerHTML = ""

    equipoRival.forEach(jugador => {
        let card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `
            <h3 class="card-nombre">${jugador.nombre}</h3>
            <p class="card-info"><span>Posición:</span> ${jugador.posicion}</p>
            <p class="card-info"><span>Equipo:</span> ${jugador.equipo}</p>
            <p class="card-info"><span>Año de Gloria:</span> ${jugador.anioGloria}</p>
        `
        contenedor.appendChild(card)
    })
}


function agregarJugadorAMiEquipo() {
    let inputNombre = document.getElementById("nombreJugador")
    let inputEdad = document.getElementById("edadJugador")
    let selectorEquipo = document.getElementById("selectorEquipos")
    let alerta = document.getElementById("alertaEquipo")
    alerta.innerHTML = ""
    let nombre = inputNombre.value.trim()
    let edad = parseInt(inputEdad.value)
    let equipo = selectorEquipo.value
    // Validaciones
    if (nombre === "") {
        alerta.innerHTML = "Por favor ingresa el nombre del jugador"
        alerta.style.color = "#ffd700"
        return
    }
    if (!edad || edad < 18 || edad > 50) {
        alerta.innerHTML = "Por favor ingresa una edad válida (18-50 años)"
        alerta.style.color = "#ffd700"
        return
    }
    if (equipo === "") {
        alerta.innerHTML = "Por favor selecciona un equipo NBA"
        alerta.style.color = "#ffd700"
        return
    }
    if (miEquipo.length >= 5) {
        Swal.fire({
            title: "Equipo completo",
            text: "Ya tienes 5 jugadores. Debes eliminar uno antes de agregar otro.",
            icon: "warning",
            draggable: true
        })
        return
    }
    // Crear jugador personalizado
    let nuevoJugador = {
        id: Date.now(), // Timestamp único como ID
        nombre: nombre,
        edad: edad,
        equipo: equipo
    }
    miEquipo.push(nuevoJugador)
    localStorage.setItem("miEquipo", JSON.stringify(miEquipo))
    mostrarMiEquipo()
    // Limpiar formulario
    inputNombre.value = ""
    inputEdad.value = ""
    selectorEquipo.value = ""
    alerta.innerHTML = `¡${nuevoJugador.nombre} agregado a tu equipo!`
    alerta.style.color = "#28a745"
    verificarPartido()
}

function mostrarMiEquipo() {
    let contenedor = document.getElementById("miEquipo")
    contenedor.innerHTML = ""
    if (miEquipo.length === 0) {
        contenedor.innerHTML = "<p class='alertmsj'>Aún no has agregado jugadores a tu equipo</p>"
        return
    }
    miEquipo.forEach(jugador => {
        let card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `
            <h3 class="card-nombre">${jugador.nombre}</h3>
            <p class="card-info"><span>Edad:</span> ${jugador.edad} años</p>
            <p class="card-info"><span>Equipo:</span> ${jugador.equipo}</p>
            <div class="card-botones">
                <button class="button button-card button-editar" data-id="${jugador.id}">Editar</button>
                <button class="button button-card button-eliminar" data-id="${jugador.id}">Eliminar</button>
            </div>
        `
        contenedor.appendChild(card)
        const botonesEditar = card.querySelectorAll(".button-editar")
        const botonesEliminar = card.querySelectorAll(".button-eliminar")
        botonesEditar.forEach(boton => {
            boton.addEventListener("click", () => {
                editarJugador(jugador.id)
            })
        })
        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", () => {
                eliminarJugador(jugador.id)
            })
        })
    })
}

function eliminarJugador(jugadorId) {
    miEquipo = miEquipo.filter(jugador => jugador.id !== jugadorId)
    localStorage.setItem("miEquipo", JSON.stringify(miEquipo))
    mostrarMiEquipo()
    verificarPartido()
}
function editarJugador(jugadorId) {
    let jugadorActual = miEquipo.find(jugador => jugador.id === jugadorId)
    let opcionesEquiposHTML = `
        <option value="">Selecciona un equipo NBA</option>
        <option value="Chicago Bulls">Chicago Bulls</option>
        <option value="Los Angeles Lakers">Los Angeles Lakers</option>
        <option value="Boston Celtics">Boston Celtics</option>
        <option value="San Antonio Spurs">San Antonio Spurs</option>
        <option value="Miami Heat">Miami Heat</option>
        <option value="Houston Rockets">Houston Rockets</option>
        <option value="Phoenix Suns">Phoenix Suns</option>
        <option value="Utah Jazz">Utah Jazz</option>
        <option value="Detroit Pistons">Detroit Pistons</option>
        <option value="Dallas Mavericks">Dallas Mavericks</option>
        <option value="Philadelphia 76ers">Philadelphia 76ers</option>
    `
    Swal.fire({
        title: `Editar a ${jugadorActual.nombre}`,
        html: `
            <input id="editNombre" class="swal2-input" placeholder="Nombre del jugador" value="${jugadorActual.nombre}" maxlength="30">
            <input id="editEdad" class="swal2-input" type="number" placeholder="Edad" value="${jugadorActual.edad}" min="18" max="50">
            <select id="editEquipo" class="swal2-input" style="width: 80%">
                ${opcionesEquiposHTML}
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            document.getElementById('editEquipo').value = jugadorActual.equipo
        },
        preConfirm: () => {
            const nombre = document.getElementById('editNombre').value.trim()
            const edad = parseInt(document.getElementById('editEdad').value)
            const equipo = document.getElementById('editEquipo').value
            if (!nombre) {
                Swal.showValidationMessage('Debes ingresar un nombre')
                return false
            }
            if (!edad || edad < 18 || edad > 50) {
                Swal.showValidationMessage('Edad debe estar entre 18 y 50 años')
                return false
            }
            if (!equipo) {
                Swal.showValidationMessage('Debes seleccionar un equipo')
                return false
            }
            return { nombre, edad, equipo }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre, edad, equipo } = result.value
            const index = miEquipo.findIndex(j => j.id === jugadorId)
            miEquipo[index] = {
                id: jugadorId,
                nombre: nombre,
                edad: edad,
                equipo: equipo
            }
            localStorage.setItem("miEquipo", JSON.stringify(miEquipo))
            mostrarMiEquipo()
            Swal.fire({
                title: '¡Jugador editado!',
                text: `${jugadorActual.nombre} ha sido actualizado`,
                icon: 'success'
            })
        }
    })
}


function verificarPartido() {
    let contenedorPartido = document.getElementById("contenedorPartido")
    if (miEquipo.length === 5 && equipoRival.length === 5) {
        contenedorPartido.innerHTML = `
            <button id="comenzarPartido" class="button" style="font-size: 1.3rem; padding: 15px 40px;">
                🏀 Comenzar Partido
            </button>
        `
        document.getElementById("comenzarPartido").addEventListener("click", jugarPartido)
    } else {
        contenedorPartido.innerHTML = ""
        document.getElementById("resultadoPartido").innerHTML = ""
    }
}

function jugarPartido() {
    let resultadoAleatorio = Math.floor(Math.random() * 2)
    
    Swal.fire({
        title: '🏀 Jugando el partido... 🏀',
        text: 'Los equipos están en la cancha',
        icon: 'info',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        allowOutsideClick: false
    }).then(() => {
        
        if (resultadoAleatorio === 0) {
            
            Swal.fire({
                title: '🏆 ¡TU EQUIPO GANÓ! 🏆',
                text: '¡Felicitaciones, tus leyendas dominaron la cancha!',
                icon: 'success',
                confirmButtonText: 'Jugar Otro Partido',
                confirmButtonColor: '#28a745',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    reiniciarPartido()
                }
            })
        } else {
            
            Swal.fire({
                title: '😞 GANÓ EL EQUIPO RIVAL 😞',
                text: '¡No te rindas! Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Jugar Otro Partido',
                confirmButtonColor: '#ff6600',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    reiniciarPartido()
                }
            })
        }
        
        document.getElementById("contenedorPartido").innerHTML = ""
    })
}

function reiniciarPartido() {
    document.getElementById("resultadoPartido").innerHTML = ""
    verificarPartido()
}


importarJugadores()

let botonAceptar = document.getElementById("aceptar")
botonAceptar.addEventListener("click", mostrarSaludo)

let botonGenerarRival = document.getElementById("generarRival")
botonGenerarRival.addEventListener("click", generarEquipoRival)

let botonAgregarJugador = document.getElementById("agregarJugador")
botonAgregarJugador.addEventListener("click", agregarJugadorAMiEquipo)

let nombreGuardado = localStorage.getItem("nombreUsuario")
if (nombreGuardado && nombreGuardado !== "") {
    let saludo = document.getElementById("saludo")
    let inputNombre = document.getElementById("nombre")
    saludo.innerHTML = "¡Bienvenido/a " + nombreGuardado + "!"
    inputNombre.value = nombreGuardado
}
