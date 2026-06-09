<?php
// reset_password.php - Secured with PDO Prepared Statements
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

if (!$data || empty($data['phone']) || empty($data['otp']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Phone number, OTP, and new password are required."]);
    exit;
}

$phone = trim($data['phone']);
$otp = trim($data['otp']);
$newPassword = $data['password'];

if ($otp !== '1234') {
    echo json_encode(["success" => false, "message" => "Invalid OTP code. Please enter 1234."]);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters long."]);
    exit;
}

try {
    // Check if phone number is registered
    $stmt = $pdo->prepare("SELECT id FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "Phone number is not registered."]);
        exit;
    }

    // Securely hash the new password using bcrypt
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    // Update password in the database
    $stmtUpdate = $pdo->prepare("UPDATE users SET password = ? WHERE phone = ?");
    $stmtUpdate->execute([$hashedPassword, $phone]);

    echo json_encode([
        "success" => true,
        "message" => "Password reset successfully! You can now log in with your new password."
    ]);

} catch (\PDOException $e) {
    error_log("DB Error in reset_password.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
