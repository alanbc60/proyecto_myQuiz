<?php
    require_once 'Usuario.php';
    class Model{

        private $pdo;
        function __construct() {
            $options = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            );

            try {
                $this->pdo = new PDO('mysql:host=localhost;dbname=myquiz;charset=UTF8', 'root', '');
                // $this->pdo = new mysql('mysql:host=localhost;dbname=myquiz;charset=UTF8', 'root', '');
            } catch (PDOException $e) {
                echo 'Connection failed: ' . $e->getMessage();
                exit();
            }
        }


        function All(){
            $sql = "SELECT * FROM tasks";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();

            $array = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
              $array[] = $row;
            }

            return json_encode($array);
        }

        public function Create(){
            $sql = "INSERT INTO QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) VALUES(?,?,?,?)";
            $statement = $this->pdo->prepare($sql);
            $statement->bindParam(1, $this->fk_id_usuario);
            $statement->bindParam(2, $this->fk_id_grupo);
            $statement->bindParam(3, $this->nombre_quiz);
            $statement->bindParam(4, $this->tiempo_quiz);
            $statement->execute();
            return $statement->rowCount();
        }

        // ========= Seccion login,registro =============

        //Cerrar sesion
        public function cerrarSesionBD() {

            // Elimina los datos de sesión
            $_SESSION = array();
            // Destruye la sesión
            session_destroy();
            return true;
        }

        //registro
        //Modificar que retorne un 1 o 0 con rowCount
        public function register($nombre, $email, $password) {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            // $user = new Usuario(null, $nombre, $email, $hashed_password);

            $sql  = "INSERT INTO USUARIO (nombre, correo, contraseña) VALUES (?, ?, ?)";

            //Pasar los parametros 
            $row['nombre'] = $nombre;
            $row['correo'] = $email;

            $user = new Usuario(null, $row['nombre'], $row['correo'], $hashed_password);

            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(1, $user->getUsername());
            $stmt->bindValue(2, $user->getEmail());
            $stmt->bindValue(3, $user->getPassword());
            $stmt->execute();

            //Consulta rapida del usuario para ver si se creo el usuario y devolverlo al controller
            $consulta = "SELECT * FROM USUARIO WHERE nombre = ? AND correo = ? AND contraseña = ?";
            $stmt2 = $this->pdo->prepare($consulta);

            $stmt2->bindValue(1, $user->getUsername());
            $stmt2->bindValue(2, $user->getEmail());
            $stmt2->bindValue(3, $user->getPassword());
            $stmt2->execute();
            $resultado = $stmt2->rowCount();
            
            if ($resultado == 0) {
                return null;
            }
            else{
                return $user;
            }
            // Recuperar el ID del usuario recién registrado
            // $user_id = $this->pdo->lastInsertId();
            // return $user_id;
        }

        //inicio sesion
        public function inicioSesionBD($email, $passwordUser) {
            // Consultar la base de datos para encontrar un usuario con el correo electrónico proporcionado
            $sql = "SELECT * FROM USUARIO WHERE correo =?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(1, $email);
            $stmt->execute();
            $result = $stmt->rowCount();
            //echo "el resultado es:" .$result;
            //Devolver null si no se encontró ningún usuario con el correo electrónico proporcionado
            if ($result == 0) {
                return null;
            }

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $hashed_password = $row['contraseña'];
            // echo $passwordUser;
            // echo $hashed_password;
             // Verificar la contraseña proporcionada con la contraseña almacenada en la base de datos
             if (password_verify($passwordUser, $hashed_password)) {
                $user = new Usuario($row['id_usuario'], $row['nombre'], $row['correo'], $hashed_password);
                //echo "Contraseñas iguales";
                return $user;
            } else {
                return 0;
            }
        }



        public function buscarPorEmail($correo) {
            $sql = "SELECT * FROM USUARIO WHERE correo = :correo LIMIT 1";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(":email", $correo);
            $stmt->execute();
            //devuelve un array asociativo
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function buscarUsuarioIDBD($user_id){
          $sql = "SELECT * FROM USUARIO WHERE id_usuario = ?";
          $stmt = $this->pdo->prepare($sql);
          $stmt->bindValue(1, $user_id);
          $stmt->execute();
          $result = $stmt->rowCount();

          $row = $stmt->fetch(PDO::FETCH_ASSOC);
        //   echo "result: ".$result;
          if ($result != 0) {
            // echo "=== Entro al if ===";
            $hashed_password = $row['contraseña'];
            $user = new Usuario($row['id_usuario'], $row['nombre'], $row['correo'], $hashed_password);
            $resultado = $user->getId(); 
            // echo "ID ".$user->getId();
            // echo gettype($resultado);
            return $resultado;
          } else {
            return 0;
          }
        }
        


        // ========= Seccion Quizzes =============

        public function busquedaQuizzesBD($nombre) {
            $query = $this->pdo->prepare('SELECT * FROM QUIZZ WHERE nombre_quiz = ?');
            // $query->bindValue(':categoria_id', $categoria, PDO::PARAM_INT);
            $query->bindParam(1, $nombre);
            $query->execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }

        public function obtenerNombreGrupo() {
            $sql = 'SELECT nombre FROM GRUPO';
            $query = $this->pdo->prepare($sql);
            $query->execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getQuizzesUsuario(){
            $sql = "SELECT * FROM QUIZZ WHERE fk_id_usuario =?";
            $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8');
            $statement = $this->pdo->prepare($sql);
            $statement->bindParam(1, $this->fk_id_usuario);
            $statement->execute();
            //la función fetch() devuelve una fila de la consulta. En cada iteración del bucle,
            // la función fetch() devuelve una fila como un arreglo asociativo (es decir, con las claves
            // como los nombres de las columnas y los valores como los datos de cada columna).
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
              $array[] = $row;
            }
            return json_encode($array);
        }

        //cargar quizzes para usuario registrado
        function getQuizzesPublicosBD() {
            // Realizar una consulta para obtener los productos
            $sql = 'SELECT * FROM QUIZZ';
            $resultado = $this->pdo->query($sql);
            // Crear un array para almacenar los productos
            $productos = [];

            // Recorrer los resultados de la consulta y agregarlos al array de productos
            while ($producto = $resultado->fetch()) {
              $productos[] = $producto;
            }

            // Cerrar la conexión a la base de datos
            // $conexion = null;
            $this->pdo = null;
            // Devolver los productos como un array JSON
            // echo json_encode($productos);
            return $productos;
        }

        // ========= Seccion Edicion quizzes =============

        // public function crearQuiz($nombre, $email, $password) {

        //     $quiz = new QUIZZ($nombreQuiz, $username, $tiempo, $imagen);
        //     $sql  = "INSERT INTO USUARIO (nombre, correo, contraseña) VALUES (?, ?, ?)";
        //     $stmt = $this->pdo->prepare($sql);
        //     $stmt->bindValue(1, $user->getUsername());
        //     $stmt->bindValue(2, $user->getEmail());
        //     $stmt->bindValue(3, $user->getPassword());
        //     $stmt->execute();
        //     // Recuperar el ID del usuario recién registrado
        //     $user_id = $this->pdo->lastInsertId();
        //     return $user_id;
        // }

    }

    // $nombre = "alan";
    // $email = "prueba@gmail.com";
    // $password = "seer1234";

        $modelito = new Model();
        $modelito->buscarUsuarioIDBD(1);
    // $modelito->findByEmailAndPassword($email,$password);