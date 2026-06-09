<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/auth_middleware.php';

// Verify Firebase Auth token and role admin
$authUser = requireAuth($pdo, ['admin']);

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Product ID is required."]);
    exit;
}

$productId = intval($data['id']);

try {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    
    echo json_encode(["success" => true, "message" => "Product deleted successfully."]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
