<?php
  // include_once "../database/DataBase.php";
  include_once "../models/model.php";

  $nombreUsuario;


  function getDatos(){
    global $nombreUsuario;
    echo $nombreUsuario;
  }
  function inicioSesionController() {
    //Destruye la sesion si el tiempo de inactividad supera a la cantidad en segundos
    //ini_set('session.gc_maxlifetime', 30);
  
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['accion'])) {
        //Si el correo y contraseña no son nulos en el formulario
        if (isset($_POST['login_correo']) && isset($_POST['login_password'])) {
            //Obtener los datos del formulario
            $correo = $_POST['login_correo'];
            $pass = $_POST['login_password'];

            // Llamar al modelo para verificar las credenciales del usuario que se envían por sesión
            $model = new Model();
            $user = $model->inicioSesionBD($correo, $pass);

            if (!$user) {
                $response = [
                    'status' => 'false'
                ];
                echo json_encode($response);
            } 
            else{
                //necesito iniciar una session para validar las variables 
                //La función session_start() verifica si una sesión ya está iniciada para el cliente y, si no es así, 
                //inicia una nueva sesión. Si ya se ha iniciado una sesión para el cliente, simplemente reanuda la sesión 
                //existente en lugar de crear una nueva.
                session_start();
                // Verificar si el usuario ya ha iniciado sesión
                if (isset($_SESSION['user_id'])) { //Verifica si la variable user_id existe y no es nula
                  // Comparar el ID de usuario almacenado en la sesión con el usuario actual
                  if ($_SESSION['user_id'] == $user->getId()) {
                    session_destroy(); // Destruir la sesión anterior
                    session_start();  //Le creamos una nueva sesion

                    // Guardar los datos del usuario de  la nueva sesión
                    $_SESSION['user_id'] = $user->getId();
                    $_SESSION['nombre_usuario'] = $user->getUsername();
                    $_SESSION['correo'] = $user->getEmail();

                    // $response = [
                    //   'user_id' => $user->getId(),
                    //   'nombre_usuario' => $user->getUsername(),
                    //   'correo' => $user->getEmail(),
                    //   'aviso' => 'Se creo una nueva sesion y se borro la anterior'
                    // ];

                    $response = [
                      'user_id' => $_SESSION['user_id'],
                      'nombre_usuario' => $_SESSION['nombre_usuario'],
                      'correo' => $_SESSION['correo'] ,
                      'aviso' => 'Se creo una nueva sesion y se borro la anterior :c'
                    ];
                    // Verificar la sesión
                    verificarSesionUsuario($response);
                    // exit();
                  }
                }

                //El usuario inicia sesion sin antes iniciar 
                else{
                  // session_start();
                  // Guardar los datos del usuario en la sesión
                  $_SESSION['user_id'] = $user->getId();
                  $_SESSION['nombre_usuario'] = $user->getUsername();
                  $_SESSION['correo'] = $user->getEmail();
  
                  $response = [
                      'user_id' => $user->getId(),
                      'nombre_usuario' => $user->getUsername(),
                      'correo' => $user->getEmail(),
                      'aviso' => 'Se creo una nueva sesion sin antes iniciar sesion'
                  ];
  
                  // Verificar la sesión
                  verificarSesionUsuario($response);
                }

            }
        }
    } 
    else {
        $response = [
            'status' => 'errorHTTP',
            'message' => 'No se realizó la petición HTTP'
        ];
        echo json_encode($response);
        exit();
   }
}

function verificarSesionUsuario($response) {
  // Verificar si existe una sesión activa en general
  if (isset($_SESSION['user_id'], $_SESSION['nombre_usuario'], $_SESSION['correo'])) {
    // Obtener la identificación única del usuario actual
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['nombre_usuario'];
    $email = $_SESSION['correo'];

    // Verificar si la sesión activa pertenece al usuario actual
    if ($user_id === $response['user_id'] && $username === $response['nombre_usuario'] && $email === $response['correo']) {
      $response['status'] = 'comprobado';
      $response['message'] = 'La sesión es válida para el usuario actual';
    } else {
      $response = [
        'status' => 'errorUsuarioActual',
        'message' => 'La sesión no pertenece al usuario actual'
      ];
    }
  } 
  else {
    $response = [
      'status' => 'errorSesion',
      'message' => 'No hay sesión activa'
    ];
  }

  header('Content-Type: application/json'); 
  echo json_encode($response);
  exit();
}



