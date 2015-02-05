<?php
header('content-type: application/json; charset=utf-8');
/* Descomentaríamos la siguiente línea para mostrar errores de php en el fichero: */
// ini_set('display_errors', '1');
/* Definimos los parámetros de conexión con la bbdd: */
$dbinfo = "mysql:dbname=municipios;host=localhost";
$user = "root";
$pass = "root";
//Nos intentamos conectar:
try {
    /* conectamos con bbdd e inicializamos conexión como UTF8 */
    $db = new PDO($dbinfo, $user, $pass);
    $db->exec('SET CHARACTER SET utf8');
} catch (Exception $e) {
    echo "La conexi&oacute;n ha fallado: " . $e->getMessage();
}
/* Para hacer debug cargaríamos a mano el parámetro, descomentaríamos la siguiente línea: */
        //$_POST['zip'] = "12";
if (isset($_POST['cp']) || 1) {
    /* La línea siguiente la podemos descomentar para ver desde firebug-xhr si se pasa bien el parámetro desde el formulario */
            //echo $_REQUEST['email'];
    if (strlen($_POST['zip']) >= 2) {
        $cp = substr($_POST['zip'], 0, 2);
    } else {
        $cp = $_POST['cp'];
    }
    $sql = $db->prepare("SELECT * FROM t_municipios WHERE CodPostal=?");
    $sql->bindParam(1, $cp, PDO::PARAM_STR);
    $sql->execute();

    $results = $sql->fetchAll(PDO::FETCH_ASSOC);
    $json = json_encode($results,JSON_UNESCAPED_UNICODE );

    echo($json);
}
$sql = null;
$db = null;

?>
