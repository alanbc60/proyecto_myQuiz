
export {verificarSesion};

// Variables para controlar el tiempo de inactividad
var inactivityTimeout = 3800; // Tiempo de inactividad en milisegundos
let timeoutID;


const URL = "http://localhost/Myquiz/api/controllers/controller.php?";

document.addEventListener('DOMContentLoaded', function () {
  console.log("========== Iniciando app ==============");

  //Login
  const formLogin = document.querySelector("#form_login");
  const contenedorLogin = document.querySelector(".contenedor_principal_login");
  
  //Si el html de form login no es vacio ejecuta el if, para no estar vacio se debe posicionar en esa pagina
  if(contenedorLogin){
      //Verificamos que el usuario siga activo
      
      
    if(formLogin){
        //async es una funcion asincrona que devuelve una promesa (el hilo principal espera a que acabe esta funcion)
        formLogin.addEventListener('submit', function(ev){
          loginUsuario(ev,formLogin);
        });

        document.addEventListener("mousemove", resetTimer);
        document.addEventListener("mousedown", resetTimer);
        document.addEventListener("keypress", resetTimer);
        document.addEventListener("touchmove", resetTimer);
      }

  }

  

});



async function loginUsuario(ev, formLogin){
  return new Promise(async (resolve, reject) => {
    ev.preventDefault(); //Evita que se envie el formulario
    let verificacion = false;  

    const urlCompleta = URL+"accion=inicioSesion";
    try{
      const datosForm = new FormData(formLogin);
      const correo = datosForm.get('login_correo')
      const password = datosForm.get('login_password')
      console.log("El correo es: "+correo);
      console.log("El password es: "+password);

      const response = await fetch(urlCompleta, {
        method: "POST", 
        body: datosForm
      })

      const data = await response.json();

      console.log("Data: "+data);

      if (data.status == 'comprobado') {

        console.log('La sesión es válida para el usuario actual');
        console.log('User ID:', data.user_id);
        console.log('Nombre de usuario:', data.nombre_usuario);
        console.log('Correo:', data.correo);
        console.log("aviso: ",data.aviso);
        setTimeout(function() {
          window.location.href = 'quizzes.html';
        },1000);

        verificacion = true;
        resolve(verificacion);
      }
      else if(data.status == 'false'){
        document.querySelector('.mensajeErrorLogin').innerHTML = "Correo o contraseña no válidos";
        console.log("Lo que recibi fue: "+data);
        resolve(verificacion);
      }
      else if(data.status == 'errorUsuarioActual'){
        document.querySelector('.mensajeErrorLogin').innerHTML = "La sesión no pertenece al usuario actual";
        resolve(verificacion);
      }
      else if(data.status == 'errorSesion'){
        document.querySelector('.mensajeErrorLogin').innerHTML = "No hay sesion activa";
        resolve(verificacion);
      }

      else if(data.status == 'errorHTTP'){
        document.querySelector('.mensajeErrorLogin').innerHTML = "No hay sesion activa";
        resolve(verificacion);
      }
        
      else{
        // Error en la petición HTTP o en el servidor
        console.log('Error en la petición HTTP o en el servidor');
        console.log('Mensaje de error:', data.message);
        resolve(verificacion);
      }
    }

    catch(error) {
      console.log('Error en la solicitud:', error);
      reject(error);
    };
  });  
};


//Debemos hacer otra función para la retorna un dato en los otros Script
//Por eso se usa otro llamado HTTP

async function verificarSesion() {
    let verificacion = false;  
    console.log("=== Entro a la funcion verificar sesion ===")
    const urlCompleta = URL+"accion=permanecerSesionUsuario";
    //TODO: pasarle el parametro de ID y username
    try {
      const response = await fetch(urlCompleta);
      const data = await response.json();
      console.log("Data: "+data);
      console.log("Data status: "+data.status);

      if (data.status === 'verificado') {
        console.log('La sesión es válida');
        verificacion = true;  
      } 
      else if (data.status === 'errorUsuarioActual') {
        verificacion = false;  
        console.log('La sesión no pertenece al usuario actual');
        setTimeout(function() {
          window.location.href='login.html';
        }, 1000);
      } 
      else {
        verificacion = false;  
        // Realizar acciones para cuando no hay sesión activa
        console.log('No hay sesión activa, error: '+data.status);
      }
    
      console.log("Verificacion: " + verificacion);
      return verificacion;
    } 
    
    catch (error) {
      console.error('Error:', error);
      verificacion = false;  
      return verificacion;
    }
}
  
