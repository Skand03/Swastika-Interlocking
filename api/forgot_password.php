<?php
// forgot_password.php - Secured with PDO Prepared Statements
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include secure database connection
require_once __DIR__ . '/db_connect.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Phone number is required."]);
    exit;
}

$phone = trim($data['phone']);

try {
    // Check if phone number is registered
    $stmt = $pdo->prepare("SELECT id, full_name FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "Phone number is not registered. Please register first."
        ]);
        exit;
    }

    // Return success with simulated OTP (1234)
    echo json_encode([
        "success" => true,
        "message" => "A secure password reset OTP has been sent via WhatsApp to +91 " . $phone . ". (Use 1234 to verify)"
    ]);

} catch (\PDOException $e) {
    error_log("DB Error in forgot_password.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
