const URL = "http://localhost/Myquiz/api/controllers/controller.php?";


document.addEventListener('DOMContentLoaded', function () {
  console.log("========== Iniciando app ==============");

  //Verificacion de usuarios


  //Login
  const formLogin = document.querySelector("#form_login");
  const contenedorLogin = document.querySelector(".contenedor_principal_login");
  const formRegistro = document.getElementById("form_registro");
  //Registro
  const cardsContainer = document.querySelector('#cards-container');
  // const contenedorFiltro = document.querySelector('.contenedor_filtro');
  console.log(formLogin);
  // Filtrado
  const inputBusqueda = document.getElementById("busqueda");

  console.log(inputBusqueda);
  // cargarGruposUsuario();

  //Navbar
  const navbar = document.querySelector(".contenedor_nav");
  const botonCerrarSesion = document.querySelector("#boton_cerrarSesion");
  console.log(botonCerrarSesion);

  //crearQuiz
  const contenedorEdicionQuiz = document.querySelector(".contendor_principal_crearQuiz");

  //Quizzes
  const contenedorQuizzes = document.querySelector(".contenedor_principal_quizzes");
  const botonCrearQuiz = document.querySelector(".crear_quiz");
  const botonModificarQuiz = document.querySelector(".modificar_quiz");

  if(botonCerrarSesion){
    console.log("boton activado");
  }

  if(cardsContainer){
    cargarQuizzesPublicos(cardsContainer);
    inputBusqueda.addEventListener("keydown", buscar);
    cargarGruposUsuario();
  }
  
  //Si el html de form login no es vacio ejecuta el if, para no estar vacio se debe posicionar en esa pagina
  if(contenedorLogin  || navbar){
      
      if(formLogin){
        //async es una funcion asincrona que devuelve una promesa (el hilo principal espera a que acabe esta funcion)
        formLogin.addEventListener('submit', function(ev){
          login(ev,formLogin);
        });
      }

      if(navbar){
        // Recuperar el valor del sessionStorage para mostrar el nombre en la navbar
        const datosUsuarioString = localStorage.getItem('datosUsuario');
        try {
          const datosUsuario = JSON.parse(datosUsuarioString);
          console.log("El JSON almacenado es válido.");
          console.log("tipo de dato : "+typeof(datosUsuario));
          console.log("Mis datos: "+datosUsuario);
          console.log("username : "+datosUsuario[2]);
          // Se usa += para que no borre <img> de foto_usuario y solo agregue una nueva etiqueta
          document.querySelector(".foto_usuario").innerHTML += `<h3>${datosUsuario[2]}</h3>`;
        } catch (error) {
          console.error("El JSON almacenado es inválido: " + error);
          // Realiza cualquier otra operación de manejo de errores aquí
        }

        //Vaciar el array
        datosUsuario = [];
      }
  }

  //Registro
  if(formRegistro){
      formRegistro.addEventListener('submit', function (ev) {
        registro(ev,formRegistro);
      });
  }

  //Quizzes

  if(contenedorQuizzes){
    //Decision de boton crear quiz o modificar quiz

    //Si se selecciono crear quiz

    //Si se selecciono modificar quiz
    //pasarle el id del quiz para que lo cache edicionQuiz
    botonModificarQuiz.addEventListener('submit', cargarQuiz); 

  }

  //Edicion de quiz
  if(contenedorEdicionQuiz){
    
    //Cargamos el nombre del usuario (ya sea en crear quiz o modificar quiz)
    const datosUsuarioString = localStorage.getItem('datosUsuario');
    try {
      const datosUsuario = JSON.parse(datosUsuarioString);
      // Se usa += para que no borre <img> de foto_usuario y solo agregue una nueva etiqueta
      const miInput = document.getElementById("inputAutor");
      miInput.value = `${datosUsuario[2]}`;
      // Establece el atributo readonly en true(Establecer que solo se pueda leer)
      miInput.readOnly = true;
    } 
    catch (error) {
      console.error("El JSON almacenado es inválido: " + error);
    }
    // Boton paso siguiente
    const botonGuardarQuiz = document.querySelector('#boton_pasoSiguiente');
    botonGuardarQuiz.addEventListener('submit', guardarQuiz); 
  } 

  

});