function resetTimer() {
  clearTimeout(timeoutID);
  timeoutID = setTimeout(logout, inactivityTimeout);
}

// async function logout() {
//   const urlCompletaLogout = URL+"accion=cerrarSesionUsuario";
//   console.log("URL LOGOUT: "+urlCompletaLogout);
//   try{
//     console.log("=== Entro al try ===");
//     const response = await fetch(urlCompletaLogout);
//     const data = await response.json();
//     console.log("Data sesion: "+data);
//     if(data.status == "sesionCerrada"){
//       //Aqui se crea el popup
//       console.log("==== Cerrando sesion ====");
//       window.location.href = 'login.html';
//     }
//     else{

//     }

//   }
//   catch(error){
//     console.log("Error:");
//   }
  
// }

function logout() {
  const urlCompletaLogout = URL + "accion=cerrarSesionUsuario";
  
  fetch(urlCompletaLogout)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.status === "sesionCerrada") {
        // Aquí se crea el popup
        const contenedorPrincipalLogin = document.querySelector('.contenedor_principal_login');

        const popupCerrarSesion = document.createElement("div");
        //agregamos una clase 
        popupCerrarSesion.classList.add("modal");
        popupCerrarSesion.innerHTML = `
          <div class="modal-content">
            <h2>Sesión caducada</h2>
            <p>Esta ventana se cerrará automáticamente en unos segundos.</p>
            <div class="Contenedor_boton_cerrarSesion">
              <a class="boton_cerrarSesion">Ok</a>
            </div>
          </div>
        `;
        const botonOKCerrarSesion = document.querySelector(".boton_cerrarSesion");
        botonOKCerrarSesion.onclick = function(){
          window.location.href='login.html';
        }
        contenedorPrincipalLogin.appendChild(popupCerrarSesion);
        console.log("Cerrando sesión...");
        let contador = 25;
        actualizarContador(contador);

      } 
      
      else {
        // Manejar otro caso si es necesario
      }
    })
    .catch(error => {
      console.log("Error:", error);
    });
}




function actualizarContador() {
  const valorContador = document.getElementById('valorContador');

  if (contador > 0) {
    contador--;
    valorContador.textContent = contador;
    setTimeout(actualizarContador, 1000); // Actualiza el contador cada 1 segundo (1000 milisegundos)

  } else {
    valorContador.textContent = "¡Tiempo expirado!";
    window.location.href='quizzes.html';
  }
}


actualizarContador();





// // Función para destruir la sesión
// function destruirSesion() {
//   // Hacer una solicitud al script PHP para destruir la sesión
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.open("GET", "destruir_sesion.php", true);
//   xmlhttp.send();

//   // Redireccionar al usuario a una página de cierre de sesión o a la página principal
//   window.location.href = 'login.html';
// }

// // Función para verificar la inactividad del usuario
// function verificarInactividad() {
//   // Obtener la fecha y hora actual
//   const fechaActual = new Date().getTime();

//   // Obtener la fecha y hora de la última actividad almacenada
//   const ultimaActividad = getCookieValue('ultimaActividad'); // Obtener el valor de la cookie 'ultimaActividad'

//   // Calcular el tiempo transcurrido desde la última actividad
//   const tiempoTranscurrido = fechaActual - ultimaActividad;

//   // Verificar si ha transcurrido el tiempo de inactividad máximo
//   if (tiempoTranscurrido >= tiempoInactivoMaximo) {
//     // Destruir la sesión
//     destruirSesion();
//   } else {
//     // Actualizar el tiempo de inactividad y seguir verificando
//     tiempoInactivo = tiempoTranscurrido;
//     setTimeout(verificarInactividad, 1000); // Verificar la inactividad cada segundo
//   }
// }























