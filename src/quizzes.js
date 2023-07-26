const URL = "http://localhost/Myquiz/api/controllers/controller.php?";

import { verificarSesion } from './login.js';


document.addEventListener('DOMContentLoaded', async function (ev) {
  console.log("========== Iniciando Quizzes ==============");

  //Navbar
  const navbar = document.querySelector(".contenedor_nav");
  const botonCerrarSesion = document.getElementById("boton_cerrarSesion");
  const botonirQuizzes = document.querySelector(".contenedor_principal_quizzes");
  const botonirGrupos = document.querySelector(".contenedor_principal_grupos");

  //Quizzes
  const contenedorQuizzes = document.querySelector(".contenedor_principal_quizzes");
  
  // const botonCrearQuiz = document.querySelector(".crear_quiz");
  // const botonModificarQuiz = document.querySelector(".modificar_quiz");

  // Quizzes -- Filtrado
  const cardsContainerQuizzes = document.querySelector('#cards-container');
  const inputBusqueda = document.getElementById("busqueda");
  
  
  const formLogin = document.querySelector("#form_login");
  //Verificamos que el usuario siga activo
  //Verificamos que el usuario siga activo
  verificarSesion().then(verificacion => {
    console.log("Res de la verificación es: " + verificacion);

    if(verificacion == true){
          //Carga los cards de los quizzes
        if(contenedorQuizzes){
            cargarQuizzesPublicos(cardsContainerQuizzes);
            //Cargar las secciones para el filtrado
            cargarGruposUsuario();
            //Se hará una busqueda por palabra
            inputBusqueda.addEventListener("keydown", buscar);
            botonModificarQuiz.addEventListener('submit', cargarQuiz); 
            //obtener los datos del usuario para enviarselos a la interfaz EditarQuiz
        }
        if(navbar){
            // Recuperar el valor del sessionStorage para mostrar el nombre en la navbar
            const datosUsuarioString = localStorage.getItem('datosUsuario');
            const datosUsuario = JSON.parse(datosUsuarioString);
            try {
              
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
            // datosUsuario = [];
            if(botonCerrarSesion){
                botonCerrarSesion.addEventListener('click',cerrarSesionUsuario);
            }


        }
    }
    else{
      document.querySelector('.mensajeErrorSesion').innerHTML = "La sesión ha expirado";
      setTimeout(function() {
        window.location.href = 'login.html';
      },1000);
    }
  });
  
});


//  ========= Seccion sidebar =========
function cerrarSesionUsuario(){
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

};

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
  
  const urlCompleta = URL+"accion=getQuizzes";
  if(cardsContainer){
    fetch(urlCompleta)
    .then(response => response.json())
    .then(data => {
      data.forEach(quiz => {
        // console.log("====Entro al for =======");
        const card = document.createElement('div'); //Crea un elemento HTML en dl DOM
        card.classList.add('card');  //agrega una clase CSS llamada "card" al elemento div 
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

function cargarQuizEspecifico(){

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








