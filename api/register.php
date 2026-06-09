<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include secure database connection
require_once __DIR__ . '/db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['full_name']) || !isset($data['phone']) || !isset($data['city']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Required fields missing."]);
    exit();
}

try {
    // Check if phone number is already registered
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE phone = ?");
    $stmt->execute([$data['phone']]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(["success" => false, "message" => "Phone number already registered."]);
        exit();
    }

    // Hash the password securely with bcrypt
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (full_name, phone, city, password, role) VALUES (?, ?, ?, ?, 'customer')");
    $stmt->execute([
        htmlspecialchars(strip_tags($data['full_name'])),
        htmlspecialchars(strip_tags($data['phone'])),
        htmlspecialchars(strip_tags($data['city'])),
        $hashedPassword
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful! You can now log in."
    ]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
