
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
        localStorage.setItem("nombreUsuario", nombre)
    }
}


function verificarPartido() {
    let contenedorPartido = document.getElementById("contenedorPartido")
    if (contarElementos(miEquipo) === 5 && contarElementos(equipoRival) === 5) {
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
        let titulo, texto, icono, color

        if (resultadoAleatorio === 0) {
            titulo = '🏆 ¡TU EQUIPO GANÓ! 🏆'
            texto = '¡Felicitaciones, tus leyendas dominaron la cancha!'
            icono = 'success'
            color = '#28a745'
        } else {
            titulo = '😞 GANÓ EL EQUIPO RIVAL 😞'
            texto = '¡No te rindas! Inténtalo de nuevo.'
            icono = 'error'
            color = '#ff6600'
        }

        Swal.fire({
            title: titulo,
            text: texto,
            icon: icono,
            confirmButtonText: 'Jugar Otro Partido',
            confirmButtonColor: color,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                reiniciarPartido()
            }
        })

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
if (nombreGuardado) {
    let saludo = document.getElementById("saludo")
    let inputNombre = document.getElementById("nombre")
    saludo.innerHTML = "¡Bienvenido/a " + nombreGuardado + "!"
    inputNombre.value = nombreGuardado
}
