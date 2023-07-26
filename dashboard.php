
<?php
    session_start();
   
    /*
    if (!isset($_SESSION['user_id'])) {
        header('Location: login.php');
        exit();
    }

    require_once 'api/controllers/controller.php';

    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    echo "path: $path";

    $controller = new Controller();

    if ($path == '/register') {
        $controller->register();
    } else if ($path == '/login') {
        $controller->inicioSesion();
    } else if ($path == '/logout') {
        $controller->logout();
    }
    */