function login(ev, formLogin){
    ev.preventDefault();
    // console.log(formLogin);
    const datosForm = new FormData(formLogin);
  
    for (const entry of datosForm.entries()) {
      console.log(entry[0] + ": " + entry[1]);
    }
    //guardamos en una consante el correo
    const correo = datosForm.get('correo')
    const password = datosForm.get('password')
    console.log("El correo es: "+correo);
    console.log("El password es: "+password);

    urlCompleta = URL+"accion=inicioSesion";

    //Fetch: primer parametro, url donde vamos a mandar la peticion
    fetch(urlCompleta, {
      method: "POST", 
      body: datosForm
    })
    .then(response => response.text())
    .then(data => {
      console.log("La data recibida es: " + data);
      let datosUsuario;  
      // Convertir el string JSON en un objeto JavaScript
      datosUsuario = JSON.parse(data);
      console.log("tipo de dato 1: "+typeof(datosUsuario));

      if (datosUsuario[0] == 'true') {
        console.log("Entro con exito");
        console.log("tipo de dato 2: "+typeof(datosUsuario));
        localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));
        verificarSesion();

      }
      //Indicar que la sesion fue cadudacad
      // else if(){

      // }
        
      else{
        console.log("===== Error al entrar =======");
        document.querySelector('.mensajeErrorLogin').innerHTML = "Correo o contraseña no válidos";
        console.log("Lo que recibi fue: "+data);
      }
    })
    .catch(error => console.error(error));
};


// Función para verificar la sesión
function verificarSesion() {
  console.log("=== Entro a la funcion verificar sesion ===")
  urlCompleta = URL+"accion=verificarSesion";
  console.log("La url es: "+urlCompleta);
  // Realizar la solicitud Fetch para verificar la sesión
  console.log(" === Entro a la verificacion ===");
  fetch(urlCompleta)
    .then(response => response.text())
    .then(data => {
      let datosAdministrador;  
      console.log('Respuesta de verificarSesion:', data);
      if (data === 'La sesión es válida para el usuario actual.') {
        // Realizar acciones para una sesión válida
        console.log('La sesión es válida');
        setTimeout(function() {
          window.location.href = 'quizzes.html';
        },1000);
        
      } else if (data === 'La sesión no pertenece al usuario actual.') {
        console.log('La sesión no pertenece al usuario actual');
        // Realizar acciones para una sesión no válida
        setTimeout(function() {
          window.location.href='login.html';
        },1000);
      }
      if(datosAdministrador[0]=="true"){
         console.log("Verificacion exitosa");
      }
      
      else {
        // Realizar acciones para cuando no hay sesión activa
        console.log('No hay sesión activa :c');

      }
    })
    .catch(error => console.error('Error:', error));
}


function registro(ev, formRegistro){
  ev.preventDefault();
  const datosForm = new FormData(formRegistro);
  const nombre = datosForm.get('registro_nombre');
  const correo = datosForm.get('registro_correo');
  const password = datosForm.get('registro_password');
  console.log("El nombre es: "+nombre);
   console.log("El correo es: "+correo);
  console.log("El password es: "+password);
  urlCompleta = URL+"accion=registrarUsuario";

  fetch(urlCompleta, {
    method: "POST", 
    body: datosForm
  })
  .then(resp => resp.text())
  .then(async data => {
      console.log("La data recibida es: " + data);

      if(data == 'true'){
        console.log("Entro con exito");
        //Obtener el nombre del usuario

        window.location.href='../views/quizzes.html';
        getQuizzesNuevoUsuario();

      }
      
      else{
        console.log("===== Error al registrarse =======");
        document.querySelector('.mensajeErrorLogin').innerHTML = "Correo o contraseña existentes";
        console.log("Lo que recibi fue: "+data);
      }
  })
}





// ========= Crear quiz y modificar =========
function guardarQuiz(ev){
  ev.preventDefault();
  const formCrearQuiz = document.querySelector("#form_edicionQuiz")
  // Crea un objeto FormData
  var formData = new FormData(formCrearQuiz);
  const urlCompleta = URL + "accion=modificarQuiz";

  //Si en paso_siguiente previamente se selecciono modificar quiz
  if (quizId) {
    // Si hay un parámetro "id", realizar una actualización
    fetch(`/api/quizzes/${quizId}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // mostrar un mensaje de éxito o redirigir a otra página
      });
  }

  //Si en paso_siguiente previamente se selecciono crear quiz
  else {
    // Si no hay un parámetro "id", realizar una inserción
    const urlCompletaCrearQuiz = URL + "accion=crearQuiz";
    fetch(urlCompletaCrearQuiz, {
      method: 'POST',
      body: JSON.stringify(datos),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // mostrar un mensaje de éxito o redirigir a otra página
      });
  }

};




//  ========= Seccion sidebar =========
document.querySelector('#boton_cerrarSesion').addEventListener('click', function(ev) {
  ev.preventDefault();
  console.log("Se cerrara sesion");
  // alert("Se cerrara sesion");
  const urlCompleta = URL + "accion=cerrarSesion";
  //indiciar que usuario va a cerrar sesion
  fetch(urlCompleta)
  .then(response => {
    if (response.ok) {
      window.location.href='../views/registro.html';
    } else {
      console.log('Error al cerrar sesión');
    }
  });

});

//  ========= Seccion Filtrado =========

// Barra de busqueda

function buscar(event) {
  //console.log("Función buscar() llamada"); // verificar si la función se está llamando correctamente
  
  if (event.keyCode === 13) {
    event.preventDefault(); // evitar que se envíe el formulario dos veces
    const busqueda = event.target.value; //Obtenemos el valor del input
    console.log("Busqueda: "+busqueda);
    const url = `http://localhost/Myquiz/api/controllers/controller.php?accion=getBusquedaQuizzes&busqueda=${busqueda}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("La data obtenida es: "+data.value);
      const cardsContainer = document.querySelector('#cards-container');
      cardsContainer.innerHTML = '';
      data.forEach(producto => {
          const card = document.createElement('div');
          card.classList.add('card');
          // const imagen = document.createElement('img');
          // imagen.src = producto.imagen;
          const nombre = document.createElement('h3');
          nombre.textContent = producto.nombre_quiz;
          const precio = document.createElement('p');
          precio.textContent = `${producto.tiempo_quiz}`;
          // card.appendChild(imagen);
          card.appendChild(nombre);
          card.appendChild(precio);
          cardsContainer.appendChild(card);
      });
    });
      
    // .catch(error => console.log(error));
  
  }
};



