<?php
    class Model{
        private int $id_quiz;
        private int $fk_id_usuario;
        private int $fk_id_grupo;
        private string $nombre_quiz;
        private int $tiempo_quiz;



        function __construct() {
            $dsn = 'mysql:host=localhost;dbname=mvc_login';
            $username = 'root';
            $password = '';
            $options = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            );
    
            try {
                $this->pdo = new PDO($dsn, $username, $password, $options);
            } catch (PDOException $e) {
                echo 'Connection failed: ' . $e->getMessage();
                exit();
            }
        }

        private int $aux_id_usuario;

        private string $correo;
        private string $pass;

        public function setIdQuiz(int $id_quiz){
            $this->id_quiz = $id_quiz;
        }
        public function setIdUsuario(int $fk_id_usuario){
            $this->fk_id_usuario = $fk_id_usuario;
        }
        public function setIdGrupo(string $fk_id_grupo){
            $this->fk_id_grupo = $fk_id_grupo;
        }
        public function setNombreQuiz(string $nombre_quiz){
            $this->nombre_quiz = $nombre_quiz;
        }
        public function setTiempoQuiz(int $tiempo_quiz){
            $this->tiempo_quiz = $tiempo_quiz;
        }

        public function setCorreo(string $correo){
            $this->correo = $correo;
        }

        public function setPassword(string $pass){
            $this->pass = $pass;
           
        }

        public static function All(){
            $sql = "SELECT * FROM tasks";
            $statement = Database::Connect()->prepare($sql);
            $statement->execute();
        
            $array = [];
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
              $array[] = $row;
            }
        
            return json_encode($array);
        }

        public function Create(){
            $sql = "INSERT INTO QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) VALUES(?,?,?,?)";
        
            $statement = Database::Connect()->prepare($sql);
            $statement->bindParam(1, $this->fk_id_usuario);
            $statement->bindParam(2, $this->fk_id_grupo);
            $statement->bindParam(3, $this->nombre_quiz);
            $statement->bindParam(4, $this->tiempo_quiz);
            $statement->execute();
            return $statement->rowCount();
        }
        public function register($username, $email, $password) {
            $sql  = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = Database::Connect()->prepare($sql);
            $stmt->execute([$username, $email, $hashed_password]);
            return Database::Connect()->lastInsertId(); //Devuelve el ID de la última fila insertada o valor de secuencia
        }

        public function inicioSesion($correoUser, $passwordUser){
            $sql = "SELECT correo,contraseña FROM USUARIO WHERE correo =? AND contraseña =?";        
            $statement = Database::Connect()->prepare($sql);
            // echo "Los datos son correo: $correo y contraseña: $pass";
            $statement->bindParam(1, $correoUser);
            $statement->bindParam(2, $passwordUser);
            $statement->execute();
            return $statement->rowCount();
        }


        public function getId_User(){
            $sql = "SELECT id_usuario FROM USUARIO WHERE correo =?";
            $statement = Database::Connect()->prepare($sql);
            $statement->bindParam(1, $this->correo);
            $statement->execute();
            $id_Usuario_sel = $statement->fetchColumn();
            return json_encode($id_Usuario_sel);
        }

        public function getQuizzes(){
            $sql = "SELECT * FROM QUIZZ WHERE fk_id_usuario =?";
            $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8');
            $statement = Database::Connect()->prepare($sql);
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
        
    }