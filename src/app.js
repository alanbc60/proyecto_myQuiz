const URL = "http://localhost/Myquiz/api/controllers/controller.php?";



document.addEventListener('DOMContentLoaded', function () {
  console.log("========== Iniciando app ==============");
  const formLogin = document.querySelector("#form_login");
  const formRegistro = document.getElementById("form_registro");
  const cardsContainer = document.querySelector('#cards-container');


  if(formLogin){
      formLogin.addEventListener('submit', function(ev) {

        ev.preventDefault();
        const datosForm = new FormData(formLogin);
      
        //guardamos en una consante el correo
        const correo = datosForm.get('correo')
        console.log("El correo es: "+correo);
        console.log("Tipo de dato correo: "+typeof(correo));
      
        urlCompleta = URL+"accion=inicioSesion";
      
        //Fetch: primer parametro, url donde vamos a mandar la peticion
        fetch(urlCompleta, {
            method: "POST", 
            body: datosForm
          })
          .then(resp => resp.text())
          .then(async data => {
              console.log("La data recibida es: " + data);
      
              if(data == 'true'){
                console.log("Entro con exito");
                window.location.href='./views/quizzes.html';
                //Obtener el id del usuario que hizo login
      
                // Llamada a la función para obtener los registros al cargar la página
                //await getQuizzes();
              }
              else{
                console.log("===== Error al entrar =======");
                document.querySelector('.mensajeErrorLogin').innerHTML = "Correo o contraseña no válidos";
                console.log("Lo que recibi fue: "+data);
              }
          })
  
      });
  }


  if(formRegistro){
      formRegistro.addEventListener('submit', function (ev) {
        ev.preventDefault();
        const datosForm = new FormData(formRegistro);
        //guardamos en una consante el correo
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
              getQuizzesNuevoUsuario();
              window.location.href='../views/quizzes.html';

            }
            
            else{
              console.log("===== Error al registrarse =======");
              document.querySelector('.mensajeErrorLogin').innerHTML = "Correo o contraseña existentes";
              console.log("Lo que recibi fue: "+data);
            }
        })
  
      });
  }

});



function getQuizzesNuevoUsuario() {
  urlCompleta = URL+"accion=getProductos";
  fetch(urlCompleta)
  .then(response => response.json())
  .then(data => {

    data.forEach(producto => {
      console.log("====Entro al for =======");
      const card = document.createElement('div'); //Crea un elemento HTML en dl DOM
      card.classList.add('card');  //agrega una clase CSS llamada "productContainer" al elemento div 
      card.innerHTML = `

          <h3>${producto.nombre_quiz}</h3>
          <p>${producto.tiempo_quiz}</p>   
      `;
      cardsContainer.appendChild(card);

    });  

  });

}





// /**
//  * @param {Event} ev
//  */
// const logoutLink = async (ev) => {
//   console.log("======== Cerrando Sesion =======");
//   ev.preventDefault();
//   urlCompleta = URL+"accion=logout";

//   //Fetch: primer parametro, url donde vamos a mandar la peticion
//   fetch(urlCompleta, {
//     method: "POST", 
//     body: datosForm
//   })
//   .then(resp => resp.text())
//   .then(async data => {
//       console.log("La data recibida es: " + data);

//       console.log("===== Error al entrar =======");
//       window.location.href='../login.html';

      
//   })
// };










// const getQuizzes = async () => {
//   console.log("===== cargando datos =====")
//   const response = await fetch(URL);
//   const data = await response.json();
//   tasks = data;

//   console.log("Lista: "+data);
  
//   const productCatalog = document.querySelector('#productCatalog');
//   tasks.forEach((task) => {
//       const productContainer = document.createElement('div');
//       productContainer.classList.add('productContainer');
//       productContainer.classList.add(`${task.categoria}`);
//       productContainer.innerHTML = `
//           <div id="${task.id_quiz}" class="productContainer-card
//               <div class="contenedor_producto-texto">
//                   <h3 class="product__tittle">${task.nombre_quiz}</h3>
//                   <p class="product__price">${task.tiempo_quiz}</p>
//               </div>
//               <button class="fa-solid fa-cart-plus add-cart" type="button"></button>
//           </div>
//           `;
//       productCatalog.appendChild(productContainer);
//   });

// } 
