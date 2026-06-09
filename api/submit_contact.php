<?php
// submit_contact.php - Secured with PDO Prepared Statements
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include secure database connection
require_once __DIR__ . '/db_connect.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON data received."]);
    exit;
}

$name = isset($data['name']) ? trim($data['name']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$requirements = isset($data['requirements']) ? trim($data['requirements']) : '';

if (empty($name) || empty($phone)) {
    echo json_encode(["success" => false, "message" => "Name and phone number are required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO messages (name, phone, requirements) VALUES (:name, :phone, :req)");
    $stmt->execute([
        ':name' => htmlspecialchars(strip_tags($name)),
        ':phone' => htmlspecialchars(strip_tags($phone)),
        ':req' => htmlspecialchars(strip_tags($requirements))
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Message submitted successfully."
    ]);
} catch (\PDOException $e) {
    error_log("DB Error in submit_contact: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Failed to submit message."]);
}
?>
