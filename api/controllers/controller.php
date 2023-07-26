<?php
  // include_once "../database/DataBase.php";
  include_once "../models/model.php";

    function inicioSesion(){

      if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['accion'])){
        if(isset($_POST['correo']) && isset($_POST['password'])){
          //Obtener los datos del formulario
          $correo = $_POST['correo'];
          $pass = $_POST['password'];

          // Llamar al modelo para verificar las credenciales del usuario
          $model = new Model();
          // $result = $model->inicioSesionBD($correo, $pass);
          $user = $model->findByEmailAndPassword($correo, $pass);
          
          if (!$user) {
            // Si las credenciales son incorrectas, mostrar un mensaje de error
            // $error_message = 'Email o contraseña incorrectos';
            // include 'views/login.php';
            echo "false";
          } else {
            echo "true";
            // Si las credenciales son correctas, iniciar la sesión del usuario
            session_start();
            $_SESSION['user_id'] = $user->getId();
            $_SESSION['correo'] = $user->getEmail();
            $_SESSION['password'] = $user->getPassword();
            

            // // Redirigir al usuario a la página de perfil
            // header('Location: profile.php');
          }

      
        }
      }
      logout();
    }

    function registrarUsuario(){
      if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['accion'])){
          // Obtener los datos del formulario
          $username = $_POST['registro_nombre'];
          $email = $_POST['registro_correo'];
          $password = $_POST['registro_password'];
          $model = new Model();
          $resultado = $model->register($username, $email, $password);

          if($resultado = 1){
            echo "true";
          }
          else{
            echo "false";
          }

      }

    }

    function getProductos(){
      $model = new Model();
      $resultado = $model->getQuizzesNuevoUsuarioBD();
      echo json_encode($resultado);//Devuelve un array asociativo
    }


    //Crear un registro
    function CrearQuiz(){
          
    }
    function eliminarQuiz(){

    }

    function actualizarQuiz(){

    }

    function logout() {
      // Eliminar los datos de sesión
      session_unset();
      session_destroy();
      exit();
    }

  
   




  // Maneja la solicitud Fetch
  // $_GET['accion'], se utiliza para recuperar el valor del parámetro "accion" enviado a 
  // través de la URL en una solicitud GET


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['accion'])) {
  // Maneja la solicitud Fetch para agregar un registro
  if ($_GET['accion'] === 'agregar') {
    CrearQuiz();
  }
  // Maneja la solicitud Fetch para mostrar los registros
  else if ($_GET['accion'] === 'mostrar') {
    ReadQuizzes();
  }
  else if($_GET['accion'] === 'getProductos') {
    getProductos();
   }
  else {
    http_response_code(404);
    exit();
  }
}
else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['accion'])) {
  if ($_GET['accion'] === 'inicioSesion') {
    InicioSesion();
  }
  else if ($_GET['accion'] === 'registrarUsuario') {
    registrarUsuario();
  }
}




  



