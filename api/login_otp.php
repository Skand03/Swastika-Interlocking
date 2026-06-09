<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['phone'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Phone number is required."]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id, full_name, phone, city, role FROM users WHERE phone = ?");
    $stmt->execute([$data['phone']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            "success" => true,
            "message" => "OTP Login successful.",
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Phone number not registered. Please register first."
        ]);
    }

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
