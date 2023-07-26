<?php
    include_once "../database/DataBase.php";
    include_once "../models/model.php";
    session_start();
    //Devuelve el método de solicitud utilizado para acceder a la página (como POST)
    $methods = $_SERVER['REQUEST_METHOD'];
    
    switch ($methods) {
      case "GET":
            ReadQuizzes();
        break;
      case "POST":
        if(isset($_POST['correo']) && isset($_POST['password'])){
            inicioSesion();
        }
        else{
            CrearQuiz();
        }
        break;
      case "PUT":
        actualizarQuiz();
        break;
      case "DELETE":
        eliminarQuiz();
        break;
      default:
        http_response_code(404);
        break;
    }


    function inicioSesion(){
      
        $correo = $_POST['correo'];
        $pass = $_POST['password'];
        $tasks = new Model();
        $tasks->setCorreo($correo);
        $tasks->setPassword($pass);

        $result = $tasks->inicioSesion();

        
        //Numero de registros que coincidan con la consulta
        if($result > 0){
            echo 'true';

        }else{
            echo 'false';
        }
        //Para obtener el id
        $getID = $tasks->getId_User();   //Retorna el id del usuario
        $tasks->setIdUsuario($getID);
        
    }

    function ReadQuizzes(){
        //Modelo
        $getID = $tasks->getId_User();   

        $resultado = $tasks->getQuizzes();
        //echo $getID, "\n";
        if ($resultado) {
            http_response_code(200);
            echo $resultado;
          } else {
            http_response_code(404);
          }
    }

//Crear un registro
    function CrearQuiz(){
            
    }
    function eliminarQuiz(){

    }

    function actualizarQuiz(){

    }

  




