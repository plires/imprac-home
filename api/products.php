<?php
header('Content-Type: application/json');

$host     = 'localhost';
$dbname   = 'impracco_pisos';
$user     = 'impracco_pisos';
$password = 'T4;Y}9;T~mC_';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM products ORDER BY nombre_comercial");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $products = array_map(function($row) {
        $precio_caja          = (float) $row['precio_caja'];
        $m2_por_caja          = (float) $row['m2_por_caja'];
        $row['precio_caja']   = $precio_caja;
        $row['m2_por_caja']   = $m2_por_caja;
        $row['precio_m2']     = $m2_por_caja > 0 ? $precio_caja / $m2_por_caja : 0;
        $row['garantia_anos'] = (int) $row['garantia_anos'];
        $row['stock_cajas']   = (int) $row['stock_cajas'];
        return $row;
    }, $rows);

    echo json_encode($products);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
