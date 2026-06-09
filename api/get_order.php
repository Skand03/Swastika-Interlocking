<?php
// get_order.php - retrieve a single order by order_id
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once __DIR__ . '/db_connect.php';

$orderId = $_GET['id'] ?? null;
if (!$orderId) {
    echo json_encode(["success" => false, "message" => "Missing order id."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE order_id = :order_id");
    $stmt->execute([':order_id' => $orderId]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($order) {
        echo json_encode(["success" => true, "order" => $order]);
    } else {
        echo json_encode(["success" => false, "message" => "Order not found."]);
    }
} catch (\PDOException $e) {
    error_log("DB Error in get_order: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>
