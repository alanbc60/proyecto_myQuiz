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


        public function register($nombre, $email, $password) {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $user = new Usuario(null, $nombre, $email, $hashed_password);
            $sql  = "INSERT INTO USUARIO (nombre, correo, contraseña) VALUES (?, ?, ?)";

            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(1, $nombre);
            $stmt->bindParam(2, $email);
            $stmt->bindParam(3, $hashed_password);
            $stmt->execute();
            // return $this->pdo->lastInsertId(); //Devuelve el ID de la última fila insertada o valor de secuencia
            return $stmt->rowCount();
        }

        public function inicioSesionBD($correoUser, $passwordUser){
            $sql = "SELECT correo,contraseña FROM USUARIO WHERE correo =? AND contraseña =?";        
            $statement = $this->pdo->prepare($sql);
            // echo "Los datos son correo: $correo y contraseña: $pass";
            $statement->bindParam(1, $correoUser);
            $statement->bindParam(2, $passwordUser);
            $statement->execute();
            return $statement->rowCount();
        }
        public function findByEmailAndPassword($email, $passwordUser) {
            // echo "============findByEmailAndPassword=========\n";
            // Consultar la base de datos para encontrar un usuario con el correo electrónico proporcionado
            $sql = "SELECT * FROM USUARIO WHERE correo =? AND contraseña =?"; 
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(1, $email);
            //$stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(2, $passwordUser);
            $stmt->execute();
            $result = $stmt->rowCount();
            // echo "result: $result";
        
            //Devolver null si no se encontró ningún usuario con el correo electrónico proporcionado
            if ($result == 0) {
              return null;
            }
            
            else{
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $user = new Usuario($row['id_usuario'], $row['nombre'], $row['correo'], $row['contraseña']);
                }
                return $user;
            }
                        
        }
        

        public function buscarPorEmail($correo) {
            $sql = "SELECT * FROM USUARIO WHERE correo = :correo LIMIT 1";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(":email", $correo);
            $stmt->execute();
    
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }


        public function getId_User(){
            $sql = "SELECT id_usuario FROM USUARIO WHERE correo =?";
            $statement = $this->pdo->prepare($sql);
            $statement->bindParam(1, $this->correo);
            $statement->execute();
            $id_Usuario_sel = $statement->fetchColumn();
            return json_encode($id_Usuario_sel);
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
        function getQuizzesNuevoUsuarioBD() {
            // Realizar una consulta para obtener los productos
            $sql = 'SELECT * FROM QUIZZ';
            $resultado = $this->pdo->query($sql);
            // Crear un array para almacenar los productos
            $productos = [];
            ////

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
    }

    // $modelito = new Model();
    // $modelito->findByEmailAndPassword("alanbc60@gmail.com","password123");