//Cargar los cards dinamicos cuando se oprime el boton
document.querySelector('#cargar-productos').addEventListener('click', () => {
  console.log("=== Se presiono ====");
  const categoria = document.querySelector('#categoria').value;
  console.log("Categoria seleccionada: "+categoria);
  url = `obtener_categorias.php?accion=getProductos&categoria=${categoria}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
      console.log("Data: "+data.length);
      const tamResultados = data.length;
      const productosDiv = document.querySelector('#productos');
      productosDiv.innerHTML = '';
      const textoResultados = document.createElement('h2');
      textoResultados.textContent =  `Resultados encontrados: ${tamResultados}`;
      productosDiv.appendChild(textoResultados);
      data.forEach(producto => {
          const card = document.createElement('div');
          card.classList.add('card');
          const imagen = document.createElement('img');
          imagen.src = producto.imagen;
          const nombre = document.createElement('h3');
          nombre.textContent = producto.nombre;
          const precio = document.createElement('p');
          precio.textContent = `${producto.precio}`;
          card.appendChild(imagen);
          card.appendChild(nombre);
          card.appendChild(precio);
          productosDiv.appendChild(card);

      });
      // const textoResultados = document.crea
  })
  .catch(error => console.log(error));
});


//  ========= Seccion Cards Quizzes =========
//Obtener lista de quizzes que son públicos

function cargarQuizzesPublicos(cardsContainer) {
  
  urlCompleta = URL+"accion=getQuizzes";
  if(cardsContainer){
    fetch(urlCompleta)
    .then(response => response.json())
    .then(data => {
      data.forEach(quiz => {
        // console.log("====Entro al for =======");
        const card = document.createElement('div'); //Crea un elemento HTML en dl DOM
        card.classList.add('card');  //agrega una clase CSS llamada "productContainer" al elemento div 
        card.innerHTML = `
            <h1>Titulo</h1>
            <h3>${quiz.nombre_quiz}</h3>
            <p>${quiz.tiempo_quiz}</p>   
        `;
        cardsContainer.appendChild(card);
      });  
    });
  }
}

// Cargar grupos que el usuario esta inscrito
function cargarGruposUsuario(){
  const urlCompleta = URL + "accion=getGrupos";
  console.log("url: "+urlCompleta);
  fetch(urlCompleta)
  .then(response => response.json())
  .then(data => {
      console.log(data);
      const categoriaSelect = document.querySelector('#categoria');
      data.forEach(categoria => {
          const option = document.createElement('option');
          option.value = categoria.id;
          option.textContent = categoria.nombre;
          categoriaSelect.appendChild(option);
      });
  })
  .catch(error => console.log(error));
}


//Obtener los datos de un quiz en especifico cuando se oprime el boton de cargarQuiz

function cargarQuiz(){

  const urlParams = new URLSearchParams(window.location.search);
  console.log("La url es: "+urlParams);
  const quizID = urlParams.get('id');

  //Si encontro un quiz con el mismo ID que se paso
  if (quizID) {
    // Si hay un parámetro "id", cargar los datos del quiz correspondiente en los inputs
    fetch(`/api/quizzes/${quizID}`)
      .then(response => response.json())
      .then(data => {
        tituloQuizInput.value = data.titulo;
        descripcionQuizInput.value = data.descripcion;
        pregunta1Input.value = data.pregunta1;
        respuesta1Input.value = data.respuesta1;
        // cargar otros datos en los demás inputs
      });
  }
}








