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

$phone = trim($data['phone']);

if (strlen($phone) !== 10 || !ctype_digit($phone)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid phone number format."]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    if ($stmt->fetch()) {
        // Phone is registered, send OTP
        echo json_encode([
            "success" => true,
            "message" => "OTP sent to WhatsApp. (Use 1234 to login)"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Phone number not registered. Please register first."
        ]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error."]);
}
?>
