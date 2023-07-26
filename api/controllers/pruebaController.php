<?php
  // include_once "../database/DataBase.php";
  include_once "../models/model.php";

 
function cerrarSesionController() {
  $model = new Model();

  // Obtener el identificador único del usuario actual almacenado en la variable de sesión
  $idUsuarioActual = $_SESSION['idUsuario']; // Reemplaza 'idUsuario' con el nombre de tu variable de sesión que almacena el ID del usuario
  echo "id usuario actual: ".$idUsuarioActual;
  $idUsuarioCerrarSesion = $model->buscarUsuarioID($idUsuarioActual);

//   // Verificar si el usuario actual es el mismo que desea cerrar sesión
//   if ($idUsuarioCerrarSesion == $idUsuarioActual) {
//     // Destruir la sesión actual
//     session_destroy();
//     $response = [
//       'status' => 'sesionCerrada',
//       'message' => 'Se va a cerrar sesion'
//     ];

//   } 
//   else {
//   // El usuario que desea cerrar sesión no coincide con el usuario actual
//     $response = [
//       'status' => 'errorCerrarSesion',
//       'message' => 'No se pudo cerrar sesion'
//     ];
//   }

  header('Content-Type: application/json');
//   echo json_encode($response);
  exit();
}
cerrarSesionController();



  


