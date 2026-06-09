<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Firebase-Token');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include secure database connection
require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/auth_middleware.php';

// Verify ID token
$authUser = requireAuth($pdo);

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['full_name']) || !isset($data['city'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Full name and city are required."]);
    exit();
}

try {
    $address = isset($data['address']) ? htmlspecialchars(strip_tags($data['address'])) : null;
    $pincode = isset($data['pincode']) ? htmlspecialchars(strip_tags($data['pincode'])) : null;

    // Update the authenticated user's own record
    $stmt = $pdo->prepare("UPDATE users SET full_name = ?, city = ?, address = ?, pincode = ? WHERE id = ?");
    $stmt->execute([
        htmlspecialchars(strip_tags($data['full_name'])),
        htmlspecialchars(strip_tags($data['city'])),
        $address,
        $pincode,
        $authUser['id']
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Profile updated successfully."
    ]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