function permanecerSesionUsuarioController() {
  session_start();
  // Verificar si existe una sesión activa en general
  if (isset($_SESSION['user_id'], $_SESSION['nombre_usuario'], $_SESSION['correo'])) {
    // Obtener la identificación única del usuario actual
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['nombre_usuario'];

    // Verificar si la sesión activa pertenece al usuario actual
    if ($user_id === $_SESSION['user_id'] && $username === $_SESSION['nombre_usuario']) {
      $response = [
        'status' => 'verificado',
        'message' => 'sigue estando activo'
      ];
    } 
    else {
      $response = [
        'status' => 'errorUsuarioActual',
        'message' => 'La sesión no pertenece al usuario actual'
      ];        
    }
  } 
  else {
    $response = [
      'status' => 'errorSesion',
      'message' => 'No hay sesion activaaaaaaaaaaaaaaaaaaaaaaaa'
    ];
  }

  // Devolver la respuesta en formato JSON
  // header('Content-Type: application/json');
  echo json_encode($response);
  exit();
}


function cerrarSesionController() {
  session_start();  
  // Obtener el identificador único del usuario actual almacenado en la variable de sesión
  $idUsuarioActual = $_SESSION['user_id']; // Reemplaza 'idUsuario' con el nombre de tu variable de sesión que almacena el ID del usuario
  $model = new Model();
  $idUsuarioCerrarSesion = $model->buscarUsuarioIDBD($idUsuarioActual);
  $response = [
    'dato' => $idUsuarioCerrarSesion,

  ];
  // Verificar si el usuario actual es el mismo que desea cerrar sesión
  if ($idUsuarioCerrarSesion == $idUsuarioActual) {
    // Destruir la sesión actual
    session_destroy();
    $response = [
      'status' => 'sesionCerrada',
      'message' => 'Se va a cerrar sesion'
    ];

  } 
  else {
  // El usuario que desea cerrar sesión no coincide con el usuario actual
    $response = [
      'status' => 'errorCerrarSesion',
      'message' => 'No se pudo cerrar sesion'
    ];
  }

  header('Content-Type: application/json');
  echo json_encode($response);
  exit();
}



function registrarUsuario(){
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['accion'])){
        // Obtener los datos del formulario
        $username = $_POST['registro_nombre'];
        $email = $_POST['registro_correo'];
        $password = $_POST['registro_password'];
        $model = new Model();
        $user = $model->register($username, $email, $password);

        if($user != null){
         
          session_start();
          $_SESSION['username'] = $username;
          $_SESSION['correo'] = $email;
          $_SESSION['password'] = $password;
          echo "true";
        }
        else{
            echo "false";
        }
    }
}

    function getQuizzes(){
      $model = new Model();
      $resultado = $model->getQuizzesPublicosBD();
      echo json_encode($resultado);//Devuelve un array asociativo
    }

    function getNombreGrupos(){
      $modelo = new Model();
      $categorias = $modelo->obtenerNombreGrupo();
      header('Content-Type: application/json');
      echo json_encode($categorias);
    }

    function busqueda(){
      $nombre = $_GET['busqueda'];
      $modelo = new Model();
      $Quizzes = $modelo->busquedaQuizzesBD($nombre);
      header('Content-Type: application/json');
      echo json_encode($Quizzes);
    }


    //Crear un registro
    function CrearQuiz(){
      // Esas variables son las que hacen referencia a name del input
      if(isset($_POST['nombreQuiz']) && isset($_POST['username']) && isset($_POST['tiempoQuiz']) && isset($_POST['imagenQuiz']) ){
          //Obtener los datos del formulario
          $nombreQuiz = $_POST['nombreQuiz'];
          $username = $_POST['username'];
          $tiempo = $_POST['tiempoQuiz'];
          $imagen = $_POST['imagenQuiz'];

          $model = new Model();
          $user = $model->inicioSesionBD($nombreQuiz, $username,$tiempo,$imagen);
      }
    }
    
    function eliminarQuiz(){

    }

    function actualizarQuiz(){

    }


    


  // Maneja la solicitud Fetch
  // $_GET['accion'], se utiliza para recuperar el valor del parámetro "accion" enviado a 
  // través de la URL en una solicitud GET


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['accion'])) {

  // Maneja la solicitud Fetch para mostrar los registros
  if($_GET['accion'] === 'getQuizzes') {
    getQuizzes();
  }
  else if($_GET['accion'] === 'getGrupos') {
    getNombreGrupos();
  }
  else if($_GET['accion'] === 'getBusquedaQuizzes') {
    busqueda();
  }
  else if($_GET['accion'] === 'getDatos') {
    getDatos();
  }
  else if($_GET['accion'] === 'cerrarSesionUsuario') {
    cerrarSesionController();
  }
  else if ($_GET['accion'] === 'permanecerSesionUsuario') {
    permanecerSesionUsuarioController(); 
  }
  else {
    http_response_code(404);
    exit();
  }
}
else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['accion'])) {
  if ($_GET['accion'] === 'inicioSesion') {
    inicioSesionController();
  }
  else if ($_GET['accion'] === 'registrarUsuario') {
    registrarUsuario();
  }
  
  else if ($_GET['accion'] === 'crearQuiz') {
      CrearQuiz();
    }
}




  


