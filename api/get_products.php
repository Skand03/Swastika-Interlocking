<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/db_connect.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM products ORDER BY id DESC");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($products as &$p) {
        if (!empty($p['variants'])) {
            $p['variants'] = json_decode($p['variants'], true);
        } else {
            $p['variants'] = [];
        }
    }

    echo json_encode([
        "success" => true,
        "products" => $products
